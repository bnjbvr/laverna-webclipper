function saveOptions(e) {
    chrome.storage.local.set({
        url: document.querySelector("#url").value
    });
}

function restoreOptions() {
    chrome.storage.local.get('url', res => {
        document.querySelector("#url").value = res.url || 'https://laverna.cc/app';
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('url').oninput = saveOptions;
