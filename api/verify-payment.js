const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { txHash } = req.body;

    // Connect to Binance Smart Chain
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

    try {
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt.status === 1 && tx.to === '0x12E18E0eDE8722d2EEa6163C2Ae4d70b6a82b779') { // Your BSC wallet address
        // Save payment data to JSON file
        const paymentDataPath = path.join(process.cwd(), 'data', 'payments.json');
        const paymentData = JSON.parse(fs.existsSync(paymentDataPath) ? fs.readFileSync(paymentDataPath, 'utf-8') : '[]');
        paymentData.push({
          id: Date.now(),
          txHash: txHash,
          amount: ethers.utils.formatEther(tx.value),
          timestamp: new Date().toISOString()
        });
        fs.writeFileSync(paymentDataPath, JSON.stringify(paymentData, null, 2));

        res.status(200).json({ success: true, message: 'Payment verified!' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error verifying payment.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
