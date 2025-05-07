let list = [];
let initialized = false;

const tryInitialize = () => {
    if (initialized) return true;

    console.log("Próba inicjalizacj, readyState: ", document.readyState);

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log("Dokument Już załadowany");
        initialize();
    }

    else {
        document.addEventListener("DOMContentLoaded", () => {
            console.log("Skrypt uruchomiony - DOM załadowany");
            initialize();
        });

        window.addEventListener("load", () => {
            console.log("Zdarzenie window.load");
            initialize();
        });

        document.addEventListener("readystatechange", () => {
            console.log("readyState zmieniony na: ", document.readyState);
            if (document.readyState === "complete" || document.readyState === "interactive") {
                initialize();
            }
        })

        setTimeout(() => {
            console.log("Inicjalizacja z timeout");
            initialize();
        }, 500);
    }
}

const initialize = () => {
    if (initialized) return;
    initialized = true;

    console.log("Inicjalizacja rozpoczęta");

    setTimeout(() => {
        checkBlockedTab().catch(err => {
            console.log("Błąd podczas sprawdzania blokady: ", err);
        });
    }, 50);
}

async function checkBlockedTab() {
    const tabResult = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'get-current-tab' }, resolve)
    });

    console.log(tabResult.url);

    const hostname = new URL(tabResult.url).hostname;
    let domain;
    if(hostname.split('.')[0] == "www") {
        domain = hostname.split('.')[1];
    }
    else {
        domain = hostname.split('.')[0];
    }
    console.log(hostname);
    console.log(domain);

    let result = await new Promise( resolve => 
        chrome.storage.local.get("list", resolve)
    );
    list = result.list || [];

    const found = list.find( element => element.domain === domain);

    console.log(found);
    
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
            color: #8779FF;
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
        #blocker_button {
            margin-top: 64px;
            font-size: 24px;
            background-color: #fff;
            color: #949494;
            border: 1px solid #949494;
            width: 300px;
            padding: 8px;
            border-radius: 4px;
        }
        #blocker_button:hover {
            opacity: 0.8;
        }
        #blocker_button:active {
            opacity: 0.6;
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
                        <button id="blocker_button">Wejdź</button>
                    </div>
                    `
    const blockerDiv = document.createElement("div");
    blockerDiv.id = `blocker_container`;
    blockerDiv.innerHTML = `<h1 id="blocker_title">Zablokowana domena:</h1>
                            <h1 id="blocker_domain">${domain}</h1>
                            <h2 id="blocker_amount"><span id="blocker_span">Ilość wejść:</span> ${found.visitCount}/${found.amount}</h2>

                            <h3 id="blocker_brake">Przerwa:</h3>
                            <h2 id="blocker_timerContainer"><span id="blocker_timer">${found.breakSpan}</span>s</h2>
                            <button id="blocker_button">Wejdź</button>`

    document.body.appendChild(blockerDiv);
    console.log("Element blokady dodany do DOM");

    const timer = document.getElementById("blocker_timer");
    await awaitForTimer(timer);
    
    document.getElementById("blocker_button").style =   `margin-top: 64px;
                                                        font-size: 24px;
                                                        background-color: #8779FF;
                                                        color: #fff;
                                                        border: none;
                                                        border-radius: 4px;
                                                        width: 300px;
                                                        padding: 8px;
                                                        transition: opacity 0.2s;`

    document.getElementById("blocker_button").addEventListener("click", () => {
        list = list.map(element => {
            if (element.id === found.id) {
                element.visitCount++;
            }
            return element;
        });

        chrome.storage.local.set({ list }, () => {
            console.log("Zaktualizowano visitCount w obiekcie");
            document.getElementById("blocker_container").style.display = "none";
        })
    })

    return true;
}

const awaitForTimer = (timer) => {
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            timer.innerHTML = timer.innerHTML - 1;
            if(timer.innerHTML == 0) {
                clearInterval(intervalId);
                resolve();
            }
        }, 1000);
    })
}

(() => {
    console.log("Skrypt uruchomiony - DOM załadowany");
    tryInitialize();
})();