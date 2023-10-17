import React, { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import {AuthManager} from "../classes/AuthManager"
import Alert from '@mui/material/Alert';
import 'reactjs-popup/dist/index.css';
import { useState, useEffect } from 'react';
import axios from 'axios'


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
const authManager = new AuthManager()

export default function Register() {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for checking the errors
  const [isInvalidEmailFormat, setIsInvalidEmailFormat] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isInvalidPassword, setIsInvalidPssword] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccessfulRegister, setIsSuccessfulRegister] = useState(false)
  const [userList, setUserList] = useState([])

  const getUserList = async () => {
    const { data } = await axios.get('http://localhost:2000/users');
    setUserList(data);
  };

  useEffect(() => {
    getUserList();
  }, []);

  function checkMatchingEmail(): boolean{
    let i = 0;
    let foundMatching = false;
    while (i < userList.length) {
      if (userList[i]["email"]===email && foundMatching===false){
        foundMatching = true;
      } 
      i++;
    }
    return foundMatching;
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    setIsSubmitted(true);

    let userExists = false;
    let emailFormatValid = authManager.validateEmailAddressFormat(email)
    let passwordValid = authManager.checkPasswordValidity(password)

    if (emailFormatValid){
      userExists = checkMatchingEmail()
    }

    // save user in database
    if (!userExists && passwordValid){
      axios.post('http://localhost:2000/users/register', {
        email: email,
        password: password,
      })
      .then((res)=> console.log(res.data))
      .then ((res) => setIsSuccessfulRegister(true))
      .catch(function(error) {
        console.log(error);
        setIsSuccessfulRegister(false)
      })
    }

    // save validity states for display of corresponding message
    setIsExistingUser(userExists);
    setIsInvalidEmailFormat(!emailFormatValid);
    setIsInvalidPssword(!passwordValid);
  }

  // message display depending on validity

  const EmailStatusMessage = () => {
    if (isSubmitted){
      if (isInvalidEmailFormat) {
        return <Alert severity="info"> Invalid email. </Alert>
      }
      if (isExistingUser){
        return <Alert severity="info"> Existing user. </Alert>
      }
      return null
    }
    return null; 
  }

  const PasswordStatusMessage = () => {
    if (isSubmitted){
      if (isInvalidPassword) {
        return <Alert severity="info">Password does not meet the requirements.</Alert>
      }
     return null;
    }
    return null;
  }

  const RegistrationStatusMessage = () => {
    if (isSubmitted){
      if (!isExistingUser && !isInvalidPassword) {
        return <Alert severity="info">Registration is successful.</Alert>
      }
      if (!isExistingUser && !isInvalidPassword && !isSuccessfulRegister){
        return <Alert severity="info">Error in Registration</Alert>
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
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleEmail}
                />
              </Grid>
              <Grid item xs={12}>
              <EmailStatusMessage />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handlePassword}
                  helperText="Password must be at least 8 characters long, contain 1 uppercase character, 1 lowercase character and 1 special character"
                />
              </Grid>
              <Grid item xs={12}>
              <PasswordStatusMessage/>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate("/forgetpassword")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                  {"Already have an account? Log in"}
                </Link>
              </Grid>
              <Grid item sx={{pt:2}}>
                <RegistrationStatusMessage/>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}