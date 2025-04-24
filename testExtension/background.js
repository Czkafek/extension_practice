let list = [];
const getList = () => {
    chrome.storage.local.get("list").then(result => {
        list = result.list || [];
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status === "complete" && tab.url) {
        getList();
        console.log(list);
        const domainName = new URL(tab.url).hostname;
        console.log(domainName);
    }
});