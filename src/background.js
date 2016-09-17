function currentTab() {
    return new Promise(accept => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs)
                return accept(null);
            accept(tabs[0]);
        });
    });
}

function executeScript(tabId, scriptURL) {
    console.log('injecting', scriptURL);
    return new Promise(accept => {
        chrome.tabs.executeScript(tabId, { file: scriptURL }, accept);
    });
}

function getBaseURL() {
    console.log('Retrieving base url...');
    return new Promise(accept => {
        chrome.storage.local.get('url', res => {
            accept(res.url);
        });
    });
}

function createLavernaTab(baseURL) {
    return new Promise(accept => {
        var onActivated = () => {
            console.log('activated!');
            chrome.tabs.onActivated.removeListener(onActivated);
            accept();
        };
        chrome.tabs.onActivated.addListener(onActivated);

        // Open the Laverna tab.
        chrome.tabs.create({
            active: true,
            url: baseURL + '#notes/add'
        });
    });
}

function sleep(ms) {
    return new Promise(accept => {
        setTimeout(accept, ms);
    });
}

function onClipperAnswer(article) {
    console.log('Received article from the content script:', article.title);
    getBaseURL().then(url => {
        var baseURL = url;

        // Remove trailing forward slash.
        if (baseURL[baseURL.length] === '/') {
            baseURL = baseURL.substring(0, baseURL.length - 1);
        }

        return createLavernaTab(baseURL);
    }).then(() => {
        return sleep(1000);
    }).then(() => {
        return currentTab();
    }).then(tab => {
        console.log('Sending message', tab.id);
        chrome.tabs.sendMessage(tab.id, { action: "insert", article });
    });
}

function onClick() {
    var tabId;
    currentTab().then(tab => {
        tabId = tab.id;
        return executeScript(tabId, 'src/vendor/Readability.js');
    }).then(() => {
        return executeScript(tabId, 'src/vendor/md.min.js');
    }).then(() => {
        return executeScript(tabId, 'src/content-send-article.js');
    }).then(() => {
        console.log('sending message to injected script');
        chrome.tabs.sendMessage(tabId, { action: "clip" }, article => {
            onClipperAnswer(article);
            chrome.tabs.reload(tabId);
        });
    }).catch(err => {
        console.error('Error', err);
    });
}

chrome.browserAction.onClicked.addListener(onClick);
