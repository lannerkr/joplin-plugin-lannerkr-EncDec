// const XORCipher = {
//   encode(key: string, plaintext: string) {
//     const bin = xor_encrypt(key, plaintext);
//     const hex = Array.from(bin, (b) => b.toString(16).padStart(2, '0')).join('');
//     return hex;
//   },

//   decode(key: string, hexString: string) {
//     const hexes = hexString.match(/.{2}/g) as string[];
//     const bin = Uint8Array.from(hexes, (byte) => parseInt(byte, 16));
//     return xor_decrypt(key, bin);
//   },
// };

// function keyCharAt(key: string, i: number) {
//   return key.charCodeAt(Math.floor(i % key.length));
// }

// function xor_encrypt(key: string, plaintext: string) {
//   const bin = new Uint8Array(plaintext.length);
//   for (let i = 0; i < plaintext.length; i++) {
//     bin[i] = plaintext.charCodeAt(i) ^ keyCharAt(key, i);
//   }
//   return bin;
// }

// function xor_decrypt(key: string, bin: Uint8Array) {
//   return Array.from(bin, (c, i) => String.fromCharCode(c ^ keyCharAt(key, i))).join('');
// }

// const encoded = XORCipher.encode('the lost key', 'Dep Trai Co Gi Sai');
// console.log('Encoded:', encoded);
// console.log(XORCipher.decode('the lost key', encoded));