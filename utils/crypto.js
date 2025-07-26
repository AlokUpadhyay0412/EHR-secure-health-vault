const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET, 'hex');
const ivLength = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    content: encrypted,
    iv: iv.toString('hex')
  };
}

function decrypt({ content, iv }) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
