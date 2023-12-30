const fs = require('fs');

const tryCatch = require('./utils/tryCatch');
const Product = require('../models/product');
const Category = require('../models/category');
const Slider = require('../models/slider');
const Supplier = require('../models/supplier');

//MULTER UPLOAD
const multer = require('multer');

//CHỈ ĐỊNH THƯ MỰC MÀ ẢNH UPLOAD VÀO
const UPLOAD_DIRECTORY = './public/uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uid = req.params.id;
        const PATH = UPLOAD_DIRECTORY + uid;

        //NẾU CHƯA CÓ FOLDER THÌ SẼ TẠO 1 FOLDER MỚI
        if (!fs.existsSync(PATH)) {
            fs.mkdirSync(PATH, { recursive: true });
            cb(null, PATH);
        } else {
            cb(null, PATH);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
});

const uploadCategoryImage = tryCatch((req, res, next) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        } else {
            const { id } = req.params;
            const category = await Category.findById(id);
            category.imageUrl = `/uploads/${id}/${req.file.originalname}`;
            await category.save();
            res.status(200).json({ ok: true, body: req.file });
        }
    });
});

const uploadSliderImage = tryCatch((req, res, next) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        } else {
            const { id } = req.params;
            const slider = await Slider.findById(id);
            slider.imageUrl = `/uploads/${id}/${req.file.originalname}`;
            await slider.save();
            res.status(200).json({ ok: true, body: req.file });
        }
    });
});

const uploadSupplierImage = tryCatch((req, res, next) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        } else {
            const { id } = req.params;
            const supplier = await Supplier.findById(id);
            supplier.imageUrl = `/uploads/${id}/${req.file.originalname}`;
            await supplier.save();
            res.status(200).json({ ok: true, body: req.file });
        }
    });
});

const uploadProductImage = tryCatch((req, res, next) => {
    upload.array('files', 10)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        } else {
            const { id } = req.params;
            const product = await Product.findById(id);
            const imageURL = req.files.map((file) => {
                return `/uploads/${id}/${file.originalname}`;
            });
            // if product.imageURL already has 6 images, then don't push new images
            if (product.imageURL.length >= 6) {
                res.status(400).json({ ok: false, message: 'Maximum 6 images' });
            }
            product.imageURL.push(...imageURL);
            await product.save();
            res.status(200).json({ ok: true, body: req.files });
        }
    });
});

module.exports = {
    uploadProductImage,
    uploadCategoryImage,
    uploadSliderImage,
    uploadSupplierImage,
};
