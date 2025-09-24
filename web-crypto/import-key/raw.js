(() => {

  const rawKey = window.crypto.getRandomValues(new Uint8Array(16));

  /*
  The imported secret key.
  */
  let secretKey;

  const encryptButton = document.querySelector(".raw .encrypt-button");

  /*
  Import an AES secret key from an ArrayBuffer containing the raw bytes.
  Takes an ArrayBuffer string containing the bytes, and returns a Promise
  that will resolve to a CryptoKey representing the secret key.
  */
  function importSecretKey(rawKey) {
    return window.crypto.subtle.importKey(
      "raw",
      rawKey,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
  }

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#raw-message");
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
    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      secretKey,
      encoded
    );

    const buffer = new Uint8Array(ciphertext, 0, 5);
    const ciphertextValue = document.querySelector(".raw .ciphertext-value");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    }, { once: true });
    ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
  }

    /*
    Show and enable the encrypt button.
    */
    function enableEncryptButton() {
      encryptButton.classList.add('fade-in');
      encryptButton.addEventListener('animationend', () => {
        encryptButton.classList.remove('fade-in');
      }, { once: true });
      encryptButton.removeAttribute("disabled");
      encryptButton.classList.remove("hidden");
    }

  /*
  When the user clicks "Import Key"
  - import the key
  - enable the "Encrypt" button
  */
  const importKeyButton = document.querySelector(".raw .import-key-button");
  importKeyButton.addEventListener("click", async () => {
    secretKey = await importSecretKey(rawKey);
    enableEncryptButton();
  });

  encryptButton.addEventListener("click", encryptMessage);

})();
