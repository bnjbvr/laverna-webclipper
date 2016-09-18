var background = chrome.extension.getBackgroundPage();

function saveOptions(e) {
    chrome.storage.local.set({
        url: document.querySelector("#url").value
    });
}

function restoreOptions() {
    background.getBaseURL().then(url => {
        document.querySelector("#url").value = url;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('url').oninput = saveOptions;
