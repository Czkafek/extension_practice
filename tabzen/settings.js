/*let list = [{
    domain: "youtube",
    mode: "całkowity",
    amount: "brak",
    enterSpan: "brak",
    breakSpan: "brak"
},{
    domain: "instagram",
    mode: "przepustka",
    amount: "10",
    enterSpan: "10",
    breakSpan: "10"
}]*/
let list = [];

async function init() {

    const listResult = await new Promise(resolve => 
        chrome.storage.local.get("list", resolve)
    );
    list = listResult.list || [];

    let string = `<div class="line"><p>Domena</p><p>Tryb zablokowania</p><p>ilość wejść</p><p>Długość wejścia</p><p>Długość przerwy</p></div><div id="hr"></div>`

    list.forEach(element => {
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
        /*string += `<div class="line">
                        <input type="text" value="${element.domain}">
                        <select id="tryb">
                            ${select}
                        </select>
                        <input type="text" ${isDisabled} value="${element.amount}">
                        <input type="text" ${isDisabled} value="${element.enterSpan}">
                        <input type="text" ${isDisabled} value="${element.breakSpan}">
                        <div id="img"><img src="icons/trash.svg" alt=""></div>
                    </div>`;*/
        string += `<div class="line"> 
                        <input type="text" value="${element.domain}">
                        <select class="tryb">
                            ${select}
                        </select>
                        <input type="${type}" ${isDisabled} value="${element.amount}">
                        <div class="field"> 
                            <input type="${type}" ${isDisabled} value="${element.enterSpan}">
                            <p>minut</p>
                        </div>
                        <div class="field">
                            <input type="${type}" ${isDisabled} value="${element.breakSpan}">
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
                amount: "10",
                enterSpan: "10",
                breakSpan: "10"
            })
            chrome.storage.local.set({ list }, () => {
                console.log("Dodano i zapisano nową domenę");
                init();
            });
        }
    });

    document.querySelectorAll(".img").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const key = e.currentTarget.dataset.key;
            list = list.filter( element => element.id != key );
            console.log()
            chrome.storage.local.set({ list }, () => {
                console.log("Usunięto i zapisano listę domen");
                init();
            })
        });
    });

    document.querySelectorAll(".tryb").forEach(element => {
        element.addEventListener("change", e => {
            const container = e.target.parentElement;
            const allChildren = container.querySelectorAll("input");
            const trash = container.querySelectorAll(".img");
            if(e.target.value === "całkowity") {
                list = list.map(element => {
                    if(element.id == trash[0].dataset.key) {
                        element = {
                            id: trash[0].dataset.key,
                            domain: allChildren[0].value,
                            mode: "całkowity",
                            amount: "brak",
                            enterSpan: "brak",
                            breakSpan: "brak"
                        }
                    }
                    return element;
                })
            } else {
                list = list.map(element => {
                    if(element.id == trash[0].dataset.key) {
                        element = {
                            id: trash[0].dataset.key,
                            domain: allChildren[0].value,
                            mode: "przepustka",
                            amount: "10",
                            enterSpan: "10",
                            breakSpan: "10"
                        }
                    }
                    return element;
                })
            }
            chrome.storage.local.set({ list }, () => {
                console.log("Zmieniono typ domeny i zapisano listę");
                init();
            })
            /*
            let string;
            if(e.target.value === "całkowity") {
                string =    `<div class="line">
                                    <input type="text" value="${allChildren[0].value}">
                                    <select class="tryb">
                                        <option value="całkowity" selected>całkowity</option>
                                        <option value="przepustka">przepustka</option>
                                    </select>
                                    <input type="text" disabled value="brak">
                                    <div class="field"> 
                                        <input type="text" disabled value="brak">
                                        <p>minut</p>
                                    </div>
                                    <div class="field">
                                        <input type="text" disabled value="brak">
                                        <p>sekund</p>
                                    </div>
                                    <div class="img" data-key="${trash[0].dataset.key}"><img src="icons/trash.svg" alt=""></div>
                                </div>`
            } else {
                console.log("Hej");
                string =    `<div class="line">
                                    <input type="text" value="${allChildren[0].value}">
                                    <select class="tryb">
                                        <option value="całkowity">całkowity</option>
                                        <option value="przepustka" selected>przepustka</option>
                                    </select>
                                    <input type="number" disabled value="10">
                                    <div class="field"> 
                                        <input type="number" disabled value="10">
                                        <p>minut</p>
                                    </div>
                                    <div class="field">
                                        <input type="number" disabled value="10">
                                        <p>sekund</p>
                                    </div>
                                    <div class="img" data-key="${trash[0].dataset.key}"><img src="icons/trash.svg" alt=""></div>
                                </div>`
            }
            container.innerHTML = string;*/
        })
    })
}

init();
