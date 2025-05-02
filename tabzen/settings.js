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
            select = `<option value="całkowity">całkowity</option>
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
                        <select id="tryb">
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
                        <div class="img" data-key="${element.domain}"><img src="icons/trash.svg" alt=""></div>
                    </div>`
    });

    string += `<div class="line">
                    <input id="addDomain" type="text" placeholder="Domena...">
                    <button id="submit">Zatwierdź</button>
                </div>`

    document.getElementById("content").innerHTML = string;

    document.getElementById("submit").addEventListener("click", (e) => {
        const domain = (document.getElementById("addDomain").value);
        console.log(domain);
        if (domain != "") {
            list.push({
                domain: domain,
                mode: "przepustka",
                amount: "10",
                enterSpan: "10",
                breakSpan: "10"
            })
            console.log(list);
            chrome.storage.local.set({ list }, () => {
                console.log("Dodano i zapisano nową domenę");
                init();
            });
        }
    });

    document.querySelectorAll(".img").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const key = e.currentTarget.dataset.key;
            console.log(key);
            list = list.filter( element => element.domain !== key);
            chrome.storage.local.set({ list }, () => {
                console.log("Usunięto i zapisano listę domen");
                init();
            })
        });
    })
}

init();
