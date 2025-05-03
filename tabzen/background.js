// Daje listenera na zapytanie od contentu i zwraca nazwę domeny obecnej karty

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'get-current-tab') {
        console.log("in");
        let queryOptions = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(queryOptions, tabs => {
            sendResponse(tabs[0]);
        });
        return true;
    }
});