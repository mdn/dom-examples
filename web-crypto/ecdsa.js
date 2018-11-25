(function() {

  let signature;

  function getMessageEncoding() {
    const messageBox = document.querySelector(".ecdsa #message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  async function signMessage(privateKey) {
    const signatureValue = document.querySelector(".ecdsa .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: {name: "SHA-384"},
      },
      privateKey,
      encoded
    );

    let buffer = new Uint8Array(signature, 0, 10);
    signatureValue.textContent = buffer;
  }

  async function verifyMessage(publicKey) {
    const signatureValue = document.querySelector(".ecdsa .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

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

    if (result) {
      signatureValue.classList.add("valid");
    } else {
      signatureValue.classList.add("invalid");
    }
  }

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
