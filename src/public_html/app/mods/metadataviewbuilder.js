define(['knockout', 'mods/localization'], function (ko, locale) {

    function loc(t) {
        if (!t || t.length === 0)
            return "";

        if (t.substring(0, 1) == "!") {
            return locale.text(t.substring(1));
        }

        return t;
    }

    function txt(t) {
        if (t)
            return t;

        return "";
    }

    function titlehtml(title) {
        return '<h5 class="dotted">' + loc(title) + '</h5>';
    }

    function getArray(arr) {

        if (Array.isArray(arr))
            return arr;

        for (var prop in arr) {
            if (arr.hasOwnProperty(prop) && Array.isArray(arr[prop]))
                return arr[prop];
        }

        return null;
    }

    return {
        mdheadline: function (parent, title) {
            parent.push(this.headline(title));
        },
        headline: function (title) {
            return '<h4>' + loc(title) + '</h4>';
        },
        mdtext: function (parent, title, text) {
            parent.push(this.text(title, text));
        },
        text: function (title, text) {
            return titlehtml(title) + '<div class="md-text">' + text + '</div>';
        },
        mdtags: function (parent, title, tagarray, prop) {
            parent.push(this.tags(title, tagarray, prop));
        },
        tags: function (title, tagarray, prop) {
            var t = titlehtml(title) + '<div class="md-tags">';

            var arr = tagarray;
            if (typeof arr === "string") {
                //OpenEnumerationList_Tags
                arr = arr.split(" ");
            } else {

                if (prop && Array.isArray(tagarray) && tagarray.length > 0)
                    arr = tagarray[0];

                if (prop) {
                    if (arr.hasOwnProperty(prop)) {
                        arr = getArray(arr[prop]);
                    } else {
                        arr = null;
                    }

                } else
                    arr = getArray(arr);
            }

            if (arr != null) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] !== "")
                        t += '<button class="btn btn-tag" style="margin-left: 4px;margin-bottom: 4px;">' + arr[i] + '</button>'
                }
            }

            t += '</div>';
            return t;
        },
        mdtable: function (parent, title, dataarray, titlearray, fieldarray) {
            parent.push(this.table(title, dataarray, titlearray, fieldarray));
        },
        table: function (title, dataarray, titlearray, fieldarray) {

            var da = getArray(dataarray);

            var t = titlehtml(title);
            if (da != null && da.length > 0 && typeof da[0] !== "string") {

                t += '<table class="md-table table table-bordered">';
                t += '<tr>';
                for (var i = 0; i < titlearray.length; i++) {
                    t += '<th>' + loc(titlearray[i]) + '</th>';
                }
                t += '</tr>';
                for (var i = 0; i < da.length; i++) {
                    t += '<tr>';
                    for (var j = 0; j < fieldarray.length; j++) {
                        t += '<td>' + txt(da[i][fieldarray[j]]) + '</td>';
                    }
                    t += '</tr>';
                }
                t += '</table>';
            }
            return t;
        },
        mdgrid: function (parent, title, gridarray) {
            parent.push(this.grid(title, gridarray));
        },
        grid: function (title, gridarray) {
            var t = titlehtml(title);
            t += '<table class="md-table table table-bordered">';
            for (var i = 0; i < gridarray.length; i++) {
                t += '<tr>';
                for (var j = 0; j < gridarray[i].length; j++) {
                    t += '<td>' + txt(gridarray[i][j]) + '</td>';
                }
                t += '</tr>';
            }
            t += '</table>';
            return t;
        }
    }
});