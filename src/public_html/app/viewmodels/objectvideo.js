﻿define([
    'durandal/app',
    'knockout',
    'mods/portal',
    'mods/state',
    'factory/object',
    'mods/xmlmanager',
    'mods/jsonformfields',
    'factory/metadata',
    'mods/format',
    'mods/player',
    'mods/timeline',
    'mods/objectmanager',
    'mods/timelineschemaselector'
],
        function (app, ko, portal, state, objfac, xmlman,
            jsonformfields, metadatafac, format, player, timeline, objectmanager,
            timelineschemaselector) {

            var obj = {};
            obj.guid;
            obj.data;
            obj.anndata;
            obj.anndatacount;
            obj.anndataschemacount = [];

            var isPlayerLoading = ko.observable(true);

            var title = ko.observable("Arbejdsløshedshæren");
            var channel = ko.observable();
            var publication = ko.observable();
            var abstracttxt = ko.observable();
            var description = ko.observable();

            var playerposition = ko.observable(0);

            var metadataViews = ko.observableArray();
            var metadataEditors = ko.observableArray();

            app.on('timelineschema:change').then(function (e) {

                var guid = e.guid;

                metadataViews.removeAll();
                timeline.clearData();

                var dic = [];
                for (var i = 0; i < timelineschemaselector.schemaItems().length; i++)
                    if (timelineschemaselector.schemaItems()[i].isactive())
                        dic[timelineschemaselector.schemaItems()[i].guid] = timelineschemaselector.schemaItems()[i];

                var dataarray = [];
                var amds = obj.anndata;

                if (amds == undefined)
                    return;

                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];

                    if (amd.MetadataSchemaGUID in dic) {
                        //var content = '<div title="' + amd.Title + '" style="background-color:rgba(128, 128, 255, 0.2)">&nbsp;' + amd.Title + '</div>'

                        var schitem = dic[amd.MetadataSchemaGUID];

                        var content = schitem.getContent(amd.Title);

                        var timestart = format.getSecondsFromString(amd.StartTime);
                        var timeend = format.getSecondsFromString(amd.EndTime);
                        timestart = player.getProgramTimeFromFileTime(timestart);
                        timeend = player.getProgramTimeFromFileTime(timeend);
                        timestart = timeline.start() + timestart * 1000;
                        timeend = timeline.start() + timeend * 1000;

                        // not editable
                        dataarray.push([new Date(timestart), new Date(timeend), content, false, amd.Id]);

                        var annview = new metadatafac.MetadataView();
                        annview.setview(Settings.Schema[amd.MetadataSchemaGUID].view, amd);
                        metadataViews.push(annview);

                    }

                }

                timeline.addData(dataarray);
            });

            app.on('annotation:add').then(function (e) {
                // TODO: Choose metadataschema if more are activated

                // Only comments for now!
                if (timelineschemaselector.schemaItems().length < 1 ||
                    timelineschemaselector.schemaItems()[0].isactive() == false) {
                    app.showMessage("Vaelg Comments ark for at annotere.");
                    return;
                }

                var schema = timelineschemaselector.schemaItems()[0];

                timeline.addItemAtCursor('new1');
                var dat = timeline.getSelection();

                metadataEditors.removeAll();
                // Add editor
                amd = {};
                amd.Id = 'new1';
                var editor = new metadatafac.MetadataView();
                editor.setview(Settings.Schema[schema.guid].edit, { guid: amd.Id, metadata: amd });
                metadataEditors.push(editor);
                timeline.editItem(amd.Id);

            });


            app.on('metadata:cancel').then(function (e) {
                var item = timeline.getSelection();
                if (item.id.substring(0, 3) == "new") {
                    timeline.deleteItemByID(item.id);
                }
                else
                    timeline.unselectItem();

                metadataEditors.removeAll();
            });


            app.on('metadata:save').then(function (e) {
                CHAOS.Portal.Client.Metadata.Set(
                e.guid, e.schemaguid, "da",
                1, e.xml, null).WithCallback(metadataSaved);

            });

            function metadataSaved(r) {

                if (r.Error != null) {
                    app.showMessage(r.Error.Message, "Error saving", ["OK", "Cancel"]);
                    return;
                }

                metadataEditors.removeAll();
            }

            app.on('metadata:changed_timeline').then(function (e) {
                var d = e.data;
                if (metadataEditors().length == 1) {
                    var ed = metadataEditors()[0];
                    if (ed.data.guid == d.id) {
                        ed.data.self.starttime(format.getTimeStringFromDate(d.start));
                        ed.data.self.endtime(format.getTimeStringFromDate(d.end));
                    }
                }
            });

            app.on('metadata:changed_editor').then(function (e) {
                var dat = timeline.getSelection();
                if (dat == undefined)
                    return;

                if (metadataEditors().length == 1) {
                    var ed = metadataEditors()[0];
                    if (ed.data.guid == dat.id) {
                        var s = ed.data.self.starttime();
                        var e = ed.data.self.endtime();
                        var t = ed.data.self.title();

                        if (s == "" || e == "")
                            return;

                        var timestart = timeline.start() + format.getMillisecondsFromString(s);
                        var timeend = timeline.start() + format.getMillisecondsFromString(e);
                        var content = '<div title="' + t + '">&nbsp;' + t + '</div>'
                        timeline.changeItem(new Date(timestart), new Date(timeend), content);
                    }
                }
            });

            app.on('metadata:edit').then(function (e) {

                var guid;

                if (e.data) {
                    if (e.data.Id)
                        guid = e.data.Id;
                }
                else if (e.id)
                    guid = e.id;

                if (!guid)
                    return;

                objectmanager.getByGuid(guid, function (r) {

                    window.scrollTo(0, 0);
                    metadataEditors.removeAll();
                    var mds = r.Metadatas;
                    for (var i = 0; i < mds.length; i++) {
                        if (Settings.Schema[mds[i].MetadataSchemaGuid].edit != '') {
                            timeline.editItem(guid);
                            var editor = new metadatafac.MetadataView();
                            editor.setview(Settings.Schema[mds[i].MetadataSchemaGuid].edit, { guid: r.Id, metadata: mds[i] });
                            metadataEditors.push(editor);
                        }
                    }

                });

                /*
                metadataEditors.removeAll();
                for (var i = 0; i < metadataViews().length; i++) {
                    var md = metadataViews()[i];
                    if (md.data == editorvm.data) {
                        var annview = new metadatafac.MetadataView();
                        annview.setview("annotationedit", md.data);
                        metadataEditors.push(annview);
                    }
                }
                */
            });

            // Getting data from API.
            function metadataReceived(data) {
                obj.data = data;
                var r = data.Body.Results[0];
                var mdsguid = state.searchMetadataSchemaGuids[0];
                if (r == undefined) {
                    app.showMessage("The data is not available for this object.", "Data missing", ["OK", "Cancel"]);
                    return;
                }
                if (r.Metadatas == undefined) {
                    app.showMessage("The metadata is not available for this object.", "Metadata missing", ["OK", "Cancel"]);
                    return;
                }

                timeline.state.subscribe(function (state) {
                    insertAnnotations();
                });

                // Initiate Player and callback functions
                player.init(r);
                player.position.subscribe(function (position) {
                    playerposition(position);
                    timeline.setPosition(playerposition());
                });
                player.duration.subscribe(function (duration) {
                    timeline.init(duration);
                    insertAnnotations();
                });

                // Get common metadata for the object
                for (var j = 0; j < r.Metadatas.length; j++) {
                    if (r.Metadatas[j].MetadataSchemaGuid == mdsguid) {
                        obj.metadataSchemaGuid = mdsguid;
                        var xml = r.Metadatas[j].MetadataXml;
                        var x = xmlman.parseXml(xml);
                        obj.metadata = x;

                        title($(x).find("Title").text());
                        channel($(x).find("PublicationChannel").text());
                        publication($(x).find("PublicationDateTime").text());
                        abstracttxt($(x).find("Abstract").text());
                        description($(x).find("Description").text());
                    }
                }
            }

            function loadAnnotations() {


            }

            function annotationsReceived(response) {

                obj.anndatacount = response.Body.Count;
                if (obj.anndatacount > 0)
                    obj.anndata = response.Body.Results;

                insertAnnotations();
            }

            var addSchemasDone = false;
            function addSchemas() {

                if (addSchemasDone)
                    return;

                addSchemasDone = true;
                timelineschemaselector.addSchemaItem("d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e", 25);
                timelineschemaselector.addSchemaItem("7bb8d425-6e60-9545-80f4-0765c5eb6be6", 0);
                timelineschemaselector.addSchemaItem("c446ad50-f1ea-f642-9361-3f6b56c5f320", 0);

            }

            var annotationsHaveBeenInserted = false;
            function insertAnnotations() {

                if (annotationsHaveBeenInserted)
                    return;

                if (obj.anndatacount !== undefined && obj.anndatacount == 0 &&
                    player.isReady() && timeline.isReady()
                    ) {
                    addSchemas();
                    isPlayerLoading(false);
                    return;
                }

                if (obj.anndata === undefined || !player.isReady() || !timeline.isReady()) {
                    return;
                }

                addSchemas();

                annotationsHaveBeenInserted = true;

                // amd.MetadataSchemaGUID
                // "d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e" Comments
                // "7bb8d425-6e60-9545-80f4-0765c5eb6be6" Lydkilder
                obj.anndataschemacount["d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e"] = 0;
                obj.anndataschemacount["7bb8d425-6e60-9545-80f4-0765c5eb6be6"] = 0;

                //var dataarray = [];
                var amds = obj.anndata;
                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];

                    var schguid = amd.MetadataSchemaGUID;
                    if (schguid in obj.anndataschemacount)
                        obj.anndataschemacount[schguid] = obj.anndataschemacount[schguid] + 1;
                    else
                        obj.anndataschemacount[schguid] = 1;

                    //var content = '<div title="' + amd.Title + '" style="background-color:rgba(128, 128, 255, 0.2)">&nbsp;' + amd.Title + '</div>'

                    //var timestart = format.getSecondsFromString(amd.StartTime);
                    //var timeend = format.getSecondsFromString(amd.EndTime);
                    //timestart = player.getProgramTimeFromFileTime(timestart);
                    //timeend = player.getProgramTimeFromFileTime(timeend);
                    //timestart = timeline.start() + timestart * 1000;
                    //timeend = timeline.start() + timeend * 1000;

                    //// not editable
                    //dataarray.push([new Date(timestart), new Date(timeend), content, false, amd.Id]);

                    //var annview = new metadatafac.MetadataView();
                    //annview.setview("annotation", amd);
                    //metadataViews.push(annview);

                }

                //timeline.addData(dataarray);

                for (var key in obj.anndataschemacount) {
                    timelineschemaselector.addSchemaItem(key, obj.anndataschemacount[key]);
                }

                isPlayerLoading(false);
            }

            function md(start, end, title) {
                return {
                    DateCreated: "2012-12-03T10:03:58Z",
                    DateModified: "2012-12-03T10:03:58Z",
                    EditingUser: "Peter Overgaard",
                    EditingUserGUID: "c05036fc-71fc-4c4d-b28d-a0a8ca6bc6c1",
                    Id: "",
                    LanguageCode: "da",
                    MetadataSchemaGUID: "d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e",
                    ProgramGUID: "8a1f7ef2-4ec8-6841-9a83-b16fa9fdc648",
                    StartTime: start,
                    EndTime: end,
                    Title: title
                };
            }

            return {
                isPlayerLoading: isPlayerLoading,

                mediaUrl: player.mediaUrl,
                title: title,
                channel: channel,
                publication: publication,
                abstracttxt: abstracttxt,
                description: description,

                metadataViews: metadataViews,
                metadataEditors: metadataEditors,
                schemaItems: timelineschemaselector.schemaItems,
                compositionComplete: function () {

                    player.init(null);
                    player.position.subscribe(function (position) {
                        playerposition(position);
                        timeline.setPosition(playerposition());
                    });
                    player.duration.subscribe(function (duration) {
                        timeline.init(duration);
                    });

                    addSchemas();

                    obj.anndata = [];
                    obj.anndata.push(md("00:00:00.000", "00:04:06.000", "Intro - stempelkort -interview"));
                    obj.anndata.push(md("00:04:06.000", "00:06:02.000", "Kongens foged udsættelsesforretning"));
                    obj.anndata.push(md("00:06:02.000", "00:07:09.000", "Demo - med sang"));
                    obj.anndata.push(md("00:07:09.000", "00:08:12.000", "Dunlop er lukket"));
                    obj.anndata.push(md("00:08:12.000", "00:09:59.000", "Afgang i folkeskolen"));
                    obj.anndata.push(md("00:09:59.000", "00:10:58.000", "Ung i arbejde - vasker fliser"));
                    obj.anndata.push(md("00:10:58.000", "00:13:40.000", "Vejle kommune - Byrådets hjælp til den privatejede glofbane"));
                    obj.anndata.push(md("00:13:40.000", "00:16:44.000", "Må vi stille et par spørgsmål?"));
                    obj.anndata.push(md("00:16:44.000", "00:22:08.000", "Vi mangler personalechefen fra ØK"));
                    obj.anndata.push(md("00:22:08.000", "00:24:56.000", "Arbejdshæren på march"));
                    obj.anndata.push(md("00:24:56.000", "00:26:00.000", "Skopudsning på Strøget"));
                    obj.anndata.push(md("00:26:00.000", "00:26:30.000", "Vaske giler i Gentofte"));
                    obj.anndata.push(md("00:27:22.000", "00:31:16.000", "Helbredsundersøgelse - Nervemedicin til arbejdsløse"));
                    obj.anndata.push(md("00:31:16.000", "00:32:12.000", "Arbejdsløshed er ingen naturlov"));
                    obj.anndata.push(md("00:32:12.000", "00:34:57.000", "Speek Organisering")); 
                    obj.anndata.push(md("00:34:57.000", "00:35:59.000", "Arbejdsløshedshæren kommer til skoleafslutningen"));
                    obj.anndata.push(md("00:35:59.000", "00:37:04.000", "Smede fra Sabroe Øst"));
                    obj.anndata.push(md("00:37:04.000", "00:38:38.000", "Begravelse af Trosbekendelse"));
                    obj.anndata.push(md("00:38:38.000", "00:46:56.000", "Buskonflikten"));
                    obj.anndata.push(md("00:46:56.000", "00:50:50.000", "Foran Arbejdsretten"));
                    obj.anndata.push(md("00:50:50.000", "00:51:44.000", "Sabrosmede vil ikke betale bod"));
                    obj.anndata.push(md("00:51:44.000", "00:55:24.000", "Vi står foran kapitalens højborg"));
                    obj.anndata.push(md("00:55:24.000", "00:59:55.000", "Vi er trætte af ord. Vi kræver handling"));


                    isPlayerLoading(false);
                },
                activate: function (param) {
                },
                play: function () {
                    player.play();
                },
                pause: function () {
                    player.pause();
                },
                playerposition: player.position
            };
        });



