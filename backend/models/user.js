import mongoose from "mongoose";
import { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose.default, {
    usernameLowerCase: true
});

const User = mongoose.model("User", userSchema);

export default User;