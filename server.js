const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let savedImages = []; // Array to store image data

app.post('/upload-image', (req, res) => {
    const base64Image = req.body.imageData;

    // Remove the prefix from base64 string
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

    const imageName = `image-${Date.now()}.png`;
    const imagePath = path.join(__dirname, 'public', imageName);

    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).send('Error saving image');
        }

        // Add the image path to the array
        savedImages.push(imageName);
        res.send();
        // res.send({ imageName });
    });
});

// Endpoint to get all saved images
app.get('/images', (req, res) => {
    res.send(savedImages);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
