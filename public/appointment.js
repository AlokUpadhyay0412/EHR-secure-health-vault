// Express setup
const express = require('express');
const router = express.Router();
const db = require('./db'); // Your MySQL connection

// Patient books an appointment
router.post('/book', (req, res) => {
    const { patient_id, doctor_id, date, reason } = req.body;
    const status = 'Pending';
    db.query('INSERT INTO appointments SET ?', {
        patient_id, doctor_id, date, reason, status
    }, (err) => {
        if (err) return res.status(500).send('Database error');
        res.send('Appointment requested');
    });
});

// Doctor views all appointments
router.get('/doctor/:id', (req, res) => {
    db.query('SELECT * FROM appointments WHERE doctor_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Database error');
        res.json(results);
    });
});

// Doctor confirms appointment
router.post('/confirm', (req, res) => {
    const { appointment_id } = req.body;
    db.query('UPDATE appointments SET status = "Confirmed" WHERE id = ?', [appointment_id], (err) => {
        if (err) return res.status(500).send('Database error');
        res.send('Appointment confirmed');
    });
});

module.exports = router;
