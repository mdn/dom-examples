(() => {

  let salt;
  let iv;

  /*
  Get some key material to use as input to the deriveKey method.
  The key material is a password supplied by the user.
  */
  function getKeyMaterial() {
    const password = window.prompt("Enter your password");
    const enc = new TextEncoder();
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
  derive an AES-CBC key using PBKDF2.
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
      { "name": "AES-CBC", "length": 256},
      true,
      [ "wrapKey", "unwrapKey" ]
    );
  }

  /*
  Wrap the given key and write it into the "wrapped-key" space.
  */
  async function wrapCryptoKey(keyToWrap) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial();
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await getKey(keyMaterial, salt);
    iv = window.crypto.getRandomValues(new Uint8Array(16));

    const wrapped = await window.crypto.subtle.wrapKey(
      "spki",
      keyToWrap,
      wrappingKey,
      {
        name: "AES-CBC",
        iv: iv
      }
    );

    const wrappedKeyBuffer = new Uint8Array(wrapped);

    const wrappedKeyOutput = document.querySelector(".wrapped-key");
    wrappedKeyOutput.classList.add("fade-in");
    wrappedKeyOutput.addEventListener("animationend", () => {
      wrappedKeyOutput.classList.remove("fade-in");
    }, { once: true });
    wrappedKeyOutput.textContent = `[${wrappedKeyBuffer}]`;
  }

  /*
  Generate an encrypt/decrypt key pair,
  then set up an event listener on the "Wrap" button.
  */
  window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  ).then((keyPair) => {
    const wrapButton = document.querySelector(".spki");
    wrapButton.addEventListener("click", () => {
      wrapCryptoKey(keyPair.publicKey);
    });
  });

})();
