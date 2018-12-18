(() => {

  let salt;
  let ciphertext;
  let iv;

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    let message = document.querySelector(".pbkdf2 #message").value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get some key material to use as input to the deriveKey method.
  The key material is a password supplied by the user.
  */
  function getKeyMaterial() {
    let password = window.prompt("Enter your password");
    let enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw", 
      enc.encode(password), 
      {name: "PBKDF2"}, 
      false, 
      ["deriveBits", "deriveKey"]
    );
  }

  /*
  Given some key material and some random salt
  derive an AES-GCM key using PBKDF2.
  */
  function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey(
      {
        "name": "PBKDF2",
        salt: salt, 
        "iterations": 100000,
        "hash": "SHA-256"
      },
      keyMaterial,
      { "name": "AES-GCM", "length": 256},
      true,
      [ "encrypt", "decrypt" ]
    );
  }

  /*
  Derive a key from a password supplied by the user, and use the key
  to encrypt the message.
  Update the "ciphertextValue" box with a representation of part of
  the ciphertext.
  */
  async function encrypt() {
    const ciphertextValue = document.querySelector(".pbkdf2 .ciphertext-value");
    ciphertextValue.textContent = "";
    const decryptedValue = document.querySelector(".pbkdf2 .decrypted-value");
    decryptedValue.textContent = "";

    let keyMaterial = await getKeyMaterial();
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    let key = await getKey(keyMaterial, salt);
    iv = window.crypto.getRandomValues(new Uint8Array(12));
    let encoded = getMessageEncoding();

    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encoded
    );

    let buffer = new Uint8Array(ciphertext, 0, 5);
    ciphertextValue.classList.add("fade-in");
    ciphertextValue.addEventListener("animationend", () => {
      ciphertextValue.classList.remove("fade-in");
    });
    ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
  }

  /*
  Derive a key from a password supplied by the user, and use the key
  to decrypt the ciphertext.
  If the ciphertext was decrypted successfully,
  update the "decryptedValue" box with the decrypted value.
  If there was an error decrypting,
  update the "decryptedValue" box with an error message.
  */
  async function decrypt() {
    const decryptedValue = document.querySelector(".pbkdf2 .decrypted-value");
    decryptedValue.textContent = "";
    decryptedValue.classList.remove("error");

    let keyMaterial = await getKeyMaterial();
    let key = await getKey(keyMaterial, salt);

    try {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        ciphertext
      );

      let dec = new TextDecoder();
      decryptedValue.classList.add("fade-in");
      decryptedValue.addEventListener("animationend", () => {
        decryptedValue.classList.remove("fade-in");
      });
      decryptedValue.textContent = dec.decode(decrypted);
    } catch (e) {
      decryptedValue.classList.add("error");
      decryptedValue.textContent = "*** Decryption error ***";
    }
  }

  const encryptButton = document.querySelector(".pbkdf2 .encrypt-button");
  encryptButton.addEventListener("click", encrypt);

  const decryptButton = document.querySelector(".pbkdf2 .decrypt-button");
  decryptButton.addEventListener("click", decrypt);
})();
