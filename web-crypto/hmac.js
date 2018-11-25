(function() {

  let signature;

  function getMessageEncoding() {
    const messageBox = document.querySelector(".hmac #message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  async function signMessage(key) {
    const signatureValue = document.querySelector(".hmac .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    signature = await window.crypto.subtle.sign(
      "HMAC",
      key,
      encoded
    );

    let buffer = new Uint8Array(signature, 0, 10);
    signatureValue.textContent = buffer;
  }

  async function verifyMessage(key) {
    const signatureValue = document.querySelector(".hmac .signature-value");
    signatureValue.classList.remove("valid");
    signatureValue.classList.remove("invalid");

    let encoded = getMessageEncoding();
    let result = await window.crypto.subtle.verify(
      "HMAC",
      key,
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
      name: "HMAC",
      hash: {name: "SHA-384"}
    },
    true,
    ["sign", "verify"]
  ).then((key) => {
    const signButton = document.querySelector(".hmac .sign-button");
    signButton.addEventListener("click", () => {
      signMessage(key);
    });

    const verifyButton = document.querySelector(".hmac .verify-button");
    verifyButton.addEventListener("click", () => {
      verifyMessage(key);
    });
  });

})();
