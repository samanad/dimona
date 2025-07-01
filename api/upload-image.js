const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const imageData = req.body.image;

      // Ensure the uploads folder exists
      const uploadsFolder = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder);
      }

      // Save image to the uploads folder
      const imagePath = path.join(uploadsFolder, `image_${Date.now()}.png`);
      fs.writeFileSync(imagePath, imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

      // Save image metadata to JSON file
      const imageMetadataPath = path.join(process.cwd(), 'data', 'images.json');
      const imageMetadata = JSON.parse(fs.existsSync(imageMetadataPath) ? fs.readFileSync(imageMetadataPath, 'utf-8') : '[]');
      imageMetadata.push({
        id: Date.now(),
        path: `/uploads/image_${Date.now()}.png`, // Relative path to the image
        uploadedAt: new Date().toISOString()
      });
      fs.writeFileSync(imageMetadataPath, JSON.stringify(imageMetadata, null, 2));

      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
