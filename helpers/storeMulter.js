const multer  = require('multer')

// hàm xét cú pháp lưu tên ảnh vào uploads trong public
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Xuất đối tượng storage
module.exports = storage;