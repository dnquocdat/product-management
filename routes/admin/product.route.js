const express = require('express')
const multer  = require('multer')

const router = express.Router();
// xét nơi lưu ảnh, cụ thể là ở public/uploads
const storageMulter = require('../../helpers/storeMulter')
const upload = multer({ storage: storageMulter})
// end lưu ảnh
const controller = require('../../controllers/admin/product.controller'); 
router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);   // :id là data động
router.patch('/change-multi', controller.changeMulti);   
router.delete('/delete/:id', controller.deleteItem);   

router.get('/create', controller.create);
router.post('/create',upload.single('thumbnail') ,controller.createPost);

router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('thumbnail') , controller.editPatch);

router.get('/detail/:id', controller.detail);





module.exports= router;