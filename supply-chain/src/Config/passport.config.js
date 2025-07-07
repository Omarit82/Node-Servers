import passport from "passport";
import local from 'passport-local';
import { encriptar,checkPassword } from "../utils/bcrypt.js";
import { userModel } from "../Models/user.model.js";

const localStrategy = local.Strategy;

const initializedPassport = () =>{
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'email'},async(req,username,password,done)=>{
        try {
            const {nombre,apellido,email,password} = req.body;
            const emailCheck = await userModel.findOne({email:email});
            if(emailCheck){
                return done(null,false);//No devuelvo error - no genero un nuevo usuario.
            }else{
                const newUser = {
                    nombre:nombre,
                    apellido:apellido,
                    email:email,
                    password:encriptar(password)
                };
                const createUser = await userModel.create(newUser);
                done(null,newUser); // No devuelvo error - genero el nuevo usuario.
            }        
        } catch (error) {
            done(error);
        }
    }))
    passport.use('login', new localStrategy({usernameField:'email'},async(username,password,done)=>{
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

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })

    passport.deserializeUser(async(id,done)=>{
        const user= await userModel.findById(id);
        done(null,user);
    })
}

export default initializedPassport;