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
    'mods/metadataTab',
    'mods/localization'
],
        function (app, ko, portal, state, objfac, xmlman,
            jsonformfields, metadatafac, format, player, timeline, objectmanager,
            timelineschemaselector, annotation, metadataTab, locale) {

            // FIELDS: --------------------------------------
            var obj = {};
            obj.guid;
            obj.data;

            var compositionCompleted = false;
            var playerInitiated = false;
            var isPlayerLoading = ko.observable(true);

            var title = ko.observable();
            var channel = ko.observable();
            var publication = ko.observable();
            var abstracttxt = ko.observable();
            var description = ko.observable();
            var publishtext = ko.observable();

            var playerposition = ko.observable(0);

            var metadataViews = ko.observableArray();
            var metadataEditors = ko.observableArray();

            metadataPlayerControlVisible = ko.observable(false);

            var $window = $(window);

            var deepLinkAnnotationId = '';

            // Message: metadataTab:changed
            app.on('metadataTab:changed').then(function (tab) {

                metadataViews.removeAll();

                if (tab.id === "1") {
                    // Show main metadata
                    showMainMetadata();
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

            function showMainMetadata() {

                // Test Conditions. Is the tab selected? Is data loaded?
                var tab = metadataTab.activeTab();
                if (!tab)
                    return;

                if (tab.id !== "1")
                    return;

                if (!obj.data)
                    return;

                metadataViews.removeAll();
                // Stall the thread, otherwise larmprogram will not call compositeComplete
                setTimeout(
                    function () {
                        var annview = new metadatafac.MetadataView();
                        annview.setview("larmprogram", obj.data);
                        metadataViews.push(annview);
                    },
                    1
                    );

            }

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

                if (metadataViews().length == 0)
                    addAnnotationsToMetadataViews();
            });


            // MSG: annotation:metadataview -------------------------------
            app.on('annotation:metadataview').then(function (e) {
                var id = e.id;
                var schemaGuid = annotation.getSchemaGuidFromAnnotationGuid(id);
                // Is tab open?
                metadataTab.activateTabByGuid(schemaGuid);                
                expandMetadataById(id);
            });
            
            function expandMetadataById(id) {
                for (var i = 0; i < metadataViews().length; i++) {
                    if (metadataViews()[i].data.Id === id) {
                        var dat = metadataViews()[i].data;

                        if (!dat.self) {
                            expandMetadataByIdRetry(id);
                            return;
                        }

                        if (dat.self.collapsed() === true) {
                            dat.self.annotation.btnexpand();
                        }

                        var ele = $('#ID' + id);
                        $('html,body').animate({ scrollTop: ele.offset().top - 62 });
                        return;
                    }
                }

                expandMetadataByIdRetry(id);
            }

            function expandMetadataByIdRetry(id) {
                setTimeout(
                    function () {
                        expandMetadataById(id)
                    }, 1000);
            }

            // -------------------------------------------------------

            // MSG: annotation:add -----------------------------------
            app.on('annotation:add').then(function (e) {
                // TODO: Choose metadataschema if more are activated

                timeline.editMode(true);

                // Only comments for now!
                if (timelineschemaselector.schemaItems().length < 1 ||
                    timelineschemaselector.schemaItems()[0].isactive() == false) {
                    app.showMessage("Please choose comments schema first.");
                    return;
                }

                var schema = timelineschemaselector.schemaItems()[0];

                var id = "n" + objectmanager.generateGUID();

                timeline.addItemAtCursor(id);
                var dat = timeline.getSelection();

                var content = timelineschemaselector.getContent(schema.guid, "");

                timeline.changeItem(dat.start, dat.end, content);

                metadataEditors.removeAll();
                // Add editor
                var amd = createNewAmd({ guid: id, schemaguid: schema.guid });

                var editor = new metadatafac.MetadataView();
                editor.setview(Settings.Schema[schema.guid].edit, { guid: amd.Id, metadata: amd });
                metadataEditors.push(editor);
                timeline.editItem(amd.Id);
                metadataPlayerControlVisible(true);

            });

            // Message: 
            app.on('metadata:cancel').then(function (e) {

                timeline.editMode(false);

                var item = timeline.getSelection();

                if (item && item.id.substring(0, 1) == "n") {
                    timeline.deleteItemByID(item.id);
                }
                else
                    timeline.unselectItem();

                metadataEditors.removeAll();
                metadataPlayerControlVisible(false);
            });

            // Message: 
            app.on('metadata:save').then(function (e) {

                timeline.editMode(false);

                if (!e.guid || e.guid.substring(0, 1) == "n") {

                    // Add to MetadataViews
                    var amd = createNewAmd(e);
                    annotation.addAnnotationToData(amd);
                    addAmdToMetadataViews(amd);
                    timeline.unselectItem();

                    // Create object
                    var guid = e.guid.substring(1);
                    var schemaGuid = e.schemaguid; //"f9f6edd0-f0ca-41ac-b8b3-b0d950fdef4e"; // e.schemaguid;
                    objectmanager.createAnnotation(guid, obj.guid, schemaGuid, "da", e.xml, annotationCreated)

                    var schemaItem = timelineschemaselector.getByGuid(schemaGuid);
                    if (schemaItem !== null) {
                        schemaItem.count(schemaItem.count() + 1);
                    }

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

                // Add annotation to MetadataViews

                if (metadataTab.activeTab() == null || metadataTab.activeTab().schemaGuid != amd.MetadataSchemaGUID)
                    return;

                // Is it in MetadataViews?
                for (var i = 0; i < metadataViews().length; i++) {
                    if (metadataViews()[i].data.Id === amd.Id)
                        return;
                }

                var annview = new metadatafac.MetadataView();
                annview.setview(Settings.Schema[amd.MetadataSchemaGUID].view, amd);
                metadataViews.push(annview);
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
                metadataPlayerControlVisible(false);
            }

            function annotationCreated() {
                metadataEditors.removeAll();
                metadataPlayerControlVisible(false);
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

                        // Is needed because guid is named differently between View and ObjectGet
                        var schemaguid = ed.data.metadata.MetadataSchemaGUID;
                        if (!schemaguid)
                            schemaguid = ed.data.metadata.MetadataSchemaGuid;

                        var content = timelineschemaselector.getContent(schemaguid, t);
                        //var content = '<div title="' + t + '">&nbsp;' + t + '</div>'
                        timeline.changeItem(new Date(timestart), new Date(timeend), content);
                    }
                }
            });

            // Message: 
            app.on('metadata:edit').then(function (e) {

                timeline.editMode(true);

                var guid;

                if (e.annotation) {
                    if (e.annotation.data.Id)
                        guid = e.annotation.data.Id;
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

                    //window.scrollTo(0, 0);
                    var ele = $('#larmplayer');
                    $('html,body').animate({ scrollTop: ele.offset().top - 62 });

                    metadataEditors.removeAll();
                    var mds = r.Metadatas;
                    for (var i = 0; i < mds.length; i++) {
                        if (Settings.Schema[mds[i].MetadataSchemaGuid].edit != '') {
                            timeline.editItem(guid);
                            var editor = new metadatafac.MetadataView();
                            editor.setview(Settings.Schema[mds[i].MetadataSchemaGuid].edit, { guid: r.Id, metadata: mds[i] });
                            metadataEditors.push(editor);
                            metadataPlayerControlVisible(true);
                            break;
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
                var r = data.Body.Results[0];
                obj.data = r;
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

                        var start = new Date(publication()).toLocaleString();
                        var end = new Date($(x).find("PublicationEndDateTime").text()).toLocaleString();

                        if (start === "Invalid Date") {
                            start = locale.text("unknowndate");
                        }

                        if (end === "Invalid Date") {
                            end = locale.text("unknowndate");
                        }

                        publishtext(", " + start + " - " + end);
                        //publishtext(", sendt 19. april, 1973. Kl. 19:00 - 19:59 (59 min)");
                    }
                }

                showMainMetadata();

                initPlayer();
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

                doDeepLinkAnnotation();
            }

            function doDeepLinkAnnotation() {
                // Annotation Deeplink?
                if (!deepLinkAnnotationId)
                    return;

                // Get schema for the chosen annotation
                var schemaGuid = annotation.getSchemaGuidFromAnnotationGuid(deepLinkAnnotationId);

                // Is schema visible on the timeline?
                var schemaItem = timelineschemaselector.getByGuid(schemaGuid);
                if (schemaItem.isactive() === false) {
                    schemaItem.click();
                }
                doDeepLinkAnnotation_FindAnnInTimeline();
            }

            function doDeepLinkAnnotation_FindAnnInTimeline() {
                if (!deepLinkAnnotationId)
                    return;

                var ann = timeline.getAnnotation(deepLinkAnnotationId);

                if (ann) {

                    timeline.cursorCentered(true);
                    timeline.loopAnnotation(deepLinkAnnotationId);

                } else {
                    setTimeout(doDeepLinkAnnotation_FindAnnInTimeline, 100);
                }
            }

            function windowSizeChange() {
                var w = $window.width(); // substract enough to get free of scrollbar.
                var h = $window.height();
                $(".player").width(w - 42);
                $("#timelines").width(w - 177);
                timeline.redraw();
            }

            function initPlayer() {

                if (playerInitiated || !compositionCompleted || !obj.data)
                    return;

                playerInitiated = true;

                // Initiate Player and callback functions
                player.init(obj.data);
                player.position.subscribe(function (position) {
                    playerposition(position);
                    timeline.setPosition(playerposition());
                });
                player.duration.subscribe(function (duration) {
                    timeline.init(duration);
                    insertAnnotations();
                });
            }

            return {
                isPlayerLoading: isPlayerLoading,

                mediaUrl: player.mediaUrl,
                isplaying: player.isplaying,
                playerposition: player.position,
                playerpositiontext: player.positiontext,
                playerpositionlefttext: player.positionlefttext,

                title: title,
                channel: channel,
                publication: publication,
                abstracttxt: abstracttxt,
                description: description,
                publishtext: publishtext,

                metadataViews: metadataViews,
                metadataEditors: metadataEditors,
                metadataTabs: metadataTab.tabs,
                schemaItems: timelineschemaselector.schemaItems,
                compositionComplete: function (child, parent, settings) {
                    compositionCompleted = true;
                    windowSizeChange();
                    $window.resize(windowSizeChange);
                    metadataTab.add(locale.text("MetadataSchemaTab_Description"), "1", "");

                    initPlayer();
                },
                activate: function (param) {
                    if (param !== undefined) {
                        var id = format.getParamByName('id', param);
                        obj.guid = id;
                        var objguids = [];
                        objguids.push(id);

                        // Annotation deeplink?
                        deepLinkAnnotationId = format.getParamByName('aid', param);

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
                playpause: function () {
                    if (player.isplaying())
                        player.pause();
                    else
                        player.play();
                },
                annotationAddBtn: function () {
                    app.trigger("annotation:add", {});
                },
                isCursorCentered: timeline.cursorCentered,
                cursorCenteredBtn: function () {
                    timeline.cursorCentered(!timeline.cursorCentered());
                },
                metadataPlayerControlVisible: metadataPlayerControlVisible,
                pointbeginbtn: function () {
                    timeline.setAnnotationStartToCursor();
                },
                pointendbtn: function () {
                    timeline.setAnnotationEndToCursor();
                }
            };
        });



