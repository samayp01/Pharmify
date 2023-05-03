const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const webpush = require('./modules/push');
const authentication = require('./modules/authentication');
const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 8080;

let app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use(authentication.authenticateRequest);
app.use('/prescriptions', prescriptionRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));