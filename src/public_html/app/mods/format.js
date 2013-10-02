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
        getDigit3: getDigit3
    };
});
