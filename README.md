# Joplin Plugin EnC/DeC Mode

- encode and decode sensitive string with user password.
- it's not secure encryption, it's just XOR encoding/decoding to hide sesitive strings to be displayed
- 
// XORCipher - Super simple encryption using XOR and Base64 (https://gist.github.com/sukima/XORCipher.js)
//
// Depends on [Underscore](http://underscorejs.org/).
//
// As a warning, this is **not** a secure encryption algorythm. It uses a very
// simplistic keystore and will be easy to crack.
//
// The Base64 algorythm is a modification of the one used in phpjs.org
// * http://phpjs.org/functions/base64_encode/
// * http://phpjs.org/functions/base64_decode/


1. Encoding :

- Select strings want to be encoded, then click EnC/Dec button.
- Popup will ask you a password.
- Enter password and click 'OK', then your selected strings will be encoded and displayed as 'ENC:xxxxxxxxxx'.


2. Decoding :

- Select encoded strings ( selecting must include 'ENC:' ), then click EnC/Dec button.
- Popup will ask you a password.
- 
    -> Enter password and click 'OK', then decoded strings will be displayed in popup.
    -> Enter password and click 'Permanent', then selected strings will be decoded.

