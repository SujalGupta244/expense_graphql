import {users} from "../dummyData/data.js"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
const userResolver = {
    Mutation: {
        signUp : async(_, {input}, context) =>{
            try {
                const {username, name, password, gender} = input;

                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }

                const existingUser = await User.findOne({username})

                if(existingUser){
                    throw new Error("User already exists")
                }

                const salt = await bcrypt.getSalt(10)

                const hashPassword = await bcrypt.hash(password, salt)

                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name, 
                    password : hashPassword,
                    gender,
                    profilePicture: gender == "male"? boyProfilePic : girlProfilePic
                })

                await newUser.save()
                await context.login(newUser)

            } catch (error) {
                console.error("Error in signUp: ", err)
                throw new Error(err.message || "Internal server error")
            }
        },
        login: async(_, {input}, context) =>{
            try {
                const {username, password} = input;

                const {user} = await context.authenticate("graphql-local", {username, password})
                await  context.login(user)
                return user;
            } catch (error) {
                console.error("Error in login: ", err)
                throw new Error(err.message || "Internal server error")
            }
        },
        logout: async(_,__,context) =>{
            try {
                await context.logout()
                req.session.destroy((err)=>{
                    if(err) throw err;
                })
                res.clearCokkie('connect.sid');

                return {message: "Logged out successfully"}
            } catch (error) {
                console.error("Error in logout: ", err)
                throw new Error(err.message || "Internal server error")
            }
        }
    },
    Query:{
        // users: () =>{
        //     return users;
        // },

        user: async(_, {userId}) =>{
            try {
                const user = await User.findById(userId)
                return user;
            } catch (error) {
                console.error("Error in user query: ", err)
                throw new Error(err.message || "Error getting user")
            }y
        },
        authUser: async(_,__,context) =>{
            try {
                const user = context.getUser()
                return user;
            } catch (err) {
                console.error("Error in authUser: ", err)
                throw new Error("Internal server error")
            }
        },

        // TODO => ADD USER/TRANSACTION RELATION
    },
}

export default userResolver