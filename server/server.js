const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'submissions.csv');

app.use(cors());
app.use(express.json());

// Initialize CSV file with headers if it doesn't exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, 'name,email,feedback\n');
}

app.post('/submit', (req, res) => {
  const { name, email, feedback } = req.body;
  const data = `"${name}","${email}","${feedback}"\n`;

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Error saving submission');
    }
    res.send('Submission saved');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});