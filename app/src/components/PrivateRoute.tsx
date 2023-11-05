import * as React from "react";
import { Navigate, redirect } from "react-router-dom";
import { AuthManager} from '../classes/AuthManager';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Login from "../pages/Login";
import Fade from '@mui/material/Fade';

const auth = new AuthManager()

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);
    const [open, setOpen] = React.useState(true);
  
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    React.useEffect(() => {
        const isAuthenticated = auth.isAuthenticated();
        setLoggedIn(isAuthenticated);
        console.log("User login return =", isAuthenticated);
    }, [loggedIn]);


    if(loggedIn) {
        return <>{children}</>;
    } else {
        return (
            <>
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Collapse in={open}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={handleClose}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            Please sign in to continue
                        </Alert>
                    </Collapse>
                </Snackbar>
                <Login /> 
                
                {/* {loggedIn ? <>{children}</> : <Navigate to={redirectPath} />} */}
            </>
        );
        
    }
    
};


export default PrivateRoute;