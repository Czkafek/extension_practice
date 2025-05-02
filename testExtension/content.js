async function checkBlockedTab() {
    console.log(chrome);
    console.log("Hej");
    const tabResult = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'get-current-tab' }, resolve)
    });

    console.log(tabResult.url);
    const tab = new URL(tabResult.url).hostname;

    const listResult = await new Promise(resolve => {
        chrome.storage.local.get("list", resolve)
    });

    const list = listResult.list || [];
    console.log("Aktualna karta: ", tab);
    console.log("Lista blokowanych domen: ", list);

    if(list.length !== 0 && list.includes(tab)) {
        document.body.innerHTML = `<h1>Page under hostname: "${tab}" is blocked</h1>`
    }

};

checkBlockedTab();