const crypto = require('crypto');
function hashPassword(password) {
  const hash = crypto.createHash('sha256'); // Crea hasher SHA-256 che permette di fare l hash delle password
 hash.update(password);                   // Inserisce la password
  return hash.digest('hex');               // Restituisce hash in formato hex
}

// ================= TEST =================

const password1 = 'prova123';
const password2 = 'prova123';
const password3 = 'prova12';

const hash1 = hashPassword(password1);
const hash2 = hashPassword(password2);
const hash3 = hashPassword(password3);

console.log('Password 1:', password1);
console.log('Hash 1:    ', hash1);
console.log();

console.log('Password 2:', password2);
console.log('Hash 2:    ', hash2);
console.log('Uguali?    ', hash1 === hash2);
console.log();

console.log('Password 3:', password3);
console.log('Hash 3:    ', hash3);
console.log('Diverso?   ', hash1 !== hash3);
