(() => {

  async function deriveSharedSecret(privateKey, publicKey) {
    const sharedSecret = await window.crypto.subtle.deriveBits(
      {
        name: "ECDH",
        namedCurve: "P-384",
        public: publicKey
      },
      privateKey,
      128
    );

    const buffer = new Uint8Array(sharedSecret, 0, 5);
    const sharedSecretValue = document.querySelector(".ecdh .derived-bits-value");
    sharedSecretValue.classList.add("fade-in");
    sharedSecretValue.addEventListener("animationend", () => {
      sharedSecretValue.classList.remove("fade-in");
    });
    sharedSecretValue.textContent = `${buffer}...[${sharedSecret.byteLength} bytes total]`;
  }

  // Generate 2 ECDH key pairs: one for Alice and one for Bob
  // In more normal usage, they would generate their key pairs
  // separately and exchange public keys securely
  const generateAlicesKeyPair = window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-384"
    },
    false,
    ["deriveBits"]
  );

  const generateBobsKeyPair = window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-384"
    },
    false,
    ["deriveBits"]
  );

  Promise.all([generateAlicesKeyPair, generateBobsKeyPair]).then(values => {
    const alicesKeyPair = values[0];
    const bobsKeyPair = values[1];

    const deriveBitsButton = document.querySelector(".ecdh .derive-bits-button");
    deriveBitsButton.addEventListener("click", () => {
      // Alice then generates a secret using her private key and Bob's public key.
      // Bob could generate the same secret using his private key and Alice's public key.
      deriveSharedSecret(alicesKeyPair.privateKey, bobsKeyPair.publicKey);
    });
  });

})();
