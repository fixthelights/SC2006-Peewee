import * as React from "react";
import { Navigate } from "react-router-dom";
import { AuthManager} from '../classes/AuthManager';

const auth = new AuthManager()

interface PrivateRouteProps {
    redirectPath?: string;
    children: React.ReactNode;
}

const PrivateRoute = ({ redirectPath = '/', children }: PrivateRouteProps) => {
    const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

    // React.useEffect(() => {
    //     auth.isAuthenticated()
    //         .then(res => {
    //             const isAuthenticated = res.data;
    //             console.log("User login return =", isAuthenticated);
    //             setLoggedIn(isAuthenticated);
    //         })
    //         .catch(error => {
    //             console.error("Error:", error);
    //             // Handle the error, e.g., redirect to an error page
    //         });
    // }, []); // Empty dependency array to run the effect only once

    React.useEffect(() => {
        const isAuthenticated = auth.isAuthenticated();
        setLoggedIn(isAuthenticated);
        console.log("User login return =", isAuthenticated);
    }, []); // Empty dependency array to run the effect only once

    if (loggedIn === null) {
        // Loading state, you can render a loading spinner or some other UI
        return <div>Loading...</div>;
    }

    return loggedIn ? <>{children}</> : <Navigate to={redirectPath} />;
};


export default PrivateRoute;