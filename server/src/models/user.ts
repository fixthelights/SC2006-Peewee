import mongoose, { Schema, Document } from 'mongoose';
const bcrypt = require('bcrypt');

export interface UserDocument extends Document {
    email: string; 
    password: string;
    createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Encrypt new password if password is changed before saving
UserSchema.pre('save', async function (next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    // Generate salt for password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    return next();
});

// Compile model from schema
const User = mongoose.model<UserDocument>('User',UserSchema);

// Export model
module.exports = User;

