function clip(sendResponse) {
    var title = document.getElementsByTagName('title')[0];
    title = (title && title.textContent) || 'unknownTitle';

    var body = document.getElementsByTagName('body')[0];
    if (!body) {
        console.log('aborting: no content');
        return;
    }

    var loc = document.location;
    var uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + "//" + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
        pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };

    var article = new Readability(uri, document).parse();

    article.content = md(article.content);

    sendResponse(article);
    console.log('Article sent back to parent!');
}

function onMessage(request, sender, sendResponse) {
    console.log('content-send-article script received a message');
    switch (request.action) {
        case 'clip':
            clip(sendResponse);
            break;
        default:
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessage);
