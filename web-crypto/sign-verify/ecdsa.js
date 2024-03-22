(() => {

  /*
  Store the calculated signature here, so we can verify it later.
  */
  let signature;

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for sign operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#ecdsa-message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message-to-sign, sign it and display a representation
  of the first part of it in the "signature" element.
  */
  async function signMessage(privateKey) {
    const signatureValue = document.querySelector(".ecdsa .signature-value");
    signatureValue.classList.remove("valid", "invalid");

    let encoded = getMessageEncoding();
    signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: {name: "SHA-384"},
      },
      privateKey,
      encoded
    );

    signatureValue.classList.add('fade-in');
    signatureValue.addEventListener('animationend', () => {
      signatureValue.classList.remove('fade-in');
    }, { once: true });
    let buffer = new Uint8Array(signature, 0, 5);
    signatureValue.textContent = `${buffer}...[${signature.byteLength} bytes total]`;
  }

  /*
  Fetch the encoded message-to-sign and verify it against the stored signature.
  * If it checks out, set the "valid" class on the signature.
  * Otherwise set the "invalid" class.
  */
  async function verifyMessage(publicKey) {
    const signatureValue = document.querySelector(".ecdsa .signature-value");
    signatureValue.classList.remove("valid", "invalid");

    let encoded = getMessageEncoding();
    let result = await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: {name: "SHA-384"},
      },
      publicKey,
      signature,
      encoded
    );

    signatureValue.classList.add(result ? "valid" : "invalid");
  }

  /*
  Generate a sign/verify key, then set up event listeners
  on the "Sign" and "Verify" buttons.
  */
  window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384"
    },
    true,
    ["sign", "verify"]
  ).then((keyPair) => {
    const signButton = document.querySelector(".ecdsa .sign-button");
    signButton.addEventListener("click", () => {
      signMessage(keyPair.privateKey);
    });

    const verifyButton = document.querySelector(".ecdsa .verify-button");
    verifyButton.addEventListener("click", () => {
      verifyMessage(keyPair.publicKey);
    });
  });

})();
