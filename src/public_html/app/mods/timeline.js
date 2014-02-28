define(['durandal/app', 'knockout', 'mods/player', 'mods/format'], function (app, ko, player, format) {

    var timeline = undefined;
    var state = ko.observable(0);
    var ready = false;
    var data = undefined;
    var timelines = [];
    var datas = [];
    var timeline_centered = true;
    var onTimeChangeActive = false;

    var duration = ko.observable(0);
    var start = ko.observable(0);
    var end = ko.observable(0);

    var pos = 0;

    function initTimeline() {
        // Create and populate a data table.
        data = new google.visualization.DataTable();

        data.addColumn('datetime', 'start');
        data.addColumn('datetime', 'end');
        data.addColumn('string', 'content');
        data.addColumn('boolean', 'editable');
        data.addColumn('string', 'id');
        //data.addColumn('string', 'group');

        var date = new Date(2000, 1, 1, 0, 0, 0, 0);
        start(date.getTime());
        end(start() + duration());

        var options = {
            width: "100%",
            //height: "200px",
            //minHeight: "200px",
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
            showButtonNew: false,
            animate: true,
            animateZoom: true,
            min: start(),
            max: end()
        };

        $("#timelinescroll").css("opacity","1");
        $("#timelinescroll").scroll(ontimelinescrolling);

        // Instantiate our timeline object.
        $("#timelines").append('<div id="timeline1"></div>');
        timeline = new links.Timeline(document.getElementById('timeline1'));

        // Add event listeners
        google.visualization.events.addListener(timeline, 'timechange', onTimeChange);
        google.visualization.events.addListener(timeline, 'timechanged', onTimeChanged);

        google.visualization.events.addListener(timeline, 'rangechange', onRangeChange);

        // Draw our timeline with the created data and options
        timeline.draw(data, options);

        timeline.setVisibleChartRange(start(), end());
        timeline.setCustomTime(start());

        // add, change, edit, delete, select
        //google.visualization.events.addListener(timeline, 'select', onannotationselect);
        google.visualization.events.addListener(timeline, 'edit', onannotationedit); // NOT FIRED!
        google.visualization.events.addListener(timeline, 'change', onannotationchange);
        //google.visualization.events.addListener(timeline, 'add', onannotationadd);

        google.visualization.events.addListener(timeline, 'dblclick', ondblclick);
        google.visualization.events.addListener(timeline, 'requestadd', onrequestadd);

        google.visualization.events.addListener(timeline, 'select', onselect);

        google.visualization.events.addListener(timeline, 'play', onplay);
        google.visualization.events.addListener(timeline, 'loop', onloop);
        google.visualization.events.addListener(timeline, 'viewmetadata', onviewmetadata);
        google.visualization.events.addListener(timeline, 'editmetadata', oneditmetadata);
        
        ready = true;
        state(1);
    }

    function onselect() {
    }

    function onplay() {
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var dat = timeline.getItem(row);

                var s = format.getTimeStringFromDate(dat.start);
                s = format.getSecondsFromString(s);
                player.setProgramTimePos(s);
                player.play();
                //var e = format.getSecondsFromString(ann.endtime());
                //player.setProgramTimeLoop(s, e);
                //player.playLoop();
            }
        }

    }

    function onloop() {
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var dat = timeline.getItem(row);

                var s = format.getTimeStringFromDate(dat.start);
                s = format.getSecondsFromString(s);
                var e = format.getTimeStringFromDate(dat.end);
                e = format.getSecondsFromString(e);
                player.setProgramTimeLoop(s, e);
                player.playLoop();
            }
        }
        //window.scrollTo(0, 0);
        //var s = format.getSecondsFromString(ann.starttime());
        //var e = format.getSecondsFromString(ann.endtime());
        //player.setProgramTimeLoop(s, e);
        //player.playLoop();
    }

    function onviewmetadata() {
    }

    function oneditmetadata() {
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var dat = timeline.getItem(row);
                app.trigger('metadata:edit', dat);
            }
        }
    }

    function onrequestadd() {
        app.trigger("annotation:add", {});
    }

    function ondblclick() {
        //var sel = timeline.getSelection();
        //if (sel.length) {
        //    if (sel[0].row != undefined) {
        //        var row = sel[0].row;
        //        var dat = timeline.getItem(row);
        //        app.trigger('metadata:edit', dat);
        //    }
        //}
    }

    function onannotationadd() {

        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var dat = timeline.getItem(row);

                var amd = {
                    GUID: "02120d71-c88b-7523-273b-6790bf0b77a5",
                    MetadataSchemaGUID: "50ad46c4-eaf1-42f6-9361-3f6b56c5f320",
                    EditingUserGUID: "7d2db0e4-8cfd-4ecf-92e8-3eba34914011",
                    EditingUser: "Thomas Lynge",
                    DateCreated: "05-04-2013 09:07:15",
                    LanguageCode: "da",
                    StartTime: format.getTimeStringFromDate(dat.start),
                    EndTime: format.getTimeStringFromDate(dat.end),
                    Title: dat.content
                };

                var annedit = new metadatafac.MetadataView();
                annedit.setview("annotationedit", amd);
                metadataEditors.push(annedit);
            }
        }
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
            }
        }
    }

    function onannotationchange() {
        var sel = timeline.getSelection();
        if (sel.length) {
            if (sel[0].row != undefined) {
                var row = sel[0].row;
                var dat = timeline.getItem(row);
                app.trigger('metadata:changed_timeline', {data: dat});
            }
        }
    }

    function onTimeChange(event) {
        onTimeChangeActive = true;
    }

    function onTimeChanged(event) {
        var timediff = event.time - start();
        player.setProgramTimePos(timediff / 1000);
        onTimeChangeActive = false;
    }

    var ontimelinescrollingdisable = false;
    function ontimelinescrolling(e) {
        if (ontimelinescrollingdisable) {
            ontimelinescrollingdisable = false;
            return;
        }

        var totalpixel = $("#timelinescrollcontent").width();
        var rangeobj = timeline.getVisibleChartRange();
        var rangevalue = rangeobj.end - rangeobj.start;

        var pixelpervalue = duration() / totalpixel;

        var scrollpos = $("#timelinescroll").scrollLeft();
        var res = totalpixel / (scrollpos);

        var starttime = start() + duration() / res;
        timeline.setVisibleChartRange(starttime, starttime + rangevalue);
    }

    function onRangeChange(event) {
        var totalvalue = end() - start();
        var rangevalue = event.end - event.start;
        var totalpixel = $("#timelinescroll").width();

        var conwdt = (totalvalue / rangevalue) * totalpixel;

        $("#timelinescrollcontent").width(conwdt);

        var startdiff = event.start - start();

        ontimelinescrollingdisable = true;
        if (startdiff == 0)
            $("#timelinescroll").scrollLeft(0);
        else
            $("#timelinescroll").scrollLeft(conwdt / (totalvalue / startdiff));

        var range = timeline.getVisibleChartRange();
        //timeline2.setVisibleChartRange(range.start, range.end);

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

        //var range = timeline.getVisibleChartRange();
        //timeline2.setVisibleChartRange(range.start, range.end);
    }

    function getTimelineDate(d, millisecoffset) {
        var dt = new Date(d);
        dt.setMilliseconds(dt.getMilliseconds() + millisecoffset);
        return dt;
    }

    function isReady() {
        return ready;
    }

    function addData(datarows) {
        data.addRows(datarows);
        timeline.redraw();
    }

    function getAnnotation(guid) {

        var r = data.xf;
        for (var i = 0; i < r.length; i++) {
            if (r[i].c[4].v == guid) {
                return r[i].c;
            }
        }
    }

    var prepos = 0;
    var mainloop = function () {

        if (!ready)
            return;

        var position = Math.round(pos * 100) / 100;
        if (prepos == position)
            return;

        prepos = position;
        timeline.setCustomTime(start() + position * 1000); // Convert to milliseconds
        //var r = timeline.getVisibleChartRange();
        //playerdebug(timestr(r.start) + " - " + timestr(r.end));

        if (timeline_centered) {
            timeline.centerTimeline();
        }


    };

    var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            null;

    if (animFrame !== null) {
        var recursiveAnim = function () {
            mainloop();
            animFrame(recursiveAnim);
        };

        // start the mainloop
        animFrame(recursiveAnim);
    } else {
        var ONE_FRAME_TIME = 1000.0 / 60.0;
        setInterval(mainloop, ONE_FRAME_TIME);
    }

    return {
        state: state,
        start: start,
        end: end,
        // dur = duration in seconds
        init: function (dur) {
            duration(dur * 1000); // Convert to milliseconds
            google.load("visualization", "1", { "callback": initTimeline });
        },
        // setTime: time = Seconds
        setPosition: function (position) {
            if (!onTimeChangeActive) {
                pos = position;
            }
        },
        isReady: isReady,
        addData: addData,
        redraw: function () {
            if(timeline)
                timeline.redraw();
        },
        clearData: function(){
            data.removeRows(0, data.getNumberOfRows());
            timeline.redraw();
        },
        getAnnotation: getAnnotation,
        editItem: function (id) {
            timeline.editItem(id);
        },
        getSelection: function () {
            var sel = timeline.getSelection();
            if (sel.length) {
                if (sel[0].row != undefined) {
                    var row = sel[0].row;
                    var dat = timeline.getItem(row);
                    return dat;
                }
            }
            return undefined;
        },
        changeItem: function (start, end, content) {
            var sel = timeline.getSelection();
            if (sel.length) {
                if (sel[0].row != undefined) {
                    var row = sel[0].row;
                    var dat = timeline.getItem(row);

                    var s = start;
                    var e = end;
                    var c = content;

                    timeline.changeItem(row, { start: s, end: e, content: c });
                }
            }
        },
        selectItemById: function(id) {
            timeline.selectItemById(id);
        },
        unselectItem: function () {
            timeline.unselectItem();
        },
        addItemAtCursor: function (id) {
            timeline.addItemAtCursor(id);
        },
        deleteItemByID: function (id) {
            timeline.deleteItemByID(id);
        }
    };
});
