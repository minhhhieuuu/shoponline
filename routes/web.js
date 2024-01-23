import express from "express";
import  Authcontroller  from "../controllers/Authcontroller";
import Mailcontroller from "../controllers/Mailcontroller";
import initPassportLocal from "../passport/passportlocal"
import Homecontroller from "../controllers/Homecontroller";
import Admincontroller from "../controllers/Admincontroller";

initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", Authcontroller.checkLoggedIn,Homecontroller.getHomePage)
    router.post("/logout", Authcontroller.postLogOut);
    router.get("/register",Authcontroller.getRegisterPage);
    router.post("/register-new-user", Authcontroller.createNewUser);
    router.get("/login", Authcontroller.checkLoggedOut,Authcontroller.getLoginPage);
    router.post("/login", Authcontroller.handleLogin);
    router.get("/admin", Authcontroller.checkAdminRole, Admincontroller.getAdminPage);

    router.post("/verifyinfor", Authcontroller.sendPasswordResetEmail);
    router.get("/reset", Authcontroller.getVerifyinfoPage);
    router.get("/verifymail",Mailcontroller.getVerifyMailPage);
    router.get("/verify", Authcontroller.verifyEmail);
    router.get("/reset-password", Authcontroller.confirmPasswordReset);
    router.post("/reset-password", Authcontroller.resetPassword);
    return app.use("/",router);
};

module.exports = initWebRoutes;