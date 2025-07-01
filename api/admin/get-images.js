const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const imageMetadataPath = path.join(process.cwd(), 'data', 'images.json');
  const images = JSON.parse(fs.existsSync(imageMetadataPath) ? fs.readFileSync(imageMetadataPath, 'utf-8') : '[]');
  res.status(200).json(images);
};
