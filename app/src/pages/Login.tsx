import React, { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {AuthController} from "../classes/AuthController"
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import axios from 'axios'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isValidUser, setIsValidUser] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userList, setUserList] = useState([])

  async function checkValidUser () {
    let validUser = false
    try{
      const response = await axios.get('http://localhost:2000/users') 
      if (response.data["message"] != "Username/Password is invalid"){
        validUser = true;
      }
    }
    catch(error){
      console.log(error)
    }
    return validUser
  };

  const getUserList = async () => {
    const { data } = await axios.get('http://localhost:2000/users');
    setUserList(data);
  };

  useEffect(() => {
    getUserList();
  }, []);

  function checkMatchingUser(): boolean{
    let i = 0;
    let foundMatching = false;
    while (i < userList.length) {
      if (userList[i]["email"]===email && userList[i]["password"]===password){
        foundMatching = true;
      } 
      i++;
    }
    return foundMatching;
  };

  // Handling the email change
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Handling the password change
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault()

    setIsSubmitted(true)

    let userValid = checkMatchingUser()
    console.log(userList)

    if (userValid){
      {navigate("/dashboard")}
    }

    setIsValidUser(userValid);

  }

  const Message = () => {
    if (isSubmitted){
      if (!isValidUser) {
        return <Alert severity="info">Invalid User.</Alert>
      }
      return null;
    }
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
              <Grid item sx={{pt:2}}>
                <Message />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}