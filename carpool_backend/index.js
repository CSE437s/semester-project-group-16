const express = require('express');

const app = express();

const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;
  res.json({ receivedMessage: message });
});

app.post('/signup', (req, res) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;
    const email = body.email;
    res.json({ receivedMessage: message });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});