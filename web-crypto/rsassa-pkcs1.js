(function() {

  let signature;

  function getMessageEncoding() {
    const messageBox = document.querySelector(".rsassa-pkcs1 #message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  async function signMessage(privateKey) {
    const signatureValue = document.querySelector(".rsassa-pkcs1 .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    signature = await window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      encoded
    );

    let buffer = new Uint8Array(signature, 0, 10);
    signatureValue.textContent = buffer;
  }

  async function verifyMessage(publicKey) {
    const signatureValue = document.querySelector(".rsassa-pkcs1 .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    let result = await window.crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
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

  generateSignVerifyKey = window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  ).then((keyPair) => {
    const signButton = document.querySelector(".rsassa-pkcs1 .sign-button");
    signButton.addEventListener("click", () => {
      signMessage(keyPair.privateKey);
    });

    const verifyButton = document.querySelector(".rsassa-pkcs1 .verify-button");
    verifyButton.addEventListener("click", () => {
      verifyMessage(keyPair.publicKey);
    });
  });

})();
