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

userSchema.plugin(passportLocalMongoose.default);

const User = mongoose.model("User", userSchema);

export default User;