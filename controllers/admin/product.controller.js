const { prefixAdmin } = require('../../config/system')
const Product = require('../../models/product.model')

// [GET] /admin/products
module.exports.index = async (req, res) => { 

    // bộ lọc
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if (req.query.status){
        const index = filterStatus.findIndex(item => item.status == req.query.status)
        filterStatus[index].class = "active"
    }
    else {
        filterStatus[0].class = "active"
    }

    let find = {
        deleted: false,
    }
    if(req.query.status)
        find.status = req.query.status

    // tìm kiếm
    let keyword = ""
    if (req.query.keyword){
        keyword = req.query.keyword

        // tham số i là không phân biệt tìm kiếm chữ hoa hay thường
        const regex = new RegExp(keyword, "i") // tìm kiếm kh cần viết hết tên vd iphone sẽ ra iphone 9
        find.title = regex;
    }


    // phân trang
    let objPagination = {
        currentPage: req.query.page,
        limitItem: 4
    }
    // vị trí bắt đầu lấy = (số trang hiện tại - 1)* số item mỗi trang
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItem;

    

    const countProducts = await Product.countDocuments(find)
    const totalPage = Math.ceil(countProducts / objPagination.limitItem)
    objPagination.totalPage = totalPage;

    // end phân trang
    const products = await Product.find(find)
        .sort({position: "desc"})
        .limit(objPagination.limitItem)
        .skip(objPagination.skip)


    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        objPagination: objPagination
    })
}

// Thay đổi trạng thái sản phẩm
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) =>{
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne(
        {_id: id}, {status: status})
    req.flash("success", "Cập nhật trạng thái thành công!")    
    // redirect ('back') sẽ link lại về trang trước khi bấm
    res.redirect('back')  // nếu để res.send thì sẽ bị link sang trang mới

}


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) =>{
    const type = req.body.type
    const ids = req.body.ids.split(", ") // chuyen string sang array

    switch (type) {
        case "active":
            await Product.updateMany({ _id: {$in: ids}}, {status: "active"})
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)    
            break;
        case "inactive":    
            await Product.updateMany({ _id: {$in: ids}}, {status: "inactive"})     
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)    
            break;
        case "delete-all":
            await Product.updateMany({ _id: {$in: ids}}, {deleted: true}, {deletedAt: new Date()})   
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`)    
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-") // chuyển mỗi phần tử của string thành 2 phần tử của mảng
                position = parseInt(position)   // vì position trong model là number nên phải chuyển
                await Product.updateOne(
                    {_id: id}, {position: position}
                    )     
            }
            req.flash("success", `Đổi vị trí thành công ${ids.length} sản phẩm!`)    

            //await Product.updateMany({ _id: {$in: ids}}, {deleted: true}, {deletedAt: new Date()})   
            break;    
        default:
            break;
    }

    res.redirect('back')  // nếu để res.send thì sẽ bị link sang trang mới
    

}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) =>{
    const id = req.params.id
    // await Product.deleteOne({_id: id})   xóa vĩnh viễn dữ liệu
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    })

    res.redirect('back')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) =>{
    res.render('admin/pages/products/create',{
        pageTitle: "Thêm mới sản phẩm"
    })
}
// [POST] /admin/products/create
module.exports.createPost = async (req, res) =>{
    if (!req.body.title){
        req.flash("error",`Vui lòng nhập tiêu đề!`)
        res.redirect('back')
        return 
    }
    //console.log(req.file)
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    }
    else {
        req.body.position = parseInt(req.body.position)
    }
    if (req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`    // lấy ảnh từ trong uploads ra lưu vào database
    }
    const product = new Product(req.body)
    await product.save()    // lưu sản phẩm vào database

    res.redirect(`${prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) =>{
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        console.log(product)
        res.render('admin/pages/products/edit',{
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect(`${prefixAdmin}/products`)
    }
    
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) =>{
    if (!req.body.title){
        req.flash("error",`Vui lòng nhập tiêu đề!`)
        res.redirect('back')
        return 
    }
    //console.log(req.file)
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`    // lấy ảnh từ trong uploads ra lưu vào database
    }

    try {
        await Product.updateOne({_id: req.params.id}, req.body)
        req.flash("success",`Chỉnh sửa sản phẩm thành công`)
        res.redirect('back')
        
    } catch (error) {
        res.redirect(`${prefixAdmin}/products`)
    }

    
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) =>{
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        // console.log(product)
        res.render('admin/pages/products/detail',{
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${prefixAdmin}/products`)
    }
    
}