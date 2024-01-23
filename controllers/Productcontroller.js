import poductService from "../services/productService";

let getProductPage = async (req, res)=>{
    const products = await poductService.getAllProducts();
    return res.render("listproduct.ejs", {
        user: req.user, products
    })
};

let getProductDetailPage = async (req, res) => {
    try {
        const productId = parseInt(req.params.id); // Lấy ID sản phẩm từ đường dẫn
        // Thực hiện các thao tác để lấy thông tin chi tiết của sản phẩm dựa trên productId
        const productDetails = await poductService.getProductById(productId);
        const products = await poductService.getAllProducts();
        console.log(productDetails)
        res.render("productdetail.ejs", {
            user: req.user,
            productDetails: productDetails,
            products: products // Truyền thông tin chi tiết sản phẩm vào view
        });
    } catch (error) {
        // Xử lý lỗi nếu cần thiết
        res.status(500).send("Internal Server Error");
    }
};

let getProductPagePaged = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 12; // Số sản phẩm trên mỗi trang
        const offset = (page - 1) * pageSize;

        const products = await poductService.getAllProductsPaged(offset, pageSize);
        const totalProducts = await poductService.getTotalProductsCount();

        const totalPages = Math.ceil(totalProducts / pageSize);

        return res.render("listproduct.ejs", {
            user: req.user,
            products,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

let getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.query.id); // Lấy ID sản phẩm từ đường dẫn
        const product = await poductService.getProductById(productId);
        console.log(productId)
        if (!product) {
            // Xử lý nếu không tìm thấy sản phẩm
            return res.status(404).send("Product not found");
        }
        res.render("productDetails.ejs", {
            user: req.user,
            product: product
        });
    } catch (error) {
        // Xử lý lỗi nếu cần thiết
        res.status(500).send("Internal Server Error");
    }
};
module.exports = {
    getProductPage: getProductPage,
    getProductPagePaged: getProductPagePaged,
    getProductDetailPage: getProductDetailPage,
    getProductById: getProductById
};