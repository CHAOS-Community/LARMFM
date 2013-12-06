define(function () {

    var data;
    var playlist;
    var mediaImage;
    var isplaying = true; // autoplay

    var STATE_INIT = 0;
    var STATE_GETDURATION = 1;
    var STATE_DURATIONOK = 2;
    var STATE_READY = 3;
    var state = STATE_INIT;

    function createPlaylist() {
        
        playlist = [];

        // Parse FileInfos
        // <Larm.FileInfos><Larm.FileInfo><StartOffSetMS>3840000</StartOffSetMS><EndOffSetMS>0</EndOffSetMS><FileName>P2_1800_2000_890121_001.mp3</FileName><Index>0</Index></Larm.FileInfo><Larm.FileInfo><StartOffSetMS>0</StartOffSetMS><EndOffSetMS>1320000</EndOffSetMS><FileName>P2_2000_2200_890121_001.mp3</FileName><Index>1</Index></Larm.FileInfo></Larm.FileInfos>
        var fileinfo = [];
        for (var i = 0; i < data.Metadatas.length; i++) {
            var md = data.Metadatas[i];
            if (md.MetadataSchemaGuid == Settings.Object.FileInfosSchemaGuid) {
                var xml = md.MetadataXml;
                xml = xml.replace(/\./g, '_');
                var x2js = new X2JS();
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
            for (var i = 0; i < data.Files.length; i++) {
                var ft = data.Files[i].FormatType;
                if (ft == "Audio") {
                    var fi = fileinfo[i];
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

        //jwplayer("larmplayer").setup({
        //    file: mediaUrls[mediaUrlsIdx],
        //    width: 1,
        //    height: 1,
        //    image: mediaImage,
        //    controls: true
        //});

        jwplayer("larmplayer").setup({
            playlist: playlist
        });


        jwplayer().onTime(onTime);
        jwplayer().onPlay(onPlay);
        jwplayer().onPause(onPause);
        jwplayer().play(true); // Play
    }

    function onPlay() {
        
    }

    function onPause() {
    }

    function onTime(e) {
        // e.duration, e.position
        if (state == STATE_READY) {
            var s = jwplayer().getState();
            if (!isplaying && s == "PLAYING")
                jwplayer().play(false);
            
            var idx = jwplayer().getPlaylistIndex();
            if (e.position < playlist[idx].start) {
                jwplayer().seek(playlist[idx].start);
            }
        }
        else if (state == STATE_DURATIONOK) {
            jwplayer().play(isplaying);
            state = STATE_READY;
        }
        else if (state == STATE_GETDURATION) {
            var idx = jwplayer().getPlaylistIndex();
            var item = playlist[idx];
            item.fileduration = e.duration;

            // Duration missing?
            for (var i = 0; i < playlist.length; i++) {
                if (playlist[i].fileduration == 0) {
                    jwplayer().playlistItem(i);
                    return;
                }
            }

            if (idx != 0) {
                jwplayer().playlistItem(0);
            }
            state = STATE_DURATIONOK;
        }
    }

    return {
        init: function (objectdata) {
            data = objectdata;

            if (data == undefined)
                return;

            setupPlayer();
        }
        
    };
});
