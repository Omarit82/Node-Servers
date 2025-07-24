import passport from "passport";
import local from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import { encriptar,checkPassword } from "../utils/bcrypt.js";
import { userModel } from "../Models/user.model.js";

const localStrategy = local.Strategy;

export const initializedPassport = () =>{

    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'email'},async(req,username,password,done)=>{
        try {
            console.log(req.body);
            
            const {nombre,apellido,avatar} = req.body;
            //chequeo de email de deitres:
            const array = username.split('@');
            const dominio = array[1];
            if(dominio !== 'deitres.com'){
                return done('El email ingresado no corresponde a la organizacion',false)
            }
            const emailCheck = await userModel.findOne({email:username});           
            if(emailCheck){
                return done(null,false,{Message:" Email ya registrado"});//No devuelvo error - no genero un nuevo usuario.
            }else{
                const newUser = {
                    nombre:nombre,
                    apellido:apellido,
                    email:username,
                    password:encriptar(password),
                    avatar:avatar
                };
                const createUser = await userModel.create(newUser);
                done(null,createUser); // No devuelvo error - genero el nuevo usuario.
            }        
        } catch (error) {
            done(error);
        }
    }))

    passport.use('login', new localStrategy({usernameField:'email'}, async(username,password,done)=>{
        try {
            const user = await userModel.findOne({email:username})
            if(user && checkPassword(password,user.password)){
                return done(null,user)
            }
            return done(null,false)
        } catch (error) {
            return done(error)
        }
    }))

    /**Google */
    passport.use(new GoogleStrategy({clientID: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, callbackURL: "/auth/google/callback"},
        async function(accessToken,refreshToken,profile,done){   
            try {
                let user = await userModel.findOne({googleId:profile.id});
                if(!user){
                    user = await userModel.create({
                        googleId:profile.id, 
                        email:profile.emails[0].value,
                        nombre:profile.name.givenName,
                        apellido:profile.name.familyName,
                        password:encriptar(process.env.GOOGLE_PASS)
                    })
                }
                done(null,user);
            } catch (error) {
                done(error)
            }
        }
    ))

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })

    passport.deserializeUser(async(id,done)=>{
        const user= await userModel.findById(id);
        done(null,user);
    })
}
export const ensureAuthenticate = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.status(401).redirect('/auth/google');
}