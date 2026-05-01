const { cloudinary } = require('../config/cloudinary');
const crypto = require('crypto');

/**
 * GET /api/media/sign — Admin
 *
 * Returns a short-lived Cloudinary signed upload params object.
 * The frontend uses these to POST a file directly to Cloudinary's
 * upload API — no file bytes ever touch the Vercel serverless function.
 *
 * Signature flow:
 *   1. Backend generates timestamp + signature using CLOUDINARY_API_SECRET
 *   2. Frontend receives { signature, timestamp, apiKey, cloudName, folder }
 *   3. Frontend POSTs the file directly to https://api.cloudinary.com/v1_1/<cloud>/upload
 *   4. Cloudinary returns { secure_url, public_id } to the frontend
 *   5. Frontend stores the URL and sends it to backend in normal JSON requests
 */
exports.getSignature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder    = 'digital-indian';

    // Parameters that must be signed (alphabetical order)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    res.json({
      success:   true,
      signature,
      timestamp,
      folder,
      apiKey:    process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/media/:publicId — Admin
 *
 * Deletes an asset from Cloudinary by public_id.
 * Still runs on the backend so the API secret is never exposed.
 */
exports.deleteImage = async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
