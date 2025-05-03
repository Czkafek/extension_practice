async function checkBlockedTab() {
    const tabResult = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'get-current-tab' }, resolve)
    });

    console.log(tabResult.url);

    const domain = new URL(tabResult.url).hostname;
    console.log(domain);

    // teraz sprawdza czy dana domena znajduje się na liście, czy nie i następnie jeśli tak to wstawia w body element nad wszystkimi innymi elementami, który jest timerem
}

checkBlockedTab();
