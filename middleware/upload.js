// Multer setup for file uploads
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer ({
    storage,
    limits:
    {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
    },
    fileFilter:(req,file,ch) =>
    {
       const allowed = [
  "image/png","image/jpg","image/jpeg",
  "application/pdf","application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // add other mimetypes being advertised in the UI
];
        allowed.includes(file.mimetype) ? ch(null,true) : ch(new Error("Invalid file type"),false);

    },
});


export default upload;