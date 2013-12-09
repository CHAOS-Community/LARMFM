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
    'mods/objectmanager'
],
        function (app, ko, portal, state, objfac, xmlman,
            jsonformfields, metadatafac, format, player, timeline, objectmanager) {

            var obj = {};
            obj.guid;
            obj.data;
            obj.anndata;
            obj.anndatacount;

            var title = ko.observable();
            var channel = ko.observable();
            var publication = ko.observable();
            var abstracttxt = ko.observable();
            var description = ko.observable();

            var playerposition = ko.observable(0);

            var metadataViews = ko.observableArray();
            var metadataEditors = ko.observableArray();

            app.on('metadata:edit').then(function (editorvm) {
                if (editorvm.data === undefined)
                    return;
                var d = editorvm.data;

                objectmanager.getByGuid(d.Id, function (r) {

                    metadataEditors.removeAll();
                    var mds = r.Metadatas;
                    for (var i = 0; i < mds.length; i++) {
                        if (mds[i].MetadataSchemaGuid == 'd0edf6f9-caf0-ac41-b8b3-b0d950fdef4e') {
                            var editor = new metadatafac.MetadataView();
                            editor.setview("anncommentedit", mds[i]);
                            metadataEditors.push(editor)
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

            var annotationsHaveBeenInserted = false;
            function insertAnnotations() {

                if (annotationsHaveBeenInserted)
                    return;

                if (obj.anndata === undefined || !player.isReady() || !timeline.isReady())
                    return;

                annotationsHaveBeenInserted = true;

                var dataarray = [];
                var amds = obj.anndata;
                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];
                    var content = '<div title="' + amd.Title + '">&nbsp;' + amd.Title + '</div>'

                    var timestart = format.getSecondsFromString(amd.StartTime);
                    var timeend = format.getSecondsFromString(amd.EndTime);
                    timestart = player.getProgramTimeFromFileTime(timestart);
                    timeend = player.getProgramTimeFromFileTime(timeend);
                    timestart = timeline.start() + timestart * 1000;
                    timeend = timeline.start() + timeend * 1000;

                    // not editable
                    dataarray.push([new Date(timestart), new Date(timeend), content, false, amd.Id]);

                    var annview = new metadatafac.MetadataView();
                    annview.setview("annotation", amd);
                    metadataViews.push(annview);

                }

                timeline.addData(dataarray);

            }

            return {
                mediaUrl: player.mediaUrl,
                title: title,
                channel: channel,
                publication: publication,
                abstracttxt: abstracttxt,
                description: description,

                metadataViews: metadataViews,
                metadataEditors: metadataEditors,

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
                }
            };
        });



