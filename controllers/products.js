const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const tryCatch = require('./utils/tryCatch');

const getAllProductsAdmin = tryCatch(async (req, res) => {
    const lookupCategory = {
        $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
        },
    };
    const lookupSupplier = {
        $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplier',
        },
    };
    const products = await Product.aggregate([
        lookupCategory,
        lookupSupplier,
        {
            $addFields: {
                category: { $first: '$category' },
                supplier: { $first: '$supplier' },
            },
        },
    ]);
    res.status(200).json(products);
});

const getAllProducts = tryCatch(async (req, res) => {
    const page = req.query.page;
    const productsPerPage = 12;
    const price = {
        $divide: [{ $multiply: ['$price', '$sizes.discount'] }, 100],
    };
    const discountPrice = {
        $addFields: {
            'sizes.discountPrice': {
                $subtract: ['$price', price],
            },
        },
    };
    const aggegrate = [
        {
            $unwind: { path: '$sizes' },
        },
        discountPrice,
        {
            $sort: { 'sizes.discount': -1 },
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                price: { $first: '$price' },
                sizes: { $push: '$sizes' },
                category: { $first: '$categoryId' },
                supplier: { $first: '$supplierId' },
                description: { $first: '$description' },
                imageURL: { $first: '$imageURL' },
                promotionPosition: { $first: '$promotionPosition' },
                createdAt: { $first: '$createdAt' },
            },
        },
    ];
    if (page) {
        const products = await Product.aggregate(aggegrate)
            .skip(page * productsPerPage)
            .limit(productsPerPage);
        res.status(200).json(products);
    } else {
        const products = await Product.aggregate(aggegrate);
        res.status(200).json(products);
    }
});

const getProductById = tryCatch(async (req, res) => {
    const { id } = req.params;
    const discountPrice = [
        {
            $match: { _id: ObjectId(id) },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
            },
        },
        {
            $unwind: { path: '$sizes' },
        },
        {
            $addFields: {
                'sizes.discountPrice': {
                    $subtract: ['$price', { $divide: [{ $multiply: ['$price', '$sizes.discount'] }, 100] }],
                },
            },
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                price: { $first: '$price' },
                sizes: { $push: '$sizes' },
                description: { $first: '$description' },
                imageURL: { $first: '$imageURL' },
                category: { $first: '$category' },
            },
        },
        {
            $unwind: { path: '$category' },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                sizes: 1,
                description: 1,
                imageURL: 1,
                category: '$category.name',
            },
        },
    ];
    // turn array to obj
    const product = await Product.aggregate(discountPrice).then(function ([res]) {
        return res;
    });
    res.status(200).json(product);
});

const getProductByName = tryCatch(async (req, res) => {
    const { name } = req.params;
    const product = await Product.find().byName(name);
    res.status(200).json(product);
});

const createProduct = tryCatch(async (req, res) => {
    const data = req.body;
    const product = new Product(data);
    await product.save();
    res.status(200).json(product);
});

const updateProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(product);
});

const deleteProduct = tryCatch(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
});

//Hiển thị tất cả mặt hàng có tồn kho dưới 50
const stockProduct = tryCatch(async (req, res) => {
    const result = await Product.find({ stock: { $lte: 50 } });
    res.status(200).json(result);
});

const searchProductByCategory = tryCatch(async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.query;
    const result = await Product.find({
        $and: [{ categoryId: categoryId }, { name: new RegExp(name, 'i') }],
    });
    res.status(200).json(result);
});

const filterProduct = tryCatch(async (req, res) => {
    const { category, supplier, price } = req.query;
    let sort = {};
    if (req.query.sort) {
        const parts = req.query.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sort = { price: -1 };
    }
    let categoryArray = category?.split('-') || [];
    let supplierArray = supplier?.split('-') || [];
    let priceDefault = {
        $and: [{ price: { $gte: 0 } }, { price: { $lte: 1000000000 } }],
    };
    let priceFilter;
    if (price) {
        priceFilter = JSON.parse(price);
        priceDefault = {
            $and: [{ price: { $gte: Number(priceFilter.gte) } }, { price: { $lte: Number(priceFilter.lte) } }],
        };
    }

    const aggegrate = [
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
            },
        },
        {
            $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'suppliers',
                localField: 'supplierId',
                foreignField: '_id',
                as: 'supplier',
            },
        },
        {
            $unwind: {
                path: '$supplier',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                name: 1,
                price: 1,
                sizes: 1,
                imageURL: 1,
                createdAt: 1,
                categoryName: '$category.name',
                supplierName: '$supplier.name',
            },
        },
    ];

    const discountPrice = [
        {
            $unwind: { path: '$sizes' },
        },
        {
            $addFields: {
                'sizes.discountPrice': {
                    $subtract: ['$price', { $divide: [{ $multiply: ['$price', '$sizes.discount'] }, 100] }],
                },
            },
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                price: { $first: '$price' },
                sizes: { $push: '$sizes' },
                imageURL: { $first: '$imageURL' },
                categoryName: { $first: '$categoryName' },
                supplierName: { $first: '$supplierName' },
                createdAt: { $first: '$createdAt' },
            },
        },
    ];
    if (categoryArray.length > 0 && supplierArray.length > 0) {
        const result = await Product.aggregate(aggegrate)
            .append({
                $match: {
                    $and: [
                        { categoryName: { $in: categoryArray } },
                        { supplierName: { $in: supplierArray } },
                        priceDefault,
                    ],
                },
            })
            .append(discountPrice)
            .sort(sort);
        res.status(200).json(result);
    } else if (categoryArray.length > 0) {
        const result = await Product.aggregate(aggegrate)
            .append({
                $match: {
                    $and: [{ categoryName: { $in: categoryArray } }, priceDefault],
                },
            })
            .append(discountPrice)
            .sort(sort);
        res.status(200).json(result);
    } else if (supplierArray.length > 0) {
        const result = await Product.aggregate(aggegrate)
            .append({
                $match: {
                    $and: [{ supplierName: { $in: supplierArray } }, priceDefault],
                },
            })
            .append(discountPrice)
            .sort(sort);
        res.status(200).json(result);
    } else if (price) {
        const result = await Product.aggregate(aggegrate)
            .append({
                $match: {
                    $and: [{ price: { $gte: Number(priceFilter.gte) } }, { price: { $lte: Number(priceFilter.lte) } }],
                },
            })
            .append(discountPrice)
            .sort(sort);
        res.status(200).json(result);
    } else {
        const result = await Product.aggregate(aggegrate).append(discountPrice).sort(sort);
        res.status(200).json(result);
    }
});

module.exports = {
    getAllProducts,
    getProductById,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct,
    stockProduct,
    searchProductByCategory,
    filterProduct,
    getAllProductsAdmin,
};
