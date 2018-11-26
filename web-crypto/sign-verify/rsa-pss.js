(function() {

  let signature;

  function getMessageEncoding() {
    const messageBox = document.querySelector(".rsa-pss #message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  async function signMessage(privateKey) {
    const signatureValue = document.querySelector(".rsa-pss .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    signature = await window.crypto.subtle.sign(
      {
        name: "RSA-PSS",
        saltLength: 128,
      },
      privateKey,
      encoded
    );

    let buffer = new Uint8Array(signature, 0, 10);
    signatureValue.textContent = buffer;
  }

  async function verifyMessage(publicKey) {
    const signatureValue = document.querySelector(".rsa-pss .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    let result = await window.crypto.subtle.verify(
      {
        name: "RSA-PSS",
        saltLength: 128,
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
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  ).then((keyPair) => {
    const signButton = document.querySelector(".rsa-pss .sign-button");
    signButton.addEventListener("click", () => {
      signMessage(keyPair.privateKey);
    });

    const verifyButton = document.querySelector(".rsa-pss .verify-button");
    verifyButton.addEventListener("click", () => {
      verifyMessage(keyPair.publicKey);
    });
  });

})();
