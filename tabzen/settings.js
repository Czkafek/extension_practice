let list = [];

async function init() {

    const listResult = await new Promise(resolve => 
        chrome.storage.local.get("list", resolve)
    );
    list = listResult.list || [];

    let string = `<div class="line"><p>Domena</p><p>Tryb zablokowania</p><p>ilość wejść</p><p>Długość wejścia</p><p>Długość przerwy</p></div><div id="hr"></div>`

    list.forEach(element => {
        console.log(element);
        let select, isDisabled;
        if(element.mode === 'całkowity') {
            select = `<option value="całkowity" selected>całkowity</option>
                            <option value="przepustka">przepustka</option>`;
            isDisabled = "disabled";
            type = "text";
        }
        else {
            select =    `<option value="całkowity">całkowity</option>
                        <option value="przepustka" selected>przepustka</option>`;
            isDisabled = "";
            type = "number";
        }
        string += `<div class="line"> 
                        <input class="domainInput" data-key="${element.id}" type="text" value="${element.domain}">
                        <select class="tryb">
                            ${select}
                        </select>
                        <input class="input" data-key="${element.id}" data-name="amount" type="${type}" ${isDisabled} value="${element.amount}">
                        <div class="field"> 
                            <input class="input" data-key="${element.id}" data-name="enterSpan" type="${type}" ${isDisabled} value="${element.enterSpan}">
                            <p>minut</p>
                        </div>
                        <div class="field">
                            <input class="input" data-key="${element.id}" data-name="breakSpan" type="${type}" ${isDisabled} value="${element.breakSpan}">
                            <p>sekund</p>
                        </div>
                        <div class="img" data-key="${element.id}"><img src="icons/trash.svg" alt=""></div>
                    </div>`
    });

    string += `<div class="line">
                    <input id="addDomain" type="text" placeholder="Domena...">
                    <button id="submit">Zatwierdź</button>
                </div>`

    document.getElementById("content").innerHTML = string;

    document.getElementById("submit").addEventListener("click", (e) => {
        const domain = (document.getElementById("addDomain").value);
        if (domain != "") {
            const newId = Date.now();
            list.push({
                id: newId,
                domain: domain,
                mode: "przepustka",
                amount: 10,
                enterSpan: 10,
                breakSpan: 10,
                lastSave: getCurrentDay(new Date()),
                visitCount: 0
            })
            saveList("Dodano i zapisano nową domenę");
        }
    });

    document.querySelectorAll(".img").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const key = e.currentTarget.dataset.key;
            list = list.filter( element => element.id != key );
            console.log("yeah");
            saveList("Usunięto i zapisano listę domen");
        });
    });

    document.querySelectorAll(".tryb").forEach(element => {
        element.addEventListener("change", e => {
            const container = e.target.parentElement;
            const trash = container.querySelectorAll(".img");
            if(e.target.value === "całkowity") {
                list = list.map(element => {
                    if(element.id == trash[0].dataset.key) {
                        element.mode = "całkowity";
                        element.amount = "brak";
                        element.enterSpan = "brak";
                        element.breakSpan = "brak";
                        element.lastSave = getCurrentDay(new Date());
                    }
                    return element;
                })
            } else {
                list = list.map(element => {
                    if(element.id == trash[0].dataset.key) {
                        element.mode = "przepustka";
                        element.amount = 10;
                        element.enterSpan = 10;
                        element.breakSpan = 10;
                        element.lastSave = getCurrentDay(new Date());
                    }
                    return element;
                })
            }
            saveList("Zmieniono typ domeny i zapisano listę");
        })
    })

    // Jeszcze eventlistener inputów (2 funkcje)
    document.querySelectorAll(".line .input").forEach(input => {
        input.addEventListener("focusout", (e) => {
            
            list = list.map(element => {
                if(element.id == e.target.dataset.key) {
                    element[e.target.dataset.name] = e.target.value;
                }
                return element;
            });
            saveList("Pola zostały zaktualizowane i zapisano listę");
        })
    })

    document.querySelectorAll(".line .domainInput").forEach(input => {
        input.addEventListener("focusout", (e) => {
            list = list.map(element => {
                if(element.id == e.target.dataset.key) {
                    element.domain = e.target.value;
                }
                return element;
            })
            saveList("Nazwa domeny została zaktualizowana i zapisano listę");
        })
    })
}

const saveList = (message) => {
    chrome.storage.local.set({ list }, () => {
        console.log(message);
        init();
    })
}

const getCurrentDay = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return new Date(year, month, day, 0, 0, 0, 0);
}

init();