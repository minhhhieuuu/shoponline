import express from "express";
import  Authcontroller  from "../controllers/Authcontroller";
import Mailcontroller from "../controllers/Mailcontroller";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.render("homepage.ejs")
    })
    router.get("/register",Authcontroller.getRegisterPage);
    router.post("/register-new-user", Authcontroller.createNewUser);
    router.get("/login", Authcontroller.getLoginPage);
    router.get("/verifyMail", Mailcontroller.getVerifyMailPage);
    return app.use("/",router);
};

module.exports = initWebRoutes;