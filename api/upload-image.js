const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Configure AWS SDK for DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com'); // Replace with your Space's region
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO801LQKFKE9RTQJDXJB', // Replace with your DigitalOcean Spaces Access Key
  secretAccessKey: 'vpxVLUDDDlyjB/iHTHOH9FtG6d72KU8q7mES5LUhG2M', // Replace with your DigitalOcean Spaces Secret Key
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const imageData = req.body.image;
      const imageBuffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

      // Upload image to DigitalOcean Spaces
      const params = {
        Bucket: 'hardy7', // Replace with your Space name
        Key: `uploads/image_${Date.now()}.png`, // File name in the Space
        Body: imageBuffer,
        ContentType: 'image/png',
        ACL: 'public-read', // Make the image publicly accessible
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading image to DigitalOcean Spaces:', err);
          res.status(500).json({ message: 'Error uploading image', error: err.message });
        } else {
          // Save image metadata to JSON file
          const imageMetadataPath = path.join(process.cwd(), 'data', 'images.json');
          const imageMetadata = JSON.parse(fs.existsSync(imageMetadataPath) ? fs.readFileSync(imageMetadataPath, 'utf-8') : '[]');
          imageMetadata.push({
            id: Date.now(),
            path: data.Location, // URL of the uploaded image
            uploadedAt: new Date().toISOString(),
          });
          fs.writeFileSync(imageMetadataPath, JSON.stringify(imageMetadata, null, 2));

          res.status(200).json({ message: 'Image uploaded successfully', url: data.Location });
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
