let getAdminPage = (req, res) =>{
    res.render("adminpage.ejs");
}

module.exports = {
    getAdminPage: getAdminPage,

};