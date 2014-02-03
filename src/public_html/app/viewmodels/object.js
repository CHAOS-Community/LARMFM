define([
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
    'mods/timelineschemaselector',
    'mods/annotation',
    'mods/metadataTab'
],
        function (app, ko, portal, state, objfac, xmlman,
            jsonformfields, metadatafac, format, player, timeline, objectmanager,
            timelineschemaselector, annotation, metadataTab) {

            var obj = {};
            obj.guid;
            obj.data;

            var isPlayerLoading = ko.observable(true);

            var title = ko.observable();
            var channel = ko.observable();
            var publication = ko.observable();
            var abstracttxt = ko.observable();
            var description = ko.observable();

            var playerposition = ko.observable(0);

            var metadataViews = ko.observableArray();
            var metadataEditors = ko.observableArray();

            var $window = $(window);

            // Message: metadataTab:changed
            app.on('metadataTab:changed').then(function (tab) {

                metadataViews.removeAll();

                if (tab.id == "1") {
                    // Show main metadata
                    // TODO: 

                    return;
                }

                // Annotation data

                // is timeline schema visible?
                if (tab.schemaGuid in timelineschemaselector.activeSchemaItems() == false) {
                    // Nope. Load it!
                    timelineschemaselector.activateByGuid(tab.schemaGuid);
                    // And run addAnnotationsToMetadataViews in timelineschema:change
                    return;
                }

                addAnnotationsToMetadataViews();
            });

            function addAnnotationsToMetadataViews() {

                var amds = annotation.data();
                if (amds == undefined)
                    return;

                var tab = metadataTab.activeTab();

                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];
                    if (tab.schemaGuid != amd.MetadataSchemaGUID)
                        continue;

                    var annview = new metadatafac.MetadataView();
                    annview.setview(Settings.Schema[amd.MetadataSchemaGUID].view, amd);
                    metadataViews.push(annview);
                }
            }

            // Message: 
            app.on('timelineschema:change').then(function (e) {

                var guid = e.guid;

                // Make sure active metadatatab is still in the timeline
                var tab = metadataTab.activeTab();
                var timelineschemas = timelineschemaselector.schemaItems();
                for (var i = 0; i < timelineschemas.length; i++) {
                    if (timelineschemas[i].guid == tab.schemaGuid) {

                        if (timelineschemas[i].isactive() == false) {
                            metadataViews.removeAll();
                            metadataTab.tabs()[0].click(); // Choose "beskrivelse" tab
                        }

                        break;
                    }
                }

                //metadataViews.removeAll();
                timeline.clearData();

                timelineschemaselector.updateActiveSchemaItems();

                var dataarray = [];
                var amds = annotation.data();

                if (amds == undefined)
                    return;

                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];
                    addAmdToMetadataViews(amd, dataarray);
                }

                timeline.addData(dataarray);

                addAnnotationsToMetadataViews();
            });

            // Message: 
            app.on('annotation:add').then(function (e) {
                // TODO: Choose metadataschema if more are activated

                // Only comments for now!
                if (timelineschemaselector.schemaItems().length < 1 ||
                    timelineschemaselector.schemaItems()[0].isactive() == false) {
                    app.showMessage("Vaelg Comments ark for at annotere.");
                    return;
                }

                var schema = timelineschemaselector.schemaItems()[0];

                var id = "n" + objectmanager.generateGUID();

                timeline.addItemAtCursor(id);
                var dat = timeline.getSelection();

                metadataEditors.removeAll();
                // Add editor
                amd = {};
                amd.Id = id;
                var editor = new metadatafac.MetadataView();
                editor.setview(Settings.Schema[schema.guid].edit, { guid: amd.Id, metadata: amd });
                metadataEditors.push(editor);
                timeline.editItem(amd.Id);

            });

            // Message: 
            app.on('metadata:cancel').then(function (e) {
                var item = timeline.getSelection();

                if (item && item.id.substring(0, 1) == "n") {
                    timeline.deleteItemByID(item.id);
                }
                else
                    timeline.unselectItem();

                metadataEditors.removeAll();
            });

            // Message: 
            app.on('metadata:save').then(function (e) {

                if (!e.guid || e.guid.substring(0, 1) == "n") {

                    // Add to MetadataViews
                    var amd = createNewAmd(e);
                    addAmdToMetadataViews(amd);
                    timeline.unselectItem();

                    // Create object
                    var guid = e.guid.substring(1);
                    var schemaGuid = e.schemaguid; //"f9f6edd0-f0ca-41ac-b8b3-b0d950fdef4e"; // e.schemaguid;
                    objectmanager.createAnnotation(guid, obj.guid, schemaGuid, "da", e.xml, annotationCreated)

                } else {
                    // Update existing object

                    // Update underlaying annotation data
                    var anndata = annotation.updateAnnotationData(e);

                    // Set annotation in timeline to readonly
                    //var ann = timeline.getSelection();
                    timeline.unselectItem();
                    //if (anndata) {
                    //    if (ann && ann.id == anndata.Id) {
                    //        var dic = timelineschemaselector.activeSchemaItems();
                            
                    //        if (anndata.MetadataSchemaGUID in dic) {
                    //            var schitem = dic[anndata.MetadataSchemaGUID];
                    //            var content = schitem.getContent(anndata.Title);
                    //            var timestart = format.getSecondsFromString(anndata.StartTime);
                    //            var timeend = format.getSecondsFromString(anndata.EndTime);
                    //            timestart = player.getProgramTimeFromFileTime(timestart);
                    //            timeend = player.getProgramTimeFromFileTime(timeend);
                    //            timestart = timeline.start() + timestart * 1000;
                    //            timeend = timeline.start() + timeend * 1000;
                    //            timeline.changeItem(new Date(timestart), new Date(timeend), content);
                    //        }
                    //    }
                    //}

                    // Update metadata readonly view if present
                    for (var i = 0; i < metadataViews().length; i++) {
                        if (metadataViews()[i].data.Id == e.guid) {
                            metadataViews()[i].data.self.title(e.title);
                            metadataViews()[i].data.self.starttime(e.start);
                            metadataViews()[i].data.self.endtime(e.end);
                        }
                    }

                    CHAOS.Portal.Client.Metadata.Set(
                    e.guid, e.schemaguid, "da",
                    1, e.xml, null).WithCallback(metadataSaved);
                }
            });

            // TODO: Remove. Is moved to annotation module
            function createNewAmd(e) {
                // player.getProgramTimeFromFileTime(timestart);
                var ann = timeline.getAnnotation(e.guid);
                var amd = {};
                amd.DateCreated = format.getSolrDateStr(new Date());
                amd.DateModified = amd.DateCreated;
                amd.EditingUser = "Dig";
                amd.EditingUserGUID = "";
                amd.EndTime = format.getTimeStringFromDate(ann[1].v);
                amd.Id = e.guid;
                amd.LanguageCode = "da";
                amd.MetadataSchemaGUID = e.schemaguid;
                amd.ProgramGUID = obj.guid;
                amd.StartTime = format.getTimeStringFromDate(ann[0].v);
                amd.Title = e.title;

                return amd;
            }

            function addAmdToMetadataViews(amd, dataarray) {

                if (!timelineschemaselector.isActive(amd.MetadataSchemaGUID))
                    return;

                var content = timelineschemaselector.getContent(amd.MetadataSchemaGUID, amd.Title);

                var timestart = format.getSecondsFromString(amd.StartTime);
                var timeend = format.getSecondsFromString(amd.EndTime);
                timestart = player.getProgramTimeFromFileTime(timestart);
                timeend = player.getProgramTimeFromFileTime(timeend);
                timestart = timeline.start() + timestart * 1000;
                timeend = timeline.start() + timeend * 1000;

                if (dataarray) {
                    // not editable
                    dataarray.push([new Date(timestart), new Date(timeend), content, false, amd.Id]);
                }
                else {
                    // update existing timeline annotation
                    var an = timeline.getAnnotation(amd.Id);
                    an[2].v = content;
                    timeline.changeItem(new Date(timestart), new Date(timeend), content);
                }

                //if (metadataTab.activeTab == null || metadataTab.activeTab.schemaGuid != amd.MetadataSchemaGUID)
                //    return;

                //var annview = new metadatafac.MetadataView();
                //annview.setview(Settings.Schema[amd.MetadataSchemaGUID].view, amd);
                //metadataViews.push(annview);
            }

            //function addAmdToMetadataViews(amd, dataarray) {

            //    var dic = timelineschemaselector.activeSchemaItems();

            //    if (amd.MetadataSchemaGUID in dic) {
            //        //var content = '<div title="' + amd.Title + '" style="background-color:rgba(128, 128, 255, 0.2)">&nbsp;' + amd.Title + '</div>'

            //        var schitem = dic[amd.MetadataSchemaGUID];

            //        var content = schitem.getContent(amd.Title);

            //        var timestart = format.getSecondsFromString(amd.StartTime);
            //        var timeend = format.getSecondsFromString(amd.EndTime);
            //        timestart = player.getProgramTimeFromFileTime(timestart);
            //        timeend = player.getProgramTimeFromFileTime(timeend);
            //        timestart = timeline.start() + timestart * 1000;
            //        timeend = timeline.start() + timeend * 1000;

            //        if (dataarray) {
            //            // not editable
            //            dataarray.push([new Date(timestart), new Date(timeend), content, false, amd.Id]);
            //        }
            //        else {
            //            // update existing timeline annotation
            //            var an = timeline.getAnnotation(amd.Id);
            //            an[2].v = content;
            //            timeline.changeItem(new Date(timestart), new Date(timeend), content);
            //        }

            //        var annview = new metadatafac.MetadataView();
            //        annview.setview(Settings.Schema[amd.MetadataSchemaGUID].view, amd);
            //        metadataViews.push(annview);
            //    }
            //}

            function metadataSaved(r) {

                if (r.Error != null) {
                    app.showMessage(r.Error.Message, "Error saving", ["OK", "Cancel"]);
                    return;
                }

                metadataEditors.removeAll();
            }

            function annotationCreated() {
                metadataEditors.removeAll();
            }

            // Message: 
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

            // Message: 
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

                        var content = timelineschemaselector.getContent(ed.data.metadata.MetadataSchemaGuid, t);
                        //var content = '<div title="' + t + '">&nbsp;' + t + '</div>'
                        timeline.changeItem(new Date(timestart), new Date(timeend), content);
                    }
                }
            });

            // Message: 
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

                var g = guid;
                if (g.substring(0, 1) == "n") {
                    g = g.substring(1);
                }

                objectmanager.getByGuid(g, function (r) {

                    window.scrollTo(0, 0);
                    metadataEditors.removeAll();
                    var mds = r.Metadatas;
                    for (var i = 0; i < mds.length; i++) {
                        if (Settings.Schema[mds[i].MetadataSchemaGuid].edit !='') {
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

                //obj.anndatacount = response.Body.Count;
                //if (obj.anndatacount > 0)
                //    obj.anndata = response.Body.Results;

                annotation.setAnnotationData(response.Body.Results, response.Body.Count);

                insertAnnotations();
            }

            var addSchemasDone = false;
            function addSchemas() {

                if (addSchemasDone)
                    return;

                addSchemasDone = true;
                timelineschemaselector.addSchemaItem("d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e", 0);
                timelineschemaselector.addSchemaItem("7bb8d425-6e60-9545-80f4-0765c5eb6be6", 0);
                timelineschemaselector.addSchemaItem("c446ad50-f1ea-f642-9361-3f6b56c5f320", 0);

                metadataTab.add("Comments", "", "d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e");
                metadataTab.add("Jingles", "", "7bb8d425-6e60-9545-80f4-0765c5eb6be6");
                metadataTab.add("Lydkilde", "", "c446ad50-f1ea-f642-9361-3f6b56c5f320");
            }

            var annotationsHaveBeenInserted = false;
            function insertAnnotations() {

                if (annotationsHaveBeenInserted)
                    return;

                if (annotation.dataCount() !== undefined && annotation.dataCount() == 0 &&
                    player.isReady() && timeline.isReady()
                    ) {
                    addSchemas();
                    isPlayerLoading(false);
                    return;
                }

                if (annotation.data() === undefined || !player.isReady() || !timeline.isReady()) {
                    return;
                }

                addSchemas();

                annotationsHaveBeenInserted = true;

                for (var key in annotation.annotationCountPerSchema()) {
                    timelineschemaselector.addSchemaItem(key, annotation.annotationCountPerSchema()[key]);
                }

                isPlayerLoading(false);

                // Choose Comments annotation as default.
                timelineschemaselector.schemaItems()[0].click();

            }

            function windowSizeChange() {
                var w = $window.width();
                var h = $window.height();
                $("#timelines").width(w - 180);
                timeline.redraw();
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
                metadataTabs: metadataTab.tabs,
                schemaItems: timelineschemaselector.schemaItems,
                compositionComplete: function (child, parent, settings) {
                    windowSizeChange();
                    $window.resize(windowSizeChange);

                    metadataTab.add("Beskrivelse", "1", "");

                },
                activate: function (param) {
                    if (param !== undefined) {
                        var id = format.getParamByName('id', param);
                        obj.guid = id;
                        var objguids = [];
                        objguids.push(id);

                        // Object Get
                        CHAOS.Portal.Client.Object.Get(
                            objguids, Settings.accessPointGuid, true, true,
                            true, false, false,
                            1, 0, null).WithCallback(metadataReceived);

                        // Annotation View
                        CHAOS.Portal.Client.View.Get(
                            'Annotation', 'ProgramGUID:"' + obj.guid + '"',
                            'StartTime+ASC', null, 0, 9999).WithCallback(annotationsReceived);

                    }
                },
                play: function () {
                    player.play();
                },
                pause: function () {
                    player.pause();
                },
                annotationAddBtn: function () {
                    app.trigger("annotation:add", {});
                },
                metadataTabClick: function (e, p) {
                    var i = 0;
                }
            };
        });



