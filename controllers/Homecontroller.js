import poductService from "../services/productService";

let getHomePage = async  (req, res) => {
    const products = await poductService.getAllProducts();

    return res.render("homepage.ejs", {
        user: req.user, products
    })
};

module.exports = {
    getHomePage: getHomePage
};