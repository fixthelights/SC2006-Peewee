import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordToken extends Document {
    userId: String;
    token: String;
    createdAt: Date;
}

const PasswordTokenSchema: Schema = new Schema({
    userId: { 
        type: String, 
        required: true, 
        ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 3600 
    },
});

// Compile model from schema
const PasswordToken = mongoose.model<IPasswordToken>('PasswordToken', PasswordTokenSchema);

module.exports = PasswordToken;