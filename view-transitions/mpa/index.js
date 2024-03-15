console.log("script loaded");

window.addEventListener("pageswap", event => {
    console.log("pageswap fired");
    // event.viewTransition.skipTransition();
});


window.addEventListener("pagereveal", event => {
    console.log("pagereveal fired");
    // event.viewTransition.skipTransition();
});

