const express = require('express');
const cors = require('cors');
const challengeRouter = require('./routes/challenge');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/challenge', challengeRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`));
