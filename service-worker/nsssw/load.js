let buttons, id, idx, img;
document.addEventListener("DOMContentLoaded", contentLoaded, false);
async function contentLoaded() {
    let count, dir;
    id = document.documentElement.id;
    if (id) {
        let clone, i;
        dir = "../";
        switch (id) {
            case "Beerenberg":
                count = 5;
                break;
            case "Erebus":
                count = 6;
                break;
        }
        const h1 = document.getElementsByTagName("h1")[0];
        h1.textContent = id;

        const btn = document.getElementsByTagName("button")[0];
        const div = btn.parentNode;
        btn.addEventListener("click", clickIt, false);
        btn.style.height = getComputedStyle(btn).width;
        buttons = [btn];
        for (i = 1; i < count; i++) {
            clone = btn.cloneNode();
            clone.textContent = i;
            clone.addEventListener("click", clickIt, false);
            div.appendChild(clone);
            buttons.push(clone);
        }
        img = document.getElementsByTagName("img")[0];
        idx = 0;
        buttons[idx].disabled = true;

        const margin = parseFloat(getComputedStyle(document.body).marginTop);
        const offset = div.offsetHeight + (margin * 2) ;
        img.parentNode.style.height = `calc(100vh - ${offset}px)`;
    }
    else
        dir = "";

    // Service worker runs in a separate thread after the page displays
    // postMessage() adds document-specific files to the cache
    navigator.serviceWorker.register(`${dir}sw.js`).then (reg => {
        const sw = reg.installing ?? reg.waiting ?? reg.active;
        if (sw) // wait until activated
            if (reg.active)
                sw.postMessage({id, count});
        else
            sw.addEventListener("statechange", (evt) => {
                console.log("state:", evt.target.state);
                if (evt.target.state == "activated")
                    sw.postMessage({id, count});
            });
    }).catch(err => console.error(err.stack ?? err));
}
function clickIt(evt) {
    const n = evt.target.textContent;
    img.src = `${id}${n}.jpg`;
    buttons[idx].disabled = false;
    idx = Number(n);
    buttons[idx].disabled = true;
}