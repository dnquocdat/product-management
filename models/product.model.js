const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    {
        title: String,   
        // product_category_id: {
        //     type: String,
        //     default: ""
        // },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        //featured: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",      // ăn theo title sản phẩm vd: title: sản phẩm 1 => slug: sản-phẩm-1
            unique: true
        },
        // createdBy: {
        //     account_id: String,
        //     createdAt: {
        //         type: Date,
        //         default: Date.now
        //     }
        // },
        // updatedBy: [
        //     {
        //         account_id: String,
        //         updatedAt: Date

        //     }
        // ],
        deleted: {
            type: Boolean,
            default: false      // nếu người dùng kh truyền thì mặc định là false
        }, 
        deletedAt: Date
        // deletedBy: {
        //     account_id: String,
        //     deletedAt: Date
        // },
        
    }, 
    {
        timestamps: true    // tự động thêm 2 thuộc tính createAt và updateAt thay đổi vào database
    }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;