define(function() {

    function getSolrDateStr(date) {        
        var ds = date.getFullYear() + "-" +
                getDigit2(date.getMonth()+1) + "-" +
                getDigit2(date.getDate()) + "T" +
                getDigit2(date.getHours()) + ":" +
                getDigit2(date.getMinutes()) + ":" +
                getDigit2(date.getSeconds()) + "." +
                getDigit3(date.getMilliseconds()) + "Z";
        console.log(ds);
        return ds;
    }

    function getQueryDateStr(date){
        return date.getFullYear() + '-' + getDigit2(date.getMonth()+1) + '-' + getDigit2(date.getDate());
    }

    function getDigit2(num) {
        return ("0" + num).slice(-2);
    }

    function getDigit3(num) {
        return ("00" + num).slice(-3);
    }

    function getDateFromQueryDateStr(yyyymmdd){
        var d = Date.parse(yyyymmdd);
        if(isNaN(d))
            return null;
   
        return new Date(d);
    }

    function getSolrFilterFromDateRangeStr(solrfield, yyyymmdd1,yyyymmdd2){
        var d1 = getDateFromQueryDateStr(yyyymmdd1);
        var d2 = getDateFromQueryDateStr(yyyymmdd2);
        var ds1 = getSolrDateStr(d1);
        var ds2 = getSolrDateStr(d2);
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
        getSolrFilterFromDateRangeStr: getSolrFilterFromDateRangeStr
    };
});
