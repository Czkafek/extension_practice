/*
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Olda value was "${oldValue}", new value is "${newValue}".`
        );
    }
});
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === "get-current-tab") {
        let queryOptions = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(queryOptions, tabs => {
            sendResponse(tabs[0]);
        });
        return true;
    }
})