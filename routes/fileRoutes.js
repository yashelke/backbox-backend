import express from 'express';
import FileModel from '../models/fileModel.js';
import auth from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// File upload route

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  try {
    const folder = req.file.mimetype.includes('pdf')
      ? `backbox/${req.user.id}/documents`
      : `backbox/${req.user.id}/images`;

    // Configure upload options based on file type
    const uploadOptions = {
      folder,
      resource_type: req.file.mimetype === 'application/pdf' ? 'raw' : 'auto'
    };

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    const file = await FileModel.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      uploadedAt: new Date()
    });

    return res.status(201).json(file);
  } catch (err) {
    return res.status(500).json({ message: 'File Upload failed:- ', error: err.message });
  }
});


// Get user's files route

router.get('/', auth, async (req, res) => {
  try {
    const files = await FileModel.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    return res.json(files);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to fetch files:- ', error: err.message });
  }
});


// Delete file route
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);

    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Determine resource type based on file type
    const resourceType = file.fileType === 'application/pdf' ? 'raw' : 'image';
    
    // Delete from Cloudinary with proper resource type
    await cloudinary.uploader.destroy(file.publicId, { resource_type: resourceType });
    
    // Delete from database
    await file.deleteOne();

    return res.json({ message: 'File deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting file:- ', error: err.message });
  }
});

export default router;