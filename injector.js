function doReplace() {
    var wikiResults = $(".l[href*='en.wikipedia.org/wiki/']");
    wikiResults.each(function(index) {
        chrome.extension.sendRequest({
            'action' : 'getLocalName', 
            'title': $(this).attr("href").replace("http://en.wikipedia.org/wiki/", "")
        }, 
        function(data) { appendLinks(wikiResults[index], data.title, data.lang);} );
    });

        console.log('hi');
}

function appendLinks(element, data, lang) {
    var dataAttrib = "data-wiki-" + lang;
    if (! $(element).attr(dataAttrib)) {
        $(element).attr(dataAttrib, 'data');
        $(element).after("<a class='extra-wikilink' href='http://" + lang + ".wikipedia.org/wiki/" + data + "'>" + data + "</a>");

    }
}

// Calls a function once per event 'burst'.
// Stolen from http://stackoverflow.com/questions/1448652/run-function-once-per-event-burst-with-jquery
// Note: This calls at the beginning, I want at end. FIXME
function throttle(call, timeout) {
    var my = function() {
        if (!my.handle) {
            my.handle = setTimeout(my.rightNow, timeout);
        }
    };
    my.rightNow = function() {
        if (my.handle) {
            clearTimeout(my.handle);
            my.handle = null;
        }
        call();
    };
    return my;
};

var throttledDoReplace = throttle(doReplace, 500);
$(document).ready(function() {
    $('#search').bind('DOMSubtreeModified', function() {
        throttledDoReplace();
    });

    // Initial call, to handle first load
    doReplace();
});
