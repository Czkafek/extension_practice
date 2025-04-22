chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if(changeInfo.status === "complete" && tab.url) {
        //Sprawia, że licznik dla tej samej strony ale na innej podstronie będzie inny
        //const storageName = tabId + "_visitCount";
        const domain = new URL(tab.url).hostname;
        const storageName = domain + "_visitCount";
        chrome.storage.local.get([storageName]).then( async result => {
            let storageValue = result[storageName] || 0;
            storageValue++;

            await chrome.storage.local.set({ [storageName]: storageValue });
            console.log("Tab URL:", tab.url);
            console.log(tab.url, " odwiedzony już ", storageValue, " razy");
        });
    }
});