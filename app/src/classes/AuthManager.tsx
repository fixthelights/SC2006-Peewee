import {jwtDecode} from 'jwt-decode';

interface User{
    userId: string,
    email: string, 
    iat: number,
    exp: number
  }

class AuthManager{
    
     // check if email is in the correct format
     validateEmailAddressFormat(email: string): boolean { 
        const atSymbol: number = email.indexOf("@"); 
        const dotSymbol: number = email.lastIndexOf("."); 
        const spaceSymbol: number = email.indexOf(" "); 
    
        if ((atSymbol !== -1) && 
            (atSymbol !== 0) && 
            (dotSymbol !== -1) && 
            (dotSymbol !== 0) && 
            (dotSymbol > atSymbol + 1) && 
            (email.length > dotSymbol + 1) && 
            (spaceSymbol === -1)) { 
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

    // Get user ID from JWT
    identifyUser() : string {
        let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
        if (userJwt!=null){
          const userDetails: User = jwtDecode(userJwt)
          return userDetails.userId
        }
        else{
          return ''
        }
    }

    // Auth user active login using JWT
    isAuthenticated() : boolean {
        try {
            // Check if JWT exists in local storage
            let userJwt = JSON.parse(localStorage.getItem('token') || 'null');
            
            if (userJwt === null) return false;
            const decodedJwt = jwtDecode(userJwt);
            const now = Date.now() / 1000;
            // console.log(decodedJwt.exp, now);
            if (decodedJwt.exp !== undefined && decodedJwt.exp > now) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    // Auth with backend 
    // isAuthenticated(): boolean {
    //     try {
    //         // Check if JWT exists in local storage
    //         let userJwt = JSON.parse(localStorage.getItem('token') || 'null');

    //         let loggedIn = false;

    //         // Validate JWT with backend - Check if token still valid
    //         axios.post(`https://${process.env.REACT_APP_SERVER_URL}/users/auth`, { jwt: userJwt })
    //         .then(res => {loggedIn = res.data});

    //         console.log("User is logged in =", loggedIn);
    //         return loggedIn;
    //     } catch (error) {
    //         console.error("Error checking authentication:", error);
    //         return false;
    //     }
    // }
    
      
}

export {AuthManager}