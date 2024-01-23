function handleVerifyInforBtn(){
    $("#submitmailBtn").on("click", function(event) {
        event.preventDefault();
        let email = $("#verifymail").val();

        console.log(email)

        $.ajax({
            url: `${window.location.origin}/verifyinfor`,
            method: "POST",
            data: {email: email},
            success: function(data) {
                window.location.href = "/verifymail";
            },
            error: function(err) {
                alert("Your email  incorrect. Please try again!");
            }
        })

    });
}
$(document).ready(function() {
    handleVerifyInforBtn();
});


function validateInput(password, passwordConfirmation) {
   //check password
    if(password.length > 2){
        $("#password").removeClass("is-invalid");
    }else {
        $("#password").addClass("is-invalid");
    }

    //check passwordConfirmation
    if(passwordConfirmation === password){
        $("#passwordConfirmation").removeClass("is-invalid");
    }else{
        $("#passwordConfirmation").addClass("is-invalid");
    }

    if( password.length <= 2 || password !== passwordConfirmation)
        return true; //has errors

    return false;
}


function handleClickResetBtn() {
    $("#resetBtn").on("click", function(event) {
        event.preventDefault();

        let password = $("#password").val();
        let passwordConfirmation = $("#passwordConfirmation").val();
        let userEmail = $("#userEmail").val();
        //validate input
        let check = validateInput(password, passwordConfirmation);
        if (!check) {
            $.ajax({
                url: `${window.location.origin}/reset-password`,
                method: "POST",
                data: {email: userEmail, password: password, passwordConfirmation: passwordConfirmation},
                success: function(data) {
                    window.location.href = "/login";
                },
                error: function(err) {
                   alert(err.responseText);
                }
            });
        }
    });
};

$(document).ready(function() {
    handleClickResetBtn();
});