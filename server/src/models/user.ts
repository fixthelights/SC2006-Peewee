import mongoose, { Schema, Document } from 'mongoose';
// import bcrypt from 'bcrypt';


export interface UserDocument extends Document {
    email: string;
    password: string;
}

const userSchema: Schema<UserDocument> = new Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

userSchema.pre('save', async function (next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    // // Generate salt for enecryption
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(user.password, salt);
    // user.password = hashedPassword;

    return next();
});
const userDb = mongoose.model<UserDocument>('User',userSchema);


// class User{
//     static getAll(): UserJSON[]{
//         return [
//                 {email: "John@john.com", password: "123456"},
//                 {email: "Sam@sam.com", password: "654321"}
//             ]
//         }
    

//     static getOne(userId: number): UserJSON{
//         return {email: "John@john.com", password: "123456"}
//     }
// }

module.exports = userDb;