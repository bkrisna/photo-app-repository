const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads')); // Makes the folder public

// 1. Setup Storage: Where and how to save files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. Upload Endpoint
app.post('/upload', upload.single('photo'), (req, res) => {
    res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// 3. Get All Photos Endpoint
app.get('/photos', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) return res.status(500).send("Unable to scan files");
        const fileInfos = files.map(file => ({ url: `http://localhost:5000/uploads/${file}` }));
        res.json(fileInfos);
    });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
