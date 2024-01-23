
import registerService from "../services/registerService"
import passport from "passport";
const nodemailer = require('nodemailer');
import loginService from "../services/loginService";
import resetService from "../services/resetService";
import bcrypt from "bcryptjs";

let getRegisterPage = (req, res)=>{
    return res.render('register.ejs');
};

let getLoginPage = (req, res)=>{
    return res.render('login.ejs');
};

let getVerifyinfoPage = (req, res)=>{
    return res.render('verifyinfo.ejs');
};

let createNewUser = async (req, res) => {
    try{
        const maxid = await registerService.getMaxUserID();
        const verificationCode = Math.random().toString(36).substring(2, 8);
        let data = {
            IDUSER :maxid + 1 ,
            ADMIN: 0,
            FULLNAME: req.body.fullName,
            EMAIL: req.body.email,
            PASSWORD: req.body.password,
            VERIFY: 0,
            VERIFYCODE: verificationCode
        };
        await registerService.createNewUser(data);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "H0902716511@gmail.com",
                pass: "pjpixpsmccdprnjn",
            },
            port: 465,
            secure: true,
            host: 'smtp.gmail.com'
        });

        let mailOptions = {
            from: 'H0902716511@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: `Please click on the link to verify your email: http://localhost:8080/verify?email=${req.body.email}&verifyCode=${verificationCode}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.redirect("/verifymail");

    }catch (e) {
        return res.status(500).json(e);
    }
  };
  let handleLogin = (req, res,next) => {
    passport.authenticate("localLogin", function(error, user, info) {
        if (error) {
           
            return res.status(500).json(error);
        }
        if (!user) {
            
            return res.status(401).json(info.message);
        }
        req.login(user, function (err) {
            if (err) {
                console.log(err)
                return res.status(500).json(error);
            } else {
                return res.status(200).json(user);
            }
        });
    })(req, res, next);
 };

 let verifyEmail = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const verificationCode = req.query.verifyCode;

        const user = await loginService.findUserByEmail(userEmail);
        if (user && user.VERIFY === 0 && user.VERIFYCODE === verificationCode) {
            await registerService.updateUserVerifyStatus(user.IDUSER, 1);
            return res.redirect("/login");
        } else {
            return res.status(401).json({
                message: "Invalid verification link."
            });
        }
    } catch (e) {
        return res.status(500).json(e);
    }
};

 let checkLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log(req.user);
    if(req.isAuthenticated() && req.user.ADMIN === '1'){
        return res.redirect("/admin");
    }
    next();
};

let postLogOut = (req, res) =>{
    req.session.destroy(function(err) {
        return res.redirect("/login");
    });
};

let checkAdminRole = (req, res, next) => {
    if (req.isAuthenticated() && req.user.ADMIN === '1') {
        return next();
    } else {
        return res.redirect("/login"); 
    }
};
// reset password

let sendPasswordResetEmail = async (req, res) => {
    try {
        let userEmail = req.body.email;
        console.log(userEmail);

        // Kiểm tra xem email có tồn tại trong hệ thống hay không
        const user = await loginService.findUserByEmail(userEmail);
        if (!user) {
            // Email không tồn tại, có thể trả về thông báo hoặc xử lý theo cách khác
            return res.status(404).json({ message: "Email not found" });
        }

        // Email tồn tại, tiếp tục gửi email xác nhận
        const host = req.get('host');
        const resetPasswordLink = `http://${host}/reset-password?email=${userEmail}`;

        // Gửi email xác nhận đến địa chỉ email của người dùng
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "H0902716511@gmail.com",
                pass: "pjpixpsmccdprnjn",
            },
            port: 465,
            secure: true,
            host: 'smtp.gmail.com'
        });

        const mailOptions = {
            from: 'H0902716511@gmail.com',
            to: userEmail,
            subject: 'Password Reset Confirmation',
            text: `Click the following link to reset your password: ${resetPasswordLink}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.redirect("/verifymail");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



let confirmPasswordReset = async (req, res) => {
    try {
        // Kiểm tra xem email có hợp lệ hay không
        const userEmail = req.query.email;
        // Hiển thị trang cho người dùng tạo mật khẩu mới
        return res.render('createNewPassword.ejs', { userEmail });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

let resetPassword = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const newPassword = req.body.password;

        // Lưu mật khẩu mới vào cơ sở dữ liệu
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await resetService.updatePassword(userEmail, hashedPassword);
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRegisterPage: getRegisterPage,
    createNewUser: createNewUser,
    getLoginPage: getLoginPage,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut,
    checkAdminRole: checkAdminRole,
    verifyEmail: verifyEmail,
    getVerifyinfoPage: getVerifyinfoPage,
    sendPasswordResetEmail: sendPasswordResetEmail,
    confirmPasswordReset: confirmPasswordReset,
    resetPassword: resetPassword
};