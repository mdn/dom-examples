(() => {

  let salt;

  /*
  Get some key material to use as input to the deriveBits method.
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
  Derive some bits from a password supplied by the user.
  */
  async function getDerivedBits() {
    const keyMaterial = await getKeyMaterial();
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        "name": "PBKDF2",
        salt: salt, 
        "iterations": 100000,
        "hash": "SHA-256"
      },
      keyMaterial,
      256
    );

    const buffer = new Uint8Array(derivedBits, 0, 5);
    const derivedBitsValue = document.querySelector(".pbkdf2 .derived-bits-value");
    derivedBitsValue.classList.add("fade-in");
    derivedBitsValue.addEventListener("animationend", () => {
      derivedBitsValue.classList.remove("fade-in");
    });
    derivedBitsValue.textContent = `${buffer}...[${derivedBits.byteLength} bytes total]`;
  }

  const deriveBitsButton = document.querySelector(".pbkdf2 .derive-bits-button");
  deriveBitsButton.addEventListener("click", () => {
    getDerivedBits();
  });

})();
