const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { encrypt, decrypt } = require('./utils/crypto');
require('dotenv').config();

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'superSecureSecretKey123!',
  resave: false,
  saveUninitialized: true
}));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#Aloku0412',
  database: 'ehr'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database "ehr"');
});

// SIGNUP
app.post('/signup', async (req, res) => {
  const { name, email, password, role, speciality, License_Number } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const encryptedName = encrypt(name);
    const encryptedEmail = encrypt(email);
    const encryptedSpeciality = encrypt(speciality || '');
    const encryptedLicense = encrypt(License_Number || '');

    if (role === 'doctor') {
      const query = `
        INSERT INTO doctor (name_content, name_iv, email_content, email_iv, password, speciality_content, speciality_iv, license_content, license_iv)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(query, [
        encryptedName.content, encryptedName.iv,
        encryptedEmail.content, encryptedEmail.iv,
        hash,
        encryptedSpeciality.content, encryptedSpeciality.iv,
        encryptedLicense.content, encryptedLicense.iv
      ], (err) => {
        if (err) {
          console.error('❌ Doctor signup error:', err.sqlMessage);
          return res.status(500).send('Signup failed. Email may already exist.');
        }
        console.log('✅ Doctor registered:', email);
        return res.status(200).send('Doctor signup successful');
      });
    } else if (role === 'patient') {
      const query = `
        INSERT INTO patient (name_content, name_iv, email_content, email_iv, password)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(query, [
        encryptedName.content, encryptedName.iv,
        encryptedEmail.content, encryptedEmail.iv,
        hash
      ], (err) => {
        if (err) {
          console.error('❌ Patient signup error:', err.sqlMessage);
          return res.status(500).send('Signup failed. Email may already exist.');
        }
        console.log('✅ Patient registered:', email);
        return res.status(200).send('Patient signup successful');
      });
    } else {
      return res.status(400).send("Invalid role");
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).send('Internal server error');
  }
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).send('Missing login credentials');
  }

  const table = role === 'doctor' ? 'doctor' : 'patient';
  db.query(`SELECT * FROM ${table}`, async (err, results) => {
    if (err) {
      console.error('❌ Login query error:', err.sqlMessage);
      return res.status(500).send('Login error');
    }

    for (const user of results) {
      const decryptedEmail = decrypt({ content: user.email_content, iv: user.email_iv });
      if (decryptedEmail === email) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const decryptedName = decrypt({ content: user.name_content, iv: user.name_iv });
          req.session.user = {
            id: user.id,
            name: decryptedName,
            email: decryptedEmail,
            role
          };
          console.log(`✅ ${role} logged in: ${email}`);
          return res.redirect(role === 'doctor' ? '/doctorDashboard.html' : '/patientDashboard.html');
        }
      }
    }
    return res.status(401).send('Invalid credentials');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
