define(['knockout'], function (ko) {

    var timeline = undefined;
    var data = undefined;
    var timelines = [];
    var datas = [];
    var timeline_centered = true;
    var onTimeChangeActive = false;

    var duration;
    var start;
    var end;

    function initTimeline() {
        // Create and populate a data table.
        data = new google.visualization.DataTable();

        data.addColumn('datetime', 'start');
        data.addColumn('datetime', 'end');
        data.addColumn('string', 'content');
        data.addColumn('boolean', 'editable');
        data.addColumn('string', 'id');

        var date = new Date(2000, 1, 1, 0, 0, 0, 0);
        start = date.getTime();
        end = start + duration;

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
            showButtonNew: true,
            animate: true,
            animateZoom: true,
            min: start,
            max: end
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

        timeline.setVisibleChartRange(start, end);
        timeline.setCustomTime(start);

        // add, change, edit, delete, select
        google.visualization.events.addListener(timeline, 'select', onannotationselect);
        google.visualization.events.addListener(timeline, 'edit', onannotationedit); // NOT FIRED!
        google.visualization.events.addListener(timeline, 'change', onannotationchange);
        google.visualization.events.addListener(timeline, 'add', onannotationadd);

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

    function onTimeChange(event) {
        onTimeChangeActive = true;
    }

    function onTimeChanged(event) {
        var timediff = event.time - start;
        jwplayer().seek(timediff / 1000);
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

        var pixelpervalue = duration / totalpixel;

        var scrollpos = $("#timelinescroll").scrollLeft();
        var res = totalpixel / (scrollpos);

        var starttime = start + duration / res;
        timeline.setVisibleChartRange(starttime, starttime + rangevalue);
    }

    function onRangeChange(event) {
        var totalvalue = end - start;
        var rangevalue = event.end - event.start;
        var totalpixel = $("#timelinescroll").width();

        var conwdt = (totalvalue / rangevalue) * totalpixel;

        $("#timelinescrollcontent").width(conwdt);

        var startdiff = event.start - start;

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

    function getMilliFromString(timestr) {
        var h = parseInt(timestr.substring(0, 2));
        var m = parseInt(timestr.substring(3, 5));
        var s = parseInt(timestr.substring(6, 8));
        var ms = parseInt(timestr.substring(9, 12));

        return ms + s * 1000 + m * 1000 * 60 + h * 1000 * 60 * 60;
    }

    return {
        // dur = duration in seconds
        init: function (dur) {
            duration = dur * 1000; // Convert to milliseconds
            google.load("visualization", "1", { "callback": initTimeline });
        },
        // setTime: time = Seconds
        setPosition: function (position) {
            if (!onTimeChangeActive) {
                timeline.setCustomTime(start + position * 1000); // Convert to milliseconds
                var r = timeline.getVisibleChartRange();
                //playerdebug(timestr(r.start) + " - " + timestr(r.end));

                if (timeline_centered) {
                    timeline.centerTimeline();
                }
            }

        }
    };
});
