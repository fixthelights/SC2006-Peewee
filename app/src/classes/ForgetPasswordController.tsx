class ForgetPasswordController{
    generateOTP() : string{
        let otp = Math.floor(Math.random() * 89999999 + 10000000)
        return otp.toString() // generate integer in the range of 10000000 to 99999999 ( 8 digit OTP )
    }
    sendOTP(email: string) : boolean{
        let otp = this.generateOTP;
        // send otp
        // return true if successful
        // return false if fails
        return true;
    }
}

export {ForgetPasswordController}