(() => {
  let salt;
  let ciphertext;
  let iv;
  let alicesSecretKey;
  let bobsSecretKey;

  /*
    Fetch the contents of the "message" textbox, and encode it
    in a form we can use for the encrypt operation.
    */
  function getMessageEncoding() {
    let message = document.querySelector("#hkdf-message").value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Given some key material and some random salt,
  derive an AES-GCM key using HKDF.
  */
  function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey(
      {
        name: "HKDF",
        salt: salt,
        info: new Uint8Array("Encryption example"),
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  /*
    Encrypt the message using the secret key.
    Update the "ciphertextValue" box with a representation of part of
    the ciphertext.
    */
  async function encrypt(secret) {
    const ciphertextValue = document.querySelector(".hkdf .ciphertext-value");
    ciphertextValue.textContent = "";
    const decryptedValue = document.querySelector(".hkdf .decrypted-value");
    decryptedValue.textContent = "";

    salt = window.crypto.getRandomValues(new Uint8Array(16));
    let key = await getKey(secret, salt);
    iv = window.crypto.getRandomValues(new Uint8Array(12));
    let encoded = getMessageEncoding();

    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
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
    Decrypt the message using the secret key.
    If the ciphertext was decrypted successfully,
    update the "decryptedValue" box with the decrypted value.
    If there was an error decrypting,
    update the "decryptedValue" box with an error message.
    */
  async function decrypt(secret) {
    const decryptedValue = document.querySelector(".hkdf .decrypted-value");
    decryptedValue.textContent = "";
    decryptedValue.classList.remove("error");

    let key = await getKey(secret, salt);

    try {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
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

  /*
    Derive a shared secret, given:
    - our ECDH private key
    - their ECDH public key
    */
  function deriveSharedSecret(privateKey, publicKey) {
    return window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      "HKDF",
      false,
      ["deriveKey"]
    );
  }

  async function agreeSharedSecretKey() {
    // Generate 2 ECDH key pairs: one for Alice and one for Bob
    // In more normal usage, they would generate their key pairs
    // separately and exchange public keys securely
    let alicesKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      false,
      ["deriveKey"]
    );

    let bobsKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      false,
      ["deriveKey"]
    );

    // Alice then generates a secret key using her private key and Bob's public key.
    alicesSecretKey = await deriveSharedSecret(
      alicesKeyPair.privateKey,
      bobsKeyPair.publicKey
    );

    // Bob generates the same secret key using his private key and Alice's public key.
    bobsSecretKey = await deriveSharedSecret(
      bobsKeyPair.privateKey,
      alicesKeyPair.publicKey
    );

    // Alice can then use her copy of the secret key to encrypt a message to Bob.
    let encryptButton = document.querySelector(".hkdf .encrypt-button");
    encryptButton.addEventListener("click", () => {
      encrypt(alicesSecretKey);
    });

    // Bob can use his copy to decrypt the message.
    let decryptButton = document.querySelector(".hkdf .decrypt-button");
    decryptButton.addEventListener("click", () => {
      decrypt(bobsSecretKey);
    });
  }

  agreeSharedSecretKey();
})();
