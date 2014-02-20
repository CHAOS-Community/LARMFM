define(['knockout'], function (ko) {

    var data;
    var playlist;
    var mediaUrl = ko.observable();
    var mediaImage;
    var isplaying = ko.observable(false);
    var duration = ko.observable(0);
    var position = ko.observable(0);

    var STATE_INIT = 0;
    var STATE_GETDURATION = 1;
    var STATE_DURATIONOK = 2;
    var STATE_READY = 3;
    var state = STATE_INIT;

    var onTimeCallback;

    function createPlaylist() {

        playlist = [];

        if (data == null) {
            playlist.push(
                       {
                           file: "rtmp://ec2-79-125-71-117.eu-west-1.compute.amazonaws.com/vods3/mp4:amazons3/chaosdata/LARM/LARMFM_demo/logical_h264_2.mp4",
                           fileduration: 4123,
                           start: 0,
                           end: 4123
                       });
            return;
        }

        // Parse FileInfos
        // <Larm.FileInfos><Larm.FileInfo><StartOffSetMS>3840000</StartOffSetMS><EndOffSetMS>0</EndOffSetMS><FileName>P2_1800_2000_890121_001.mp3</FileName><Index>0</Index></Larm.FileInfo><Larm.FileInfo><StartOffSetMS>0</StartOffSetMS><EndOffSetMS>1320000</EndOffSetMS><FileName>P2_2000_2200_890121_001.mp3</FileName><Index>1</Index></Larm.FileInfo></Larm.FileInfos>
        var fileinfo = [];
        for (var i = 0; i < data.Metadatas.length; i++) {
            var md = data.Metadatas[i];
            if (md.MetadataSchemaGuid == Settings.Object.FileInfosSchemaGuid) {
                var xml = md.MetadataXml;
                xml = xml.replace(/\./g, '_');
                var x2js = new X2JS({ arrayAccessFormPaths: ['Larm_FileInfos.Larm_FileInfo'] });
                var json = x2js.xml_str2json(xml);
                for (var j = 0; j < json.Larm_FileInfos.Larm_FileInfo.length; j++) {
                    var info = json.Larm_FileInfos.Larm_FileInfo[j];
                    var index = parseInt(info.Index, 10);
                    var start = parseInt(info.StartOffSetMS, 10) / 1000;    // Should be in seconds for jwplayer.
                    var end = parseInt(info.EndOffSetMS, 10) / 1000;
                    fileinfo[index] = { start: start, end: end };
                }
                break;
            }
        }

        // Parse Files
        if (data.Files.length > 0) {
            var fileinfocount = 0;
            for (var i = 0; i < data.Files.length; i++) {
                var ft = data.Files[i].FormatType;
                if (ft == "Audio") {
                    var fi = fileinfo[fileinfocount];
                    if (fi === undefined)
                        return;
                    playlist.push(
                        {
                            file: data.Files[i].URL,
                            fileduration: 0,
                            start: fi.start,
                            end: fi.end
                        }
                        );
                    fileinfocount++;
                }
                else if (ft == "Image") {
                    mediaImage = data.Files[i].URL;
                }

            }
        }
    }

    function setupPlayer() {

        createPlaylist();

        mediaUrlsIdx = 0;

        state = STATE_GETDURATION;

        var mu = "";
        for (var i = 0; i < playlist.length; i++) {
            if(i > 0)
                mu += "<br/>" + playlist[i].file;
            else
                mu += playlist[i].file;
        }
        mediaUrl(mu);

        var w = 1; // 400
        var h = 1; // 150
        var hascontrols = true;

        if (data == null){
            mediaImage = "";
            w = 533;
            h = 300;
            hascontrols = false;
        }

        //setTimeout(function () {
        console.log("Player Setup");
            jwplayer("larmplayer").setup({
                playlist: playlist,
                width: w,
                height: h,
                image: mediaImage,
                controls: hascontrols
            });

            jwplayer().onSetupError(function (e) {
                console.log("Player Setup Error");
            });

            jwplayer().onReady(function (e) {
                console.log("Player Ready");
            });

            jwplayer().getRenderingMode(function (e) {
                console.log("Player getRenderingMode");
            });

            jwplayer().onTime(onTime);
            jwplayer().onPlay(onPlay);
            jwplayer().onPause(onPause);
            jwplayer().onBuffer(function (oldstate) {
                console.log("Player Buffering + " + oldstate);
            });
            jwplayer().onError(function (message) {
                console.log("Player onError = " + message);
            });

            jwplayer().play(true); // Play
        //}, 1);

    }

    function onPlay() {
        console.log("Player Play");
    }

    function onPause() {
        console.log("Player Pause");
    }

    function onTime(e) {
        // e.duration, e.position
        if (state == STATE_READY) {
            var s = jwplayer().getState();
            if (!isplaying() && s == "PLAYING")
                jwplayer().play(false);

            var idx = jwplayer().getPlaylistIndex();
            if (e.position < playlist[idx].start) {
                jwplayer().seek(playlist[idx].start);
            }
            else if (e.position > playlist[idx].end) {

                if (idx + 1 == playlist.length)
                    isplaying(false);
                else
                    jwplayer().playlistItem(idx + 1);
            }
            else {
                // Calculate position
                var pos = e.position - playlist[idx].start;
                if (idx == 1)
                    pos += playlist[0].end - playlist[0].start;
                position(pos);
            }
        }
        else if (state == STATE_DURATIONOK) {
            jwplayer().play(isplaying());
            state = STATE_READY;
        }
        else if (state == STATE_GETDURATION) {
            var idx = jwplayer().getPlaylistIndex();
            var item = playlist[idx];
            if(item.fileduration == 0)
                item.fileduration = e.duration;

            // Duration missing?
            var dur = 0;
            for (var i = 0; i < playlist.length; i++) {
                if (playlist[i].fileduration == 0) {
                    jwplayer().playlistItem(i);
                    return;
                }

                if (playlist[i].end == 0)
                    playlist[i].end = playlist[i].fileduration;

                dur += playlist[i].end - playlist[i].start;
            }

            if (idx != 0) {
                jwplayer().playlistItem(0);
            }
            duration(dur);
            state = STATE_DURATIONOK;
        }
    }

    // Returns program time in seconds.
    function getProgramTimeFromFileTime(fileTimeInSeconds) {
        var filetime = fileTimeInSeconds;
        var fileduracc = 0; // filedurationaccumulated
        var progtmacc = 0; // program time accumulated
        for (var i = 0; i < playlist.length; i++) {
            var pl = playlist[i];
            if (filetime <= fileduracc + pl.fileduration) {
                var localfiletime = filetime - fileduracc;
                var reltime = Math.max(0, localfiletime - pl.start);
                return progtmacc + reltime;
            }
            fileduracc += pl.fileduration;
            progtmacc += pl.end - pl.start;
        }
        return 0;
    }

    // Returns file time in seconds
    function getFileTimeFromProgramTime(programTimeInSeconds) {
        var pt = programTimeInSeconds;
        var ptacc = 0;
        var ftacc = 0; 
        for (var i = 0; i < playlist.length; i++) {
            var pl = playlist[i];
            var programduration = pl.end - pl.start;
            if (pt > programduration + ptacc) {
                ptacc += programduration;
                ftacc += pl.fileduration;
            }
            else {
                return (pt - ptacc) + ftacc + pl.start;
            }
        }

        return 0;
    }

    /*
    public double GetGlobalFilePosition(double visualposition)
		{
			visualposition = System.Math.Max(0, visualposition);
			visualposition = System.Math.Min(_uiwidth, visualposition);

			double ratio = visualposition / _uiwidth;

			double visualdurationacc = 0;
			foreach (var f in _program.Files)
				visualdurationacc += (f.OffsetEndMaximum - f.OffsetBeginMinimum);

			double relativepos = visualdurationacc * ratio;
			double fileduration = 0;
			double filedurationacc = 0;
			double visualduration = 0;
			visualdurationacc = 0;
			foreach (var f in _program.Files)
			{
				fileduration = f.Duration;
				visualduration = f.OffsetEndMaximum - f.OffsetBeginMinimum;
				if (relativepos <= (visualdurationacc + visualduration))
				{
					return filedurationacc + (relativepos - visualdurationacc) + f.OffsetBeginMinimum;
				}
				visualdurationacc += visualduration;
				filedurationacc += fileduration;
			}

			return 0;
		}
    */

    function isReady() {
        return duration() !== 0;
    }

    return {
        duration: duration,
        position: position,
        mediaUrl: mediaUrl,
        isplaying: isplaying,
        init: function (objectdata) {
            data = objectdata;

            if (data == null) {
                setupPlayer();
                return;
            }

            if (data == undefined)
                return;

            setupPlayer();
        },
        isReady: isReady,
        play: function () {
            isplaying(true);
            jwplayer().play(true);
        },
        pause: function () {
            isplaying(false);
            jwplayer().play(false);
        },
        getProgramTimeFromFileTime: getProgramTimeFromFileTime,
        getFileTimeFromProgramTime: getFileTimeFromProgramTime
    };
});
