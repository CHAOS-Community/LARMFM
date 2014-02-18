﻿define(['knockout', 'mods/localization'], function (ko, locale) {

    function loc(t) {
        if (!t || t.length === 0)
            return "";

        if (t.substring(0, 1) == "!") {
            return locale.text(t.substring(1));
        }

        return t;
    }

    function titlehtml(title) {
        return '<h5 class="dotted">' + loc(title) + '</h5>';
    }

    return {
        headline: function (title) {
            return '<h4>' + loc(title) + '</h4>';
        },

        text: function (title, text) {
            return  titlehtml(title) + '<div class="md-text">' + text + '</div>';
        },

        tags: function (title, tagarray) {
            var t = titlehtml(title) + '<div class="md-tags">';
            for(var i = 0; i < tagarray.length; i++){
                t += '<button class="btn btn-tag" style="margin-left: 4px;">' + tagarray[i] + '</button>'
            }
            t += '</div>';
            return t;
        },

        table: function (title, dataarray, titlearray, fieldarray) {
            var t = titlehtml(title) + '<table class="md-table table table-bordered">';
            t += '<tr>';
            for (var i = 0; i < titlearray.length; i++) {
                t += '<th>' + loc(titlearray[i]) + '</th>';
            }
            t += '</tr>';
            for (var i = 0; i < dataarray.length; i++) {
                t += '<tr>';
                for (var j = 0; j < fieldarray.length; j++) {
                    t += '<td>' + dataarray[i][fieldarray[j]] + '</td>';
                }
                t += '</tr>';
            }
            t += '</table>';
            return t;
        },

        grid: function (title, gridarray) {
            var t = titlehtml(title);
            t += '<table class="md-table table table-bordered">';
            for (var i = 0; i < gridarray.length; i++) {
                t += '<tr>';
                for (var j = 0; j < gridarray[i].length; j++) {
                    t += '<td>' + gridarray[i][j] + '</td>';
                }
                t += '</tr>';
            }
            t += '</table>';
            return t;
        }
    }
});