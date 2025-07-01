const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const imageData = req.body.image;
    const imagePath = path.join(process.cwd(), 'uploads', `image_${Date.now()}.png`);

    // Save image to server
    fs.writeFileSync(imagePath, imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    res.status(200).json({ message: 'Image uploaded successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
