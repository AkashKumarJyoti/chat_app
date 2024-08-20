import User from "../model/userModel.js";
import bcrypt from "bcrypt";

const register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});

        if(usernameCheck) {
            return res.json({msg: "Username already used", status: false});
        }
        const emailCheck = await User.findOne({email});
        if(emailCheck) {
            return res.json({msg: "Email is already taken", status: false});
        }

        // Password Encryption
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email, username, password: hashedPassword
        });
        delete user.password;
        return res.json({status: true, user});
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user) {
            return res.json({msg: "Incorrect username or password", status: false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({msg: "Incorrect username or password", status: false});
        }
        delete user.password;
        
        return res.json({status: true, user});
    } catch (error) {
        next(error);
    }
};

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findOneAndUpdate({ _id: userId }, {
            isAvatarImageSet: true,
            avatarImage 
        })
        return res.json({isSet:userData.isAvatarImageSet, image: userData.avatarImage})
    }
    catch (error) {
        next(error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await User.find({_id: {$ne: userId}}).select([
            "email", 
            "username", 
            "avatarImage",
            "_id"
        ]);
        return res.json(users);
    }
    catch (error) {
        next(error);
    }
}
export {register, login, setAvatar, getAllUsers};