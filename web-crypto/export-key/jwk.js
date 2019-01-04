(() => {

  /*
  Export the given key and write it into the "exported-key" space.
  */
  async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "jwk",
      key
    );
    const exportKeyOutput = document.querySelector(".exported-key");
    exportKeyOutput.classList.add("fade-in");
    exportKeyOutput.addEventListener("animationend", () => {
      exportKeyOutput.classList.remove("fade-in");
    });
    exportKeyOutput.textContent = JSON.stringify(exported, null, " ");
  }

  /*
  Generate a sign/verify key pair,
  then set up an event listener on the "Export" button.
  */
  window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384"
    },
    true,
    ["sign", "verify"]
  ).then((keyPair) => {
    const exportButton = document.querySelector(".jwk");
    exportButton.addEventListener("click", () => {
      exportCryptoKey(keyPair.privateKey);
    });

  });

})();
