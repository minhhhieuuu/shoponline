import registerService from "../services/registerService"


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
            PASSWORD: req.body.password
        };
        await registerService.createNewUser(data);
        return res.status(200).json({
            message: "a user create succeeds"
        })
    }catch (e) {
        return res.status(500).json(e);
    }
  };

module.exports = {
    getRegisterPage: getRegisterPage,
    createNewUser: createNewUser,
    getLoginPage: getLoginPage,
};