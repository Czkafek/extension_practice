let list = [];
async function checkBlockedTab() {
    const tabResult = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'get-current-tab' }, resolve)
    });

    console.log(tabResult.url);

    const hostname = new URL(tabResult.url).hostname;
    const domain = hostname.split('.')[0];
    console.log(hostname);
    console.log(domain);

    let result = await new Promise( resolve => 
        chrome.storage.local.get("list", resolve)
    );
    list = result.list || [];

    const found = list.find( element => element.domain === domain);
    
    if(!found) return true;

    const style = document.createElement("style");
    style.innerHTML = `
        #blocker_container {
            position: fixed;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 9999;
            background-color: #fff;
        }
        #blocker_title {
            font-weight: 500;
            margin: 0px;
            font-size: 48px;
        }
        #blocker_domain {
            margin: 0px;
            padding-bottom: 40px;
            color: #cc2828;
            font-size: 48px;
        }
        #blocker_amount {
            font-size: 32px;
            padding-bottom: 40px;
            font-size: 40px;
        }
        #blocker_span {
            font-weight: 500;
        }

        #blocker_brake {
            font-size: 32px;
            margin: 0px;
            padding-bottom: 24px;
            font-weight: 500;
        }
        #blocker_timerContainer {
            font-size: 40px;
        }
    `;
    document.head.appendChild(style);

    let string =    `
                    <div id="blocker_container">
                        <h1 id="blocker_title">Zablokowana domena:</h1>
                        <h1 id="blocker_domain">${domain}</h1>
                        <h2 id="blocker_amount"><span id="blocker_span">Ilość wejść:</span> ${found.visitCount}/${found.amount}</h2>

                        <h3 id="blocker_brake">Przerwa:</h3>
                        <h2 id="blocker_timerContainer"><span id="blocker_timer">${found.breakSpan}</span>s</h2>
                    </div>
                    `
    document.body.innerHTML += string;

    const timer = document.getElementById("blocker_timer");
    const intervalId = setInterval(() => {
        if(timer.innerHTML == 1) {
            clearInterval(intervalId);
        }
        else {
            timer.innerHTML = timer.innerHTML - 1;
        }
    }, 1000);
}

const timer = () => {

}

checkBlockedTab();
