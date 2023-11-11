import * as React from "react";
import { AuthManager} from '../classes/AuthManager';
import Login from "../pages/Login";
import { Snackbar, Alert, IconButton, Collapse, CloseIcon } from "../components/ComponentsIndex";

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
                <Login children={children}/> 
            </>
        );
        
    }
    
};


export default PrivateRoute;