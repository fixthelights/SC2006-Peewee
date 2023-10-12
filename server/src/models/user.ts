import mongoose, { Schema, Document } from 'mongoose';
const bcrypt = require('bcrypt');


export interface UserDocument extends Document {
    username: String;
    password: String;
    email: String;
    firstName: String;
    lastName: String;
    phone: String;
    createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    firstName: { 
        type: String, 
        required: true
    },
    lastName: { 
        type: String,
        required: true,
    },
    phone: { 
        type: String, 
        required: true,
        unique: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Encrypt new password if password is changed before saving
UserSchema.pre('save', async function (next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    // Generate salt for password enecryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    return next();
});

// Compile model from schema
const User = mongoose.model<UserDocument>('User',UserSchema);


// Export model
module.exports = User;