(() => {

    const jwkEcKey = {
      "crv": "P-384",
      "d": "wouCtU7Nw4E8_7n5C1-xBjB4xqSb_liZhYMsy8MGgxUny6Q8NCoH9xSiviwLFfK_",
      "ext": true,
      "key_ops": ["sign"],
      "kty": "EC",
      "x": "SzrRXmyI8VWFJg1dPUNbFcc9jZvjZEfH7ulKI1UkXAltd7RGWrcfFxqyGPcwu6AQ",
      "y": "hHUag3OvDzEr0uUQND4PXHQTXP5IDGdYhJhL-WLKjnGjQAw0rNGy5V29-aV-yseW"
    };

    /*
    The unwrapped signing key.
    */
    let signingKey;

    const signButton = document.querySelector(".jwk .sign-button");

    /*
    Import a JSON Web Key format EC private key, to use for ECDSA signing.
    Takes a string containing the JSON Web Key, and returns a Promise
    that will resolve to a CryptoKey representing the private key.
    */
    function importPrivateKey(jwk) {
      return window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "ECDSA",
          namedCurve: "P-384"
        },
        true,
        ["sign"]
      );
    }

    /*
    Fetch the contents of the "message" textbox, and encode it
    in a form we can use for the sign operation.
    */
    function getMessageEncoding() {
      const messageBox = document.querySelector("#jwk-message");
      const message = messageBox.value;
      const enc = new TextEncoder();
      return enc.encode(message);
    }

    /*
    Get the encoded message-to-sign, sign it and display a representation
    of the first part of it in the "signature" element.
    */
    async function signMessage() {
      const encoded = getMessageEncoding();
      const signature = await window.crypto.subtle.sign(
        {
          name: "ECDSA",
          hash: "SHA-512"
        },
        signingKey,
        encoded
      );

      const signatureValue = document.querySelector(".jwk .signature-value");
      signatureValue.classList.add('fade-in');
      signatureValue.addEventListener('animationend', () => {
        signatureValue.classList.remove('fade-in');
      }, { once: true });
      const buffer = new Uint8Array(signature, 0, 5);
      signatureValue.textContent = `${buffer}...[${signature.byteLength} bytes total]`;
    }

    /*
    Show and enable the sign button.
    */
    function enableSignButton() {
      signButton.classList.add('fade-in');
      signButton.addEventListener('animationend', () => {
        signButton.classList.remove('fade-in');
      }, { once: true });
      signButton.removeAttribute("disabled");
      signButton.classList.remove("hidden");
    }

    /*
    When the user clicks "Import Key"
    - import the key
    - enable the "Sign" button
    */
    const importKeyButton = document.querySelector(".jwk .import-key-button");
    importKeyButton.addEventListener("click", async () => {
      signingKey = await importPrivateKey(jwkEcKey);
      enableSignButton();
    });

    signButton.addEventListener("click", signMessage);

})();
