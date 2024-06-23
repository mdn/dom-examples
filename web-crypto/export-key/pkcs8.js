(() => {

  /*
  Convert  an ArrayBuffer into a string
  from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  */
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  /*
  Export the given key and write it into the "exported-key" space.
  */
  async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "pkcs8",
      key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;

    const exportKeyOutput = document.querySelector(".exported-key");
    exportKeyOutput.classList.add("fade-in");
    exportKeyOutput.addEventListener("animationend", () => {
      exportKeyOutput.classList.remove("fade-in");
    }, { once: true });
    exportKeyOutput.textContent = pemExported;
  }

  /*
  Generate a sign/verify key pair,
  then set up an event listener on the "Export" button.
  */
  window.crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  ).then((keyPair) => {
    const exportButton = document.querySelector(".pkcs8");
    exportButton.addEventListener("click", () => {
      exportCryptoKey(keyPair.privateKey);
    });

  });

})();
