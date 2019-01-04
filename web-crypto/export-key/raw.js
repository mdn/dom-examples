(() => {

  /*
  Export the given key and write it into the "exported-key" space.
  */
  async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "raw",
      key
    );
    const exportedKeyBuffer = new Uint8Array(exported);

    const exportKeyOutput = document.querySelector(".exported-key");
    exportKeyOutput.classList.add("fade-in");
    exportKeyOutput.addEventListener("animationend", () => {
      exportKeyOutput.classList.remove("fade-in");
    });
    exportKeyOutput.textContent = `[${exportedKeyBuffer}]`;
  }

  /*
  Generate an encrypt/decrypt secret key,
  then set up an event listener on the "Export" button.
  */
  window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  ).then((key) => {
    const exportButton = document.querySelector(".raw");
    exportButton.addEventListener("click", () => {
      exportCryptoKey(key);
    });

  });

})();
