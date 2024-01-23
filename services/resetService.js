import connection from "../config/connectDB";

let updatePassword = (userEmail, hashedPassword) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `UPDATE onlineshop.user SET PASSWORD = ? WHERE EMAIL = ?`;
            connection.query(query, [hashedPassword, userEmail], function (error, results) {
                if (error) {
                    reject(error);
                } else {
                    // Kiểm tra xem có người dùng nào được cập nhật không
                    if (results.affectedRows > 0) {
                        resolve(true);
                    } else {
                        // Không tìm thấy người dùng với email tương ứng
                        resolve(false);
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    updatePassword: updatePassword
};