import Alert from '@mui/material/Alert';

class AuthController{
    handleValidCredentials(){
        <Alert severity="success">This is a success alert — check it out!</Alert>
    }

    registerUser(email: String, password: String) : void {
        if (this.validateCredentials(email, password)){
            this.handleValidCredentials();
        }

    }
    validateCredentials(email: String, password: String) : boolean {
        return true;
        // if email address is used
        // pop up message to key email address again 

    }
}

export {AuthController}