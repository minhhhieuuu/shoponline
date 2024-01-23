import connection from '../config/connectDB';

let getAllProducts = () => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            SELECT product.idproduct, product.NAMEPRODUCT, product.PRICE, GROUP_CONCAT(photo.LINK) AS LINK
            FROM onlineshop.product AS product
            LEFT JOIN onlineshop.photo AS photo ON product.idproduct = photo.idproduct
            GROUP BY product.idproduct;
    `;
            connection.query(query, function (error, results) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllProductsPaged = (offset, pageSize) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT product.idproduct, product.NAMEPRODUCT, product.PRICE, GROUP_CONCAT(photo.LINK) AS LINK
                FROM onlineshop.product AS product
                LEFT JOIN onlineshop.photo AS photo ON product.idproduct = photo.idproduct
                GROUP BY product.idproduct
                LIMIT ?, ?;`;
            const values = [offset, pageSize];

            connection.query(query, values, function (error, results) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};



let getTotalProductsCount = () => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT COUNT(*) AS total FROM onlineshop.product;`;

            connection.query(query, function (error, results) {
                if (error) {
                    reject(error);
                } else {
                    const total = results[0].total;
                    resolve(total);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getProductById = (productId) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT product.idproduct, product.NAMEPRODUCT, product.PRICE, GROUP_CONCAT(photo.LINK) AS LINK
                FROM onlineshop.product AS product
                LEFT JOIN onlineshop.photo AS photo ON product.idproduct = photo.idproduct
                WHERE product.idproduct = ?
                GROUP BY product.idproduct;`;
            const values = [productId];
            
            connection.query(query, values, function (error, results) {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]); // Chỉ lấy sản phẩm đầu tiên vì idproduct là duy nhất
                    } else {
                        resolve(null); // Trả về null nếu không tìm thấy sản phẩm
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllProducts: getAllProducts,
    getAllProductsPaged: getAllProductsPaged,
    getTotalProductsCount: getTotalProductsCount,
    getProductById: getProductById
};