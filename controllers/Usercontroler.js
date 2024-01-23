let getProFilePage = (req, res)=>{
    return res.render('userinfo.ejs', {
        user: req.user
    });
};

module.exports = {
    getProFilePage: getProFilePage,

};