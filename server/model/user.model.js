import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        unique: true,
        required: true,
        default: "https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/"
    },

    imageUrlId: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user',
    }
},{ timestamps: true });


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next()
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const User = model('User', userSchema);

export default User;