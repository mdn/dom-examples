(() => {

  const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy3Xo3U13dc+xojwQYWoJLCbOQ5fOVY8LlnqcJm1W1BFtxIhOAJWohiHuIRMctv7dzx47TLlmARSKvTRjd0dF92jx/xY20Lz+DXp8YL5yUWAFgA3XkO3LSJgEOex10NB8jfkmgSb7QIudTVvbbUDfd5fwIBmCtaCwWx7NyeWWDb7A9cFxj7EjRdrDaK3ux/ToMLHFXVLqSL341TkCf4ZQoz96RFPUGPPLOfvN0x66CM1PQCkdhzjE6U5XGE964ZkkYUPPsy6Dcie4obhW4vDjgUmLzv0z7UD010RLIneUgDE2FqBfY/C+uWigNPBPkkQ+Bv/UigS6dHqTCVeD5wgyBQIDAQAB
-----END PUBLIC KEY-----`;

  /*
  The unwrapped signing key.
  */
  let encryptionKey;

  const encryptButton = document.querySelector(".spki .encrypt-button");

  /*
  Convert a string into an ArrayBuffer
  from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  */
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  /*
  Import a PEM encoded RSA public key, to use for RSA-OAEP encryption.
  Takes a string containing the PEM encoded key, and returns a Promise
  that will resolve to a CryptoKey representing the public key.
  */
  function importPublicKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
  }

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#spki-message");
    const message = messageBox.value;
    const enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
  async function encryptMessage() {
    const encoded = getMessageEncoding();
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      encryptionKey,
      encoded
    );

    const buffer = new Uint8Array(ciphertext, 0, 5);
    const ciphertextValue = document.querySelector(".spki .ciphertext-value");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    });
    ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
  }

  /*
  Show and enable the encrypt button.
  */
  function enableEncryptButton() {
    encryptButton.classList.add('fade-in');
    encryptButton.addEventListener('animationend', () => {
      encryptButton.classList.remove('fade-in');
    });
    encryptButton.removeAttribute("disabled");
    encryptButton.classList.remove("hidden");
  }

  /*
  When the user clicks "Import Key"
  - import the key
  - enable the "Encrypt" button
  */
  const importKeyButton = document.querySelector(".spki .import-key-button");
  importKeyButton.addEventListener("click", async () => {
    encryptionKey = await importPublicKey(pemEncodedKey);
    enableEncryptButton();
  });

  encryptButton.addEventListener("click", encryptMessage);

})();
