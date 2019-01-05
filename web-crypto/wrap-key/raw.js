(() => {

  let salt;

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
  derive an AES-KW key using PBKDF2.
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
      { "name": "AES-KW", "length": 256},
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

    const wrapped = await window.crypto.subtle.wrapKey(
      "raw",
      keyToWrap,
      wrappingKey,
      "AES-KW"
    );

    const wrappedKeyBuffer = new Uint8Array(wrapped);

    const wrappedKeyOutput = document.querySelector(".wrapped-key");
    wrappedKeyOutput.classList.add("fade-in");
    wrappedKeyOutput.addEventListener("animationend", () => {
      wrappedKeyOutput.classList.remove("fade-in");
    });
    wrappedKeyOutput.textContent = `[${wrappedKeyBuffer}]`;
  }

  /*
  Generate an encrypt/decrypt secret key,
  then set up an event listener on the "Wrap" button.
  */
  window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  ).then((secretKey) => {
    const wrapButton = document.querySelector(".raw");
    wrapButton.addEventListener("click", () => {
      wrapCryptoKey(secretKey);
    });

  });

})();
