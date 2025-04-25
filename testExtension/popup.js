// await chrome.storage.local.ste({ "list": ["x.com", "youtube.com"] });
let list = [];
chrome.storage.local.get("list").then(async result => {
    // Pobiera liste stron do wyświetlenia jako zablokowane -> jeśli jest pusta to pusta, jak nie jest pusta to nie jest pusta
    list = result.list || [];
    console.log(result.list);
    renderList();
});

document.getElementById("input").addEventListener("keydown", async (e) => {
    if(e.key === "Enter") {
        let domainName = document.getElementById("input").value;
        if(!list.includes(domainName)) {
            console.log(list);
            list.push(domainName);
            console.log(list);
            saveToStorage();
            renderList();
        }
        document.getElementById("input").value = "";
    }
})

document.getElementById("ul").addEventListener("click", async (e) => {
    if(e.target.closest(".bin")) {
        // mapuje tablice list i usuwa z niej element zgadzający się z keyem oraz renderuje liste
        console.log(e.target.closest(".bin").dataset.domain);
        const domainToRemove = e.target.closest(".bin").dataset.domain;
        list = list.filter((element) => element !== domainToRemove )
        console.log(list);
        saveToStorage();
        renderList();
    }
});

const saveToStorage = async () => {
    await chrome.storage.local.set({ "list": list });
}

const renderList = () => {
    const string = list.map((domainName) => {
        return `<li><div><p>${domainName}</p><button class='bin' data-domain="${domainName}"><img src='icons/bin.png' alt='delete_button'></button></div></li>`;
    })
    document.getElementById("ul").innerHTML = string;
}

// Początek programu - Pobiera liste stron do zablokowaniu z chrome storage - jeśli nie istnieje to przypisuje pustą tablicę
// Submit inputa - Sprawdza czy to enter, następnie pobiera wartość z inputa i dodaje ją do tablicy - jeśli takiej wartości już w niej nie ma - następnie zapisuje tablicę do chrome storage, następnie generuje nowego stringa z tablicy używając funckji .map i tworząc string, następnie przypisuje liście innerHTML w postaci tego stringa oraz resetuje wartość inptua do ""
// Kliknięcie bina - Usuwa z tablicy element, który pasuje do tego przypisanego w keyu elementu, następnie program od nowa przechodzi przez tworzenie stringa i przypisywanie innerHTML listy jako ten string