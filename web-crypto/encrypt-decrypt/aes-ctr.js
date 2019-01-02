(() => {

  /*
  Store the calculated ciphertext and counter here, so we can decrypt it later.
  */
  let ciphertext;
  let counter;

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#aes-ctr-message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
  async function encryptMessage(key) {
    let encoded = getMessageEncoding();
    counter = window.crypto.getRandomValues(new Uint8Array(16)),
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-CTR",
        counter,
        length: 64
      },
      key,
      encoded
    );

    let buffer = new Uint8Array(ciphertext, 0, 5);
    const ciphertextValue = document.querySelector(".aes-ctr .ciphertext-value");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    });
    ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
  }

  /*
  Fetch the encoded message and decrypt it.
  Write the decrypted message into the "Decrypted" box.
  */
  async function decryptMessage(key) {
    let encoded = getMessageEncoding();
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter,
        length: 64
      },
      key,
      ciphertext
    );

    let dec = new TextDecoder();
    const decryptedValue = document.querySelector(".aes-ctr .decrypted-value");
    decryptedValue.classList.add('fade-in');
    decryptedValue.addEventListener('animationend', () => {
      decryptedValue.classList.remove('fade-in');
    });
    decryptedValue.textContent = dec.decode(decrypted);
  }

  /*
  Generate an encryption key, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
  window.crypto.subtle.generateKey(
    {
        name: "AES-CTR",
        length: 256
    },
    true,
    ["encrypt", "decrypt"]
  ).then((key) => {
    const encryptButton = document.querySelector(".aes-ctr .encrypt-button");
    encryptButton.addEventListener("click", () => {
      encryptMessage(key);
    });

    const decryptButton = document.querySelector(".aes-ctr .decrypt-button");
    decryptButton.addEventListener("click", () => {
      decryptMessage(key);
    });
  });

})();
