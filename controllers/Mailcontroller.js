let getVerifyMailPage = (req, res)=>{
    return res.render('verifymail.ejs');
};

module.exports = {
    getVerifyMailPage: getVerifyMailPage,

};