document.getElementById("input").addEventListener("keydown", async (e) => {
    if(e.key === "Enter") {
        let domainName = document.getElementById("input").value;
        await chrome.storage.local.set({ [domainName]: domainName});
        let string = document.getElementById("ul").innerHTML;
        string += `<li><div><p>${domainName}</p><button id='${domainName}'><img src='icons/bin.png' alt='delete_button'></button></div></li>`
        document.getElementById("ul").innerHTML = string;
    }
})