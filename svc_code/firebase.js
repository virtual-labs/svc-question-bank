const {initializeApp,cert}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');




const crypto = require('crypto');

const hashConfig = {
  algorithm: 'SCRYPT',
  base64SignerKey: '6JmlL4JmdgyWa0RtfDCzk8CZ2RjvVg6fjqP+xanxCVf2GmWUUhGPQduYJCOp8AYlYoB75bRneD6JYyTky/CjRQ==',
  base64SaltSeparator: 'Bw==',
  rounds: 8,
  memCost: 14
};

async function verifyPassword(password, hashedPassword) {
  try {
    // Decode the base64 encoded signer key and salt separator
    const signerKey = Buffer.from(hashConfig.base64SignerKey, 'base64');
    const saltSeparator = Buffer.from(hashConfig.base64SaltSeparator, 'base64');

    // Split the hashed password into salt and verifier
    const [salt, verifier] = hashedPassword.split(saltSeparator.toString());

    // Derive the key from the password using the SCRYPT algorithm
    const key = await scrypt(password, salt, hashConfig.rounds, hashConfig.memCost, signerKey);

    // Compare the derived key with the verifier
    return crypto.timingSafeEqual(key, Buffer.from(verifier, 'base64'));
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

async function scrypt(password, salt, rounds, memCost, signerKey) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, { N: 1 << memCost, r: 8, p: 1 }, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const verifier = crypto.createHmac('sha256', signerKey)
          .update(key)
          .digest('base64');
        resolve(Buffer.from(verifier, 'base64'));
      }
    });
  });
}






const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK with your Firebase project credentials
const serviceAccount="./my_firebase.json"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://your-firebase-project.firebaseio.com'
});

// module.exports = admin;





// initializeApp({
//     credential: cert(serviceAccount)
// })

const db=getFirestore()


module.exports={db,admin}