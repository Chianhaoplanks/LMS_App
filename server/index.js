const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5000;
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});