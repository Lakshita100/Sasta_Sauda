const multer = require("multer");

const storage = multer.memoryStorage(); // store in memory (for Azure later)

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
