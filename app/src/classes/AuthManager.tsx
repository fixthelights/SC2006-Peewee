class AuthManager{

     // check if email is in the correct format
     validateEmailAddressFormat(email: string): boolean { 
        const atSymbol: number = email.indexOf("@"); 
        const dotSymbol: number = email.lastIndexOf("."); 
        const spaceSymbol: number = email.indexOf(" "); 
    
        if ((atSymbol != -1) && 
            (atSymbol != 0) && 
            (dotSymbol != -1) && 
            (dotSymbol != 0) && 
            (dotSymbol > atSymbol + 1) && 
            (email.length > dotSymbol + 1) && 
            (spaceSymbol == -1)) { 
            return true; 
        } else { 
            return false; 
        } 
    }

    // check if password meets requirements
    checkPasswordValidity(password: string) : boolean {

        let upper: number = 0;
        let lower: number = 0;
        let special: number = 0;

        for (let i: number = 0; i < password.length; i++) {
            if (password[i] >= "A" && password[i] <= "Z") {
                upper++;
            } else if (password[i] >= "a" && password[i] <= "z") {
                lower++;
            } else {
                special++;
            }
        }

        if (password.length>=8 && upper>0 && lower>0 && special>0){
            return true;
        }

        return false;

    }

    generateOTP() : string{
        let otp = Math.floor(Math.random() * 89999999 + 10000000)
        return otp.toString() // generate integer in the range of 10000000 to 99999999 ( 8 digit OTP )
    }
}

export {AuthManager}