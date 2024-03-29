import React from 'react';
import { useState , useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Alert, Grid, Paper, Avatar, TextField, Link, LockOutlinedIcon, Photo} from '../components/ComponentsIndex';
import { AuthManager } from '../classes/AuthManager';


const authController = new AuthManager();

const defaultTheme = createTheme();

interface LoginProps {
  children?: React.ReactNode;
}

Login.propTypes = {
  children: PropTypes.node,
}

export default function Login({ children }: LoginProps) {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isValidUser, setIsValidUser] = useState({} as boolean);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect( () => {
    handleLogin();
  },[isSubmitted]);

  const handleLogin = async () => {
    try {
      // If user not logged in, make login request
      if (!authController.isAuthenticated()) {
        // Check if email or password is null
        if (email === "" || password === "") {throw new Error("User not logged in")}
        
        // Make login request to server
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/login`, {
          email: email,
          password: password
        })

        // Get JWT from backend
        const userJwt = JSON.parse(JSON.stringify(response.data.token));

        // Store User JWT into local storage
        localStorage.setItem('token', JSON.stringify(userJwt));

      }

      setIsValidUser(true);
      if (children) {
        return (
          <>
            {children}
            {reloadPage()}
          </>
        );
      }
      navigate("/dashboard");

    } catch (error : any) {
      if (error.response?error.response.status:null === 401) {
        setIsValidUser(false);
      }
    }
  }
  
  const handleSubmit = (event : any) => {
    event.preventDefault(); 
    setIsSubmitted(true);
    handleLogin();
  };

  // Handling the email change
  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  // Handling the password change
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
    

  function reloadPage() {
    // The last "domLoading" Time
    var currentDocumentTimestamp = new Date(performance.timing.domLoading).getTime();
    // Current Time 
    var now = Date.now();
    // Allow reload every 1 second
    var oneSecondDelay = currentDocumentTimestamp + 1000;
    if (now > oneSecondDelay) {
      window.location.reload();
    } else {}
  }

  const Message = () => {
    if (isSubmitted){
      if (!isValidUser) {
        return <Alert severity="info">Invalid User or Password</Alert>
      }
      return null;
    }
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Photo})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container spacing={2}>
            <Grid item xs={12}>
            <Message/>
            </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate("/forgetpassword")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/register")}>
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      </Grid>
    </ThemeProvider>
  );
}

