define(function () {

    var data;
    var playlist;
    var mediaImage;
    var isplaying = false;

    var STATE_INIT = 0;
    var STATE_GETDURATION = 1;
    var STATE_DURATIONOK = 2;
    var STATE_READY = 3;
    var state = STATE_INIT;

    function createPlaylist() {
        
        playlist = [];
        if (data.Files.length > 0) {
            for (var i = 0; i < data.Files.length; i++) {
                var ft = data.Files[i].FormatType;
                if (ft == "Audio") {
                    playlist.push(
                        {
                            file: data.Files[i].URL,
                            fileduration: 0,
                            start: 0,
                            end: 0
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
        
        //if (mediaUrls.length == 0)
        //    return;

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
                jwplayer.play(false);
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

    function getfilesduration() {
        
    }


    return {
        init: function (objectdata) {
            data = objectdata;

            if (data == undefined)
                return;

            setupPlayer();
            //getfilesduration();
        }
        
    };
});
