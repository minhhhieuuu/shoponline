
import registerService from "../services/registerService"
import passport from "passport";

let getRegisterPage = (req, res)=>{
    return res.render('register.ejs');
};

let getLoginPage = (req, res)=>{
    return res.render('login.ejs');
};

let createNewUser = async (req, res) => {
    try{
        const maxid = await registerService.getMaxUserID();

        let data = {
            IDUSER :maxid + 1 ,
            ADMIN: 0,
            FULLNAME: req.body.fullName,
            EMAIL: req.body.email,
            PASSWORD: req.body.password,
            VERIFY: 0
        };
        await registerService.createNewUser(data);
        req.login(data, function (err) {
            if (err) {
                return res.status(500).json({ message: "User created, but failed to log in." });
            } else {
                return res.status(200).json({ message: "User created and logged in successfully." });
            }
        });
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


 let checkLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) =>{
    req.session.destroy(function(err) {
        return res.redirect("/login");
    });
};

module.exports = {
    getRegisterPage: getRegisterPage,
    createNewUser: createNewUser,
    getLoginPage: getLoginPage,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};