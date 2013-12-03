define(['durandal/app', 'knockout', 'mods/portal', 'mods/state', 'factory/object', 'mods/xmlmanager', 'mods/jsonformfields', 'factory/metadata', 'mods/format'],
        function (app, ko, portal, state, objfac, xmlman, jsonformfields, metadatafac, format) {

            var title = ko.observable();
            var channel = ko.observable();
            var publication = ko.observable();
            var abstracttxt = ko.observable();
            var description = ko.observable();
            var newdescription = ko.observable();

            var dataready = false;
            var viewready = false;
            var playerready = false;
            var mediaurl = ko.observable();
            var mediaimage = ko.observable();
            var playerposition = ko.observable(0);
            var playerdebug = ko.observable("");

            var cbgroupannotations = ko.observable("true");
            cbgroupannotations.subscribe(function(newValue){
                timeline.options.cluster = newValue;
                timeline.redraw();
            });

            var playertime = undefined;
            var playertime_start = undefined;
            var playertime_end = undefined;

            var timeline_centered = true;

            var data = undefined;
            var timeline = undefined;
            var timeline2 = undefined;
            var onTimeChangeActive = false;

            var metadataEditor = ko.observable();
            var metadataViews = ko.observableArray();

            app.on('metadata:changedinview').then(function (editorvm) {
                if (editorvm.data === undefined)
                    return;

                var time = editorvm.starttime();
                var pltm = getTimelineDate(playertime, getMilliFromString(time))

                pltm = new Date(pltm.getTime() + 10000);

                var guid = editorvm.data.GUID;
                var obj = timeline.getItemAndIndexByID(guid);
                timeline.changeItem(obj.index, { start: pltm });

                editorvm.starttime(format.getTimeStringFromDate(pltm));
            });

            app.on('metadata:edit').then(function (editorvm) {
                if (editorvm.data === undefined)
                    return;

                for (var i = 0; i < metadataViews().length; i++) {

                    var md = metadataViews()[i];

                    if (md.data == editorvm.data) {
                        var j = 0;
                    }
                }

                //var vm = editorvm;
                //$(".editor").each(function (index) {
                //    var vm2 = vm;
                //    var data = ko.dataFor(this);
                //    if (data.data.id !== undefined && vm.id !== undefined) {
                //        if (data.data.id == vm.id()) {
                //            // Found
                //        }
                //    }
                //});

            });

            var obj = {};

            // Getting data from API.
            function queryReceived(data) {
                var r = data.Body.Results[0];
                // TODO: Settings.Search.metadataSchemaGuid
                var mdsguid = state.searchMetadataSchemaGuids[0]; //brand.getSearchMetadataSchemaGuid(r);

                if (r == undefined) {
                    app.showMessage("The data is not available for this object.", "Data missing", ["OK", "Cancel"]);
                    return;
                }
                if (r.Metadatas == undefined) {
                    app.showMessage("The metadata is not available for this object.", "Metadata missing", ["OK", "Cancel"]);
                    return;
                }

                //var eda = new metadatafac.MetadataView();
                //eda.setview("editor2", {title:"Editor 2 AA"});
                //metadataViews.push(eda);

                //var edb = new metadatafac.MetadataView();
                //edb.setview("editor2", { title: "Editor 2 BB" });
                //metadataViews.push(edb);


                //var ed1 = new metadatafac.MetadataView();
                //ed1.setview("test.html", { key: "Test key." });
                //metadataViews.push(ed1)

                //var larmprogrameditor = new metadatafac.MetadataView();
                //larmprogrameditor.setview("larmprogram", { metadata: r.Metadatas, id: "editor1" });
                //metadataViews.push(larmprogrameditor);

                //var larmprogrameditor2 = new metadatafac.MetadataView();
                //larmprogrameditor2.setview("larmprogram", { metadata: r.Metadatas, id: "editor2" });
                //metadataViews.push(larmprogrameditor2);


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

                var previous_mediaurl = mediaurl();
                if (r.Files.length > 0)
                    for (var i = 0; i < r.Files.length; i++) {
                        var ft = r.Files[i].FormatType;
                        if (ft == "Audio") {
                            mediaurl(r.Files[i].URL);
                        }
                        else if (ft == "Image") {
                            mediaimage(r.Files[i].URL);
                        }

                    }

                dataready = true;
                playerready = false;
                playerposition(0);
                if (previous_mediaurl != mediaurl())
                    initplayer();

                inittimeline();

                //var ed2 = new metadatafac.MetadataView();
                //ed2.setview("generic", { guid: obj.metadataSchemaGuid, xml: obj.metadata });
                //metadataViews.push(ed2)

            }

            function initplayer() {
                if (playerready)
                    return;

                if (!dataready || !viewready)
                    return;

                if (mediaurl() == undefined || mediaurl().length == 0)
                    return;

                playerready = true;


                jwplayer("larmplayer").setup({
                    file: mediaurl(),
                    width: 1,
                    height: 1,
                    image: mediaimage(),
                    controls: true
                });

                jwplayer().onTime(
                        function () {
                            var posseconds = jwplayer().getPosition();
                            playerposition(posseconds);
                            if (!onTimeChangeActive) {
                                //timeline.setCurrentTime(playertime.getTime() + playerposition() * 1000);
                                timeline.setCustomTime(playertime.getTime() + playerposition() * 1000);
                                //timeline.setVisibleChartRangeNow();
                                var r = timeline.getVisibleChartRange();
                                playerdebug(timestr(r.start) + " - " + timestr(r.end));

                                if (timeline_centered) {
                                    timeline.centerTimeline();
                                }
                            }
                        });

            }

            function timestr(d) {
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                return format2digits(h) + ":" + format2digits(m) + ":" + format2digits(s);
            }
            function format2digits(n) {
                return ("0" + n).slice(-2);
            }

            function inittimeline() {
                if (!dataready || !viewready)
                    return;

                google.load("visualization", "1", { "callback": drawVisualization });
            }

            function onTimeChange(event) {
                onTimeChangeActive = true;
            }

            function onTimeChanged(event) {
                var timediff = event.time - playertime;
                jwplayer().seek(timediff / 1000);
                onTimeChangeActive = false;
            }

            var ontimelinescrollingdisable = false;
            function ontimelinescrolling(e) {
                if (ontimelinescrollingdisable) {
                    ontimelinescrollingdisable = false;
                    return;
                }

                var totalvalue = playertime_end - playertime_start;
                var totalpixel = $("#timelinescrollcontent").width();
                var rangeobj = timeline.getVisibleChartRange();
                var rangevalue = rangeobj.end - rangeobj.start;

                var pixelpervalue = totalvalue / totalpixel;

                var scrollpos = $("#timelinescroll").scrollLeft();
                var res = totalpixel / (scrollpos);

                var start = playertime_start + totalvalue / res;
                timeline.setVisibleChartRange(start, start + rangevalue);
            }

            function onRangeChange(event) {
                var totalvalue = playertime_end - playertime_start;
                var rangevalue = event.end - event.start;
                var totalpixel = $("#timelinescroll").width();

                var conwdt = (totalvalue / rangevalue) * totalpixel;

                $("#timelinescrollcontent").width(conwdt);

                var startdiff = event.start - playertime_start;

                ontimelinescrollingdisable = true;
                if (startdiff == 0)
                    $("#timelinescroll").scrollLeft(0);
                else
                    $("#timelinescroll").scrollLeft(conwdt / (totalvalue / startdiff));

                var range = timeline.getVisibleChartRange();
                timeline2.setVisibleChartRange(range.start, range.end);

                return;

                var update = false;
                var ts = event.start;
                var te = event.end;
                if (event.start < playertime_start) {
                    update = true;
                    ts = playertime_start;
                }
                if (event.end > playertime_end) {
                    update = true;
                    te = playertime_end;
                }

                if (update)
                    timeline.setVisibleChartRange(ts, te);

                var range = timeline.getVisibleChartRange();
                timeline2.setVisibleChartRange(range.start, range.end);
            }

            function getTimelineDate(d, millisecoffset) {
                var dt = new Date(d);
                dt.setMilliseconds(dt.getMilliseconds() + millisecoffset);
                return dt;
            }

            function getMilliFromString(timestr) {
                var h = parseInt(timestr.substring(0, 2));
                var m = parseInt(timestr.substring(3, 5));
                var s = parseInt(timestr.substring(6, 8));
                var ms = parseInt(timestr.substring(9, 12));

                return ms + s * 1000 + m * 1000 * 60 + h * 1000 * 60 * 60;
            }

            function drawVisualization() {
                // Create and populate a data table.
                data = new google.visualization.DataTable();
                data.addColumn('datetime', 'start');
                data.addColumn('datetime', 'end');
                data.addColumn('string', 'content');
                data.addColumn('boolean', 'editable');
                data.addColumn('string', 'id');

                //var t = new Date(2010,7,23,16,30,15);
                // 1990-02-19T22:00:00
                var part_dt = publication().split("T");
                var part_d = part_dt[0].split("-");
                var part_t = part_dt[1].split(":");
                var t = new Date(part_d[0], part_d[1], part_d[2], part_t[0], part_t[1], part_t[2]);
                //playertime = t;
                //playertime_start = t.getTime();
                //playertime_end = t.getTime() + 74 * 60 * 1000;
                playertime = new Date(2000, 1, 1, 0, 0, 0, 0);
                playertime_start = playertime.getTime();
                playertime_end = playertime.getTime() + 74 * 60 * 1000;

                // LOAD METADATA
                var dataarray = [];
                var amds = metadatafac.annotationData;
                for (var i = 0; i < amds.length; i++) {
                    var amd = amds[i];
                    var content = '<div title="' + amd.Title + '">&nbsp;' + amd.Title + '</div>'
                    dataarray.push([getTimelineDate(playertime, getMilliFromString(amd.StartTime)), getTimelineDate(playertime, getMilliFromString(amd.EndTime)), content, true, amd.GUID]);

                    var annview = new metadatafac.MetadataView();
                    annview.setview("annotation", amd);
                    metadataViews.push(annview);

                }

                data.addRows(dataarray);

                var options = {
                    width: "100%",
                    //height: "200px",
                    editable: true,
                    //style: "box",
                    showCustomTime: true,
                    cluster: true,
                    axisOnTop: true,
                    //dragAreaWidth: 20,
                    showMajorLabels: true,
                    //groupsOnRight: true,
                    enableKeys: true,
                    showNavigation: true,
                    showButtonNew: true,
                    animate: true,
                    animateZoom: true,
                    min: playertime_start,
                    max: playertime_end
                    //minHeight: "200px"
                };

                $("#timelinescroll").scroll(ontimelinescrolling);

                // Instantiate our timeline object.
                $("#timelines").append('<div id="timeline1"></div>');
                timeline = new links.Timeline(document.getElementById('timeline1'));
                //timeline = new links.Timeline(document.getElementById('mytimeline'));

                // Add event listeners
                google.visualization.events.addListener(timeline, 'timechange', onTimeChange);
                google.visualization.events.addListener(timeline, 'timechanged', onTimeChanged);

                google.visualization.events.addListener(timeline, 'rangechange', onRangeChange);

                // Draw our timeline with the created data and options
                timeline.draw(data, options);
                //                timeline.setVisibleChartRange(playertime.getTime(), playertime.getTime() + 3 * 60 * 1000);


                timeline.setVisibleChartRange(playertime_start, playertime_end);


                //timeline.setCurrentTime(playertime);
                timeline.setCustomTime(playertime);



                //                // set a custom range from -2 minute to +3 minutes current time
                //                var start = new Date((new Date()).getTime() - 2 * 60 * 1000);
                //                var end = new Date((new Date()).getTime() + 3 * 60 * 1000);
                //                timeline.setVisibleChartRange(start, end);

                // add, change, edit, delete, select
                google.visualization.events.addListener(timeline, 'select', onannotationselect);
                google.visualization.events.addListener(timeline, 'edit', onannotationedit); // NOT FIRED!
                google.visualization.events.addListener(timeline, 'change', onannotationchange);

                addTimeline2();
            }

            function onannotationselect() {
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                        var dat = timeline.getItem(row);
                        //timeline.changeItem(row, { start: new Date(dat.start.getTime() - 1000) });

                        //var evobj = timeline.getItemAndIndexByID("02120d71-c88b-7523-273b-6790bf0b77a5");
                        //timeline.changeItem(evobj.index, { end: new Date(playertime_end) })

                    }
                }
            }

            function onannotationedit() {
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                        var dat = timeline.getItem(row);
                        //alert("EDIT: " +getGuidFromContent( dat.content));
                    }
                }
            }

            function onannotationchange() {
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                        var dat = timeline.getItem(row);

                        for (var i = 0; i < metadataViews().length; i++) {

                            var md = metadataViews()[i];
                            if (md.data.GUID == dat.id) {
                                md.data.self.starttime(format.getTimeStringFromDate(dat.start));
                            }
                        }

                        //alert("CHANGED: " + getGuidFromContent(dat.content));
                    }
                }
            }

            function getGuidFromContent(content) {
                var qs = content.indexOf('id="') + 4;
                var qe = content.indexOf('"', qs);
                return content.substring(qs, qe);
            }

            function addTimeline2() {
                // Create and populate a data table.
                data = new google.visualization.DataTable();
                data.addColumn('datetime', 'start');
                data.addColumn('datetime', 'end');
                data.addColumn('string', 'content');

                //                data.addRows([[
                //                        new Date((new Date()).getTime() - 60 * 1000),
                //                        new Date(),
                //                        'Dynamic event']]);

                //                // specify options
                //                var options = {
                //                    'showCustomTime': true
                //                };


                //var t = new Date(2010,7,23,16,30,15);
                // 1990-02-19T22:00:00
                var part_dt = publication().split("T");
                var part_d = part_dt[0].split("-");
                var part_t = part_dt[1].split(":");
                var t = new Date(part_d[0], part_d[1], part_d[2], part_t[0], part_t[1], part_t[2]);
                playertime = new Date(2000, 1, 1, 0, 0, 0, 0);
                playertime_start = playertime;
                playertime_end = playertime.getTime() + 74 * 60 * 1000;

                data.addRows([
                    [getTimelineDate(playertime, 1000 * 60 * 0), getTimelineDate(playertime, 1000 * 60 * 2), 'FODTRIN'],
                    [getTimelineDate(playertime, 1000 * 60 * 1), getTimelineDate(playertime, 1000 * 60 * 5), 'TRAFIK'],
                    [getTimelineDate(playertime, 1000 * 60 * 4), getTimelineDate(playertime, 1000 * 60 * 6), 'SMÆK'],
                    [getTimelineDate(playertime, 1000 * 60 * 0), getTimelineDate(playertime, 1000 * 60 * 4), 'FODTRIN'],
                    [getTimelineDate(playertime, 1000 * 60 * 10), getTimelineDate(playertime, 1000 * 60 * 14), 'SMÆK'],
                    [getTimelineDate(playertime, 1000 * 60 * 16), getTimelineDate(playertime, 1000 * 60 * 20), 'TRAFIK'],

                    //[new Date(t.getTime() + 16), , 'Mail from boss<br>' +
                    //            '<img src="img/mail-icon.png" style="width:32px; height:32px;">'],
                    //[new Date(t.getTime() + 18), , 'Report'],
                    //[new Date(t.getTime() + 20), new Date(t.getTime() + 26), 'Traject A'],
                    //[new Date(t.getTime() + 22), , 'Memo<br>' +
                    //            '<img src="img/notes-edit-icon.png" style="width:48px; height:48px;">'],
                    //[new Date(t.getTime() + 23), , 'Phone call<br>' +
                    //            '<img src="img/Hardware-Mobile-Phone-icon.png" style="width:32px; height:32px;">'],
                    //[new Date(t.getTime() + 24), new Date(t.getTime() + 27), 'Traject B'],
                    //[new Date(t.getTime() + 29), , 'Report<br>' +
                    //            '<img src="img/attachment-icon.png" style="width:32px; height:32px;">']

                ]);

                //var options = {
                //    width: "100%",
                //    height: "250px",
                //    editable: true,
                //    style: "box",
                //    showCustomTime: true
                //};

                var options = {
                    width: "100%",
                    editable: false,
                    style: "box",
                    showCustomTime: false,
                    cluster: false,
                    axisOnTop: false,
                    //dragAreaWidth: 20,
                    showMajorLabels: false,
                    showMinorLabels: false,
                    //groupsOnRight: true,
                    enableKeys: false,
                    showNavigation: false,
                    showButtonNew: false,
                    animate: false,
                    animateZoom: false,
                    min: playertime_start,
                    max: playertime_end
                };


                // Instantiate our timeline object.
                $("#timelines").append('<div id="timeline2"></div>');
                timeline2 = new links.Timeline(document.getElementById('timeline2'));
                //timeline = new links.Timeline(document.getElementById('mytimeline'));

                // Add event listeners
                //google.visualization.events.addListener(timeline2, 'timechange', onTimeChange);
                //google.visualization.events.addListener(timeline2, 'timechanged', onTimeChanged);

                google.visualization.events.addListener(timeline2, 'rangechange', onrangechange2);

                // Draw our timeline with the created data and options
                timeline2.draw(data, options);
                //                timeline.setVisibleChartRange(playertime.getTime(), playertime.getTime() + 3 * 60 * 1000);


                timeline2.setVisibleChartRange(playertime_start, playertime_end);


                //timeline.setCurrentTime(playertime);
                timeline2.setCustomTime(playertime);



                //                // set a custom range from -2 minute to +3 minutes current time
                //                var start = new Date((new Date()).getTime() - 2 * 60 * 1000);
                //                var end = new Date((new Date()).getTime() + 3 * 60 * 1000);
                //                timeline.setVisibleChartRange(start, end);
            }

            function onrangechange1() {
                var range = timeline.getVisibleChartRange();
                timeline2.setVisibleChartRange(range.start, range.end);
            }

            function onrangechange2() {
                var range = timeline2.getVisibleChartRange();
                timeline.setVisibleChartRange(range.start, range.end);
            }

            function getParameterByName(name, str) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec("?" + str);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            return {
                title: title,
                mediaurl: mediaurl,
                channel: channel,
                publication: publication,
                abstracttxt: abstracttxt,
                description: description,
                newdescription: newdescription,
                playerposition: playerposition,
                playerdebug: playerdebug,
                metadataEditor: metadataEditor,
                metadataViews: metadataViews,
                activate: function (param) {
                    if (param !== undefined) {
                        var id = getParameterByName('id', param);
                        obj.id = id;
                        //var query = "GUID:" + id;

                        // function(callback, query, sort, accessPointGUID, pageIndex, pageSize, includeMetadata, includeFiles, includeObjectRelations, includeAccessPoints)

                        //Object.Get = function (
                        //objectGuids, accessPointGuid, includeMetadata, includeFiles, 
                        //includeObjectRelations, includeFolders, includeAccessPoints, 
                        //pageSize, pageIndex, serviceCaller
                        //)
                        var objguids = [];
                        objguids.push(id);

                        CHAOS.Portal.Client.Object.Get(
                            objguids, Settings.accessPointGuid, true, true,
                            true, false, false,
                            1, 0, null).WithCallback(queryReceived);

                        //(queryReceived, query, null, null, 0, 1, true, true, true, false);

                    }
                },
                compositionComplete: function () {
                    viewready = true;
                    initplayer();
                    inittimeline();
                },
                play: function () {
                    jwplayer().play(true);
                },
                pause: function () {
                    jwplayer().play(false);
                },

                saveMetadata: function () {

                    var x2js = new X2JS();
                    var jsondata = x2js.xml_str2json(obj.metadata);
                    jsondata["Larm.Program"].Description = newdescription();
                    var xmldata = x2js.json2xml_str(jsondata);

                    // Metadata.Set = function (
                    // objectGUID, metadataSchemaGUID, languageCode, 
                    // revisionID, metadataXML, serviceCaller)
                    CHAOS.Portal.Client.Metadata.Set(
                        obj.id, obj.metadataSchemaGuid, "da",
                         1, xmldata, null);

                },
                cbgroupannotations: cbgroupannotations

            };
        });



