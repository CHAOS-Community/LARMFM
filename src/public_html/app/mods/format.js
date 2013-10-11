define(function() {

    if (!Date.prototype.toISOString) {
        (function() {

            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }

            Date.prototype.toISOString = function() {
                return this.getUTCFullYear()
                        + '-' + pad(this.getUTCMonth() + 1)
                        + '-' + pad(this.getUTCDate())
                        + 'T' + pad(this.getUTCHours())
                        + ':' + pad(this.getUTCMinutes())
                        + ':' + pad(this.getUTCSeconds())
                        + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                        + 'Z';
            };

        }());
    }

    function getSolrDateStr(date, offset) {

        if (offset == undefined) {
            var ds = date.getFullYear() + "-" +
                    getDigit2(date.getMonth() + 1) + "-" +
                    getDigit2(date.getDate()) + "T" +
                    getDigit2(date.getHours()) + ":" +
                    getDigit2(date.getMinutes()) + ":" +
                    getDigit2(date.getSeconds()) + "." +
                    getDigit3(date.getMilliseconds()) + "Z";
            return ds;
        }
        else if (offset === 1) {
            var ds = date.getFullYear() + "-" +
                    getDigit2(date.getMonth() + 1) + "-" +
                    getDigit2(date.getDate()+1) + "T00:00:00.001Z";
            return ds;

        }
        else if (offset === -1) {
            var d = date;
            d.setDate(d.getDate() - 1);
            var ds = d.getFullYear() + "-" +
                    getDigit2(d.getMonth() + 1) + "-" +
                    getDigit2(d.getDate()) + "T23:59:59.999Z";
            return ds;
        }

        var ds = date.getFullYear() + "-" +
                getDigit2(date.getMonth() + 1) + "-" +
                getDigit2(date.getDate()) + "T00:00:00.000Z";
        return ds;

    }

    function getQueryDateStr(date) {
        return date.getFullYear() + '-' + getDigit2(date.getMonth() + 1) + '-' + getDigit2(date.getDate());
    }

    function getDigit2(num) {
        return ("0" + num).slice(-2);
    }

    function getDigit3(num) {
        return ("00" + num).slice(-3);
    }

    function getDateFromQueryDateStr(yyyymmdd) {
        
        // Had to change date parse. Gives NaN in IE8: var d = Date.parse(yyyymmdd);

        if(yyyymmdd==null)
            return null;
        
        var y = parseInt(yyyymmdd.substring(0,4));
        var m = parseInt(yyyymmdd.substring(5,7));
        var d = parseInt(yyyymmdd.substring(8,10));
        
        if (isNaN(d)||isNaN(m)||isNaN(y))
            return null;

        var date = new Date(y,m-1,d);
        return date;
    }

    function getDateFromSolrDateString(ds){
        if(ds==null)
            return null;
        
        var y = parseInt(ds.substring(0,4));
        var m = parseInt(ds.substring(5,7));
        var d = parseInt(ds.substring(8,10));
        var h = parseInt(ds.substring(11,13));
        var mi = parseInt(ds.substring(14,16));
        var s = parseInt(ds.substring(17,19));
        
        if (isNaN(d)||isNaN(m)||isNaN(y)||isNaN(h)||isNaN(mi)||isNaN(s))
            return null;

        var date = new Date(y,m-1,d,h,mi,s);
        return date;        
    }

    function getSolrFilterFromDateRangeStr(solrfield, yyyymmdd1, yyyymmdd2) {
        var d1 = getDateFromQueryDateStr(yyyymmdd1);
        var d2 = getDateFromQueryDateStr(yyyymmdd2);
        var ds1 = getSolrDateStr(d1,-1);
        var ds2 = getSolrDateStr(d2,1);
        return solrfield + ":[" + ds1 + " TO " + ds2 + "]";
    }

    function getParamByName(name, str) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec("?" + str);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    return {
        getParamByName: getParamByName,
        getSolrDateStr: getSolrDateStr,
        getQueryDateStr: getQueryDateStr,
        getDigit2: getDigit2,
        getDigit3: getDigit3,
        getDateFromQueryDateStr: getDateFromQueryDateStr,
        getSolrFilterFromDateRangeStr: getSolrFilterFromDateRangeStr,
        getDateFromSolrDateString: getDateFromSolrDateString
    };
});
