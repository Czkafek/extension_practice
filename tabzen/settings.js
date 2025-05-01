let list = [{
    domain: "youtube",
    mode: "całkowity",
    amount: "brak",
    enterSpan: "brak",
    breakSpan: "brak"
},{
    domain: "instagram",
    mode: "przepustka",
    amount: "10",
    enterSpan: "10 minut",
    breakSpan: "10 sekund"
}]

async function init() {
    /*const listResult = await new Promise(chrome.storage.local.get("list", result));
    const list = listResult.list || [];*/

    let string = `<div class="line"><p>Domena</p><p>Tryb zablokowania</p><p>ilość wejść</p><p>Długość wejścia</p><p>Długość przerwy</p></div><div id="hr"></div>`

    list.forEach(element => {
        let select, isDisabled;
        if(element.mode === 'całkowity') {
            select = `<option value="całkowity" selected>całkowity</option>
                            <option value="przepustka">przepustka</option>`
            isDisabled = "disabled"
        }
        else {
            select = `<option value="całkowity">całkowity</option>
                            <option value="przepustka" selected>przepustka</option>`
            isDisabled = ""
        }
        string += `<div class="line">
                        <input type="text" value="${element.domain}">
                        <select id="tryb">
                            ${select}
                        </select>
                        <input type="text" ${isDisabled} value="${element.amount}">
                        <input type="text" ${isDisabled} value="${element.enterSpan}">
                        <input type="text" ${isDisabled} value="${element.breakSpan}">
                        <div id="img"><img src="icons/trash.svg" alt=""></div>
                    </div>`;
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
                enterSpan: "10 minut",
                breakSpan: "10 sekund"
            })
            console.log(list);
            init();
        }
    })
}

init();
