import passport from "passport";
import passportLocal from "passport-local";
import loginService from "../services/loginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use("localLogin", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const user = await loginService.findUserByEmail(email);
    
            if (!user) {
                return done(null, false, { message: "User not found." });
            }
    
            const isMatch = await loginService.compareUserPassword(user, password);
    
            if (isMatch === true) {
                if (user.VERIFY === 0) {
                    return done(null, false, { message: "User not verified" });
                }
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid password." });
            }
        } catch (error) {
            return done(error);
        }
    }));
    
};

passport.serializeUser((user, done) => {
    done(null, user.IDUSER);
});

passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportLocal;