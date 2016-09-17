function insert(article) {
    console.log('inserting article...');
    var interval = setInterval(() => {
        var title = document.getElementById('editor--input--title');

        var CM = document.getElementsByClassName('CodeMirror');
        if (!title ||
            !CM.length ||
            !CM[0].childNodes.length ||
            !CM[0].childNodes[0].childNodes.length)
        {
            console.log('Editor input not found yet');
            return;
        }

        console.log('Found editor input.');
        clearInterval(interval);

        title.value = article.title;

        var header = `### Metadata

- Tags: #readmelater
- Original at: ${article.uri.spec}\n`;

        if (article.byline) {
            header += `- Authors: ${article.byline}`;
        }

        header += `

# ${article.title}

`;

        var content = header + article.content;

        var cm = CM[0];
        cm = cm.CodeMirror || cm.wrappedJSObject.CodeMirror;
        cm.setValue(content);

        console.log('all set!');
    }, 100);
}

function onMessage(request, sender, sendResponse) {
    console.log('content script received a message');
    switch (request.action) {
        case 'insert':
            insert(request.article);
            break;
        default:
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessage);
