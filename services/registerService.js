import connection from "../config/connectDB";
import bcrypt from "bcryptjs";

let createNewUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmailUser(user.EMAIL);
            
            if(check === false) {
                let salt = bcrypt.genSaltSync(10);
                let data = {
                    IDUSER: user.IDUSER,
                    ADMIN: user.ADMIN,
                    FULLNAME: user.FULLNAME,
                    EMAIL: user.EMAIL,
                    PASSWORD: bcrypt.hashSync(user.PASSWORD, salt),
                    VERIFY: user.VERIFY,
                    VERIFYCODE: user.VERIFYCODE
                };
                
                connection.query("INSERT INTO onlineshop.user set ? ", data, function(error, rows) {
                    if (error) reject(error);
                    resolve("create a new user successfully");
                })
            }
            if(check === true)
                reject(`The email ${user.email} has already exist. Please choose another email`)

        } catch (e) {
            reject(e);
        }
    });
};

let getMaxUserID = () => {
    return new Promise(async (resolve, reject) => {
        try {
            connection.query("SELECT MAX(IDUSER) AS MaxUserID FROM onlineshop.user", function(error, rows) {
                if (error) reject(error);
                
                const maxUserID = rows[0].MaxUserID;
                resolve(maxUserID);
            });
        } catch (e) {
            reject(e);
        }
    });
};

let checkEmailUser = (email) => {
    return new Promise((resolve, reject) => {
        try{
            connection.query("SELECT * from user where EMAIL = ?", email, function(error, rows) {
                if(error) reject(error);
                if(rows.length > 0) resolve(true);
                resolve(false);
            })
        }catch (e) {
            reject(e);
        }
    }) ;
    };

    let updateUserVerifyStatus = (userID, status) => {
        return new Promise((resolve, reject) => {
            try {
                // Thực hiện cập nhật trạng thái xác minh trong cơ sở dữ liệu
                connection.query("UPDATE onlineshop.user SET VERIFY = ? WHERE IDUSER = ?", [status, userID], function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    };

module.exports = {
    createNewUser: createNewUser,
    getMaxUserID: getMaxUserID,
    updateUserVerifyStatus: updateUserVerifyStatus,
};