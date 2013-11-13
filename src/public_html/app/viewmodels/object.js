define(['durandal/app', 'knockout', 'mods/portal', 'mods/state', 'factory/object', 'mods/xmlmanager', 'mods/jsonformfields','factory/metadata'],
        function(app, ko, portal, state, objfac, xmlman, jsonformfields, metadatafac) {

            var title = ko.observable();
            var channel = ko.observable();
            var publication = ko.observable();
            var abstract = ko.observable();
            var description = ko.observable();
            var newdescription = ko.observable();

            var dataready = false;
            var viewready = false;
            var playerready = false;
            var mediaurl = ko.observable();
            var mediaimage = ko.observable();
            var playerposition = ko.observable(0);
            var playerdebug = ko.observable("");

            var playertime = undefined;
            var playertime_start = undefined;
            var playertime_end = undefined;
            
            var timeline_centered = false;

            var data = undefined;
            var timeline = undefined;
            var onTimeChangeActive = false;

            var metadataEditor = ko.observable();
            var metadataEditors = ko.observableArray();

            var obj = {};    

            // Getting data from API.
            function queryReceived(data)
            {
                var r = data.Body.Results[0];
                // TODO: Settings.Search.metadataSchemaGuid
                var mdsguid = state.searchMetadataSchemaGuids[0]; //brand.getSearchMetadataSchemaGuid(r);
                
                if(r == undefined)
                {
                    app.showMessage("The data is not available for this object.", "Data missing", ["OK", "Cancel"]);
                    return;
                }                
                if(r.Metadatas == undefined)
                {
                    app.showMessage("The metadata is not available for this object.", "Metadata missing", ["OK", "Cancel"]);
                    return;
                }
                
                for (var j = 0; j < r.Metadatas.length; j++)
                {
                    if (r.Metadatas[j].MetadataSchemaGuid == mdsguid)
                    {
                        obj.metadataSchemaGuid = mdsguid;
                        var xml = r.Metadatas[j].MetadataXml;
                        var x = xmlman.parseXml(xml);
                        obj.metadata = x;
                        
                        title($(x).find("Title").text());
                        channel($(x).find("PublicationChannel").text());
                        publication($(x).find("PublicationDateTime").text());
                        abstract($(x).find("Abstract").text());
                        description($(x).find("Description").text());

                    }
                }

                var previous_mediaurl = mediaurl();
                if (r.Files.length > 0)
                    for (var i = 0; i < r.Files.length; i++)
                    {
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

                // Init metadataEditor
                //<!--ko compose: 'viewmodels/metadataitem' --><!--/ko-->
                //var metadataitem = require(["viewmodels/metadataitem"]);
                var editor = new metadatafac.MetadataEditor();
                editor.seteditor("test");
                editor.show();
                metadataEditors.push(editor)

                var ged = new metadatafac.MetadataEditor();
                ged.seteditor("generic");
                ged.setmetadata(obj.metadataSchemaGuid, obj.metadata);
                ged.show();
                metadataEditors.push(ged)


                //metadataEditor("viewmodels/metadataitem");
                //metadataEditor(metadataitem());
                    
            }

            function initplayer()
            {
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
                    controls: true,
                });

                jwplayer().onTime(
                        function() {
                            playerposition(jwplayer().getPosition());
                            if (!onTimeChangeActive){
                                //timeline.setCurrentTime(playertime.getTime() + playerposition() * 1000);
                                timeline.setCustomTime(playertime.getTime() + playerposition() * 1000);
                                //timeline.setVisibleChartRangeNow();
                                var r = timeline.getVisibleChartRange();
                                playerdebug(timestr(r.start) + " - " + timestr(r.end));

                                if(timeline_centered){
                                    
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

                google.load("visualization", "1", {"callback": drawVisualization});
            }

            function onTimeChange(event) {
                onTimeChangeActive = true;
            }

            function onTimeChanged(event) {
                var timediff = event.time - playertime;
                jwplayer().seek(timediff / 1000);
                onTimeChangeActive = false;
            }

            function onRangeChange(event) {                
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

            }

            function drawVisualization() {
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
                playertime = t;
                playertime_start = t;
                playertime_end = t.getTime() + 30 * 60 * 1000;

                data.addRows([
                    [new Date(t.getTime() + 15), , 'Conversation<br>' +
                                '<img src="img/comments-icon.png" style="width:32px; height:32px;">'],
                    [new Date(t.getTime() + 16), , 'Mail from boss<br>' +
                                '<img src="img/mail-icon.png" style="width:32px; height:32px;">'],
                    [new Date(t.getTime() + 18), , 'Report'],
                    [new Date(t.getTime() + 20), new Date(t.getTime() + 26), 'Traject A'],
                    [new Date(t.getTime() + 22), , 'Memo<br>' +
                                '<img src="img/notes-edit-icon.png" style="width:48px; height:48px;">'],
                    [new Date(t.getTime() + 23), , 'Phone call<br>' +
                                '<img src="img/Hardware-Mobile-Phone-icon.png" style="width:32px; height:32px;">'],
                    [new Date(t.getTime() + 24), new Date(t.getTime() + 27), 'Traject B'],
                    [new Date(t.getTime() + 29), , 'Report<br>' +
                                '<img src="img/attachment-icon.png" style="width:32px; height:32px;">']

                ]);

                var options = {
                    width: "100%",
                    height: "50px",
                    editable: true,
                    style: "box",
                    showCustomTime: true
                };

                // Instantiate our timeline object.
                timeline = new links.Timeline(document.getElementById('mytimeline'));

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
                abstract: abstract,
                description: description,
                newdescription: newdescription,
                playerposition: playerposition,
                playerdebug: playerdebug,
                metadataEditor: metadataEditor,
                metadataEditors: metadataEditors,
                activate: function(param) {
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
                            objguids,Settings.accessPointGuid,true,true,
                            true,false,false,
                            1,0,null).WithCallback(queryReceived);
                        
                        //(queryReceived, query, null, null, 0, 1, true, true, true, false);

                    }
                },
                compositionComplete: function() {
                    viewready = true;
                    initplayer();
                    inittimeline();
                },
                play: function() {
                    jwplayer().play(true);
                },
                pause: function() {
                    jwplayer().play(false);
                },
                
                saveMetadata: function(){
                                   
               var x2js = new X2JS();
               var jsondata = x2js.xml_str2json( obj.metadata );
               jsondata["Larm.Program"].Description = newdescription();
               var xmldata = x2js.json2xml_str(jsondata);

                // Metadata.Set = function (
                // objectGUID, metadataSchemaGUID, languageCode, 
                // revisionID, metadataXML, serviceCaller)
               CHAOS.Portal.Client.Metadata.Set(
                   obj.id,obj.metadataSchemaGuid,"da",
                    1,xmldata,null);
               
                }
                
            };
        });



