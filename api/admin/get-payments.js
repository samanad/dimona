const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const paymentDataPath = path.join(process.cwd(), 'data', 'payments.json');
  const payments = JSON.parse(fs.existsSync(paymentDataPath) ? fs.readFileSync(paymentDataPath, 'utf-8') : '[]');
  res.status(200).json(payments);
};
