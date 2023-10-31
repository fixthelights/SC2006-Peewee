import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { AuthManager} from '../../classes/AuthManager';
import { RecoveryContext } from '../../pages/PasswordRecovery';
import axios from 'axios';
import { MuiOtpInput } from 'mui-one-time-password-input'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


export default function OTPInput() {

  // Importing States
  const navigate = useNavigate();

  const [enteredOTP, setEnteredOTP] = useState('');
  const [isOTPValid, setIsOTPValid] = useState(false)
  const [isOTPSent, setIsOTPSent] = useState(false);
  const { email, otp, setPage } = useContext(RecoveryContext)
  const [timerCount, setTimer] = React.useState(60);
  const [disable, setDisable] = useState(true);

  // Handle changes to OTP Input
  const handleOTPChange = (newInput : string) => {
    setEnteredOTP(newInput);
  };
  
  // Verify OTP
  function verifyOTP() {
    console.log(enteredOTP, otp);
    if (enteredOTP === otp) {
      setPage("reset");
      return;
    }
    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
  }

  // Resend OTP to email with 60s cooldown
  function resendOTP() {
    if (disable) return;
    axios.post('http://localhost:2000/users/forget-password', { email : email })
    .then(() => setDisable(true))
    .then(() => alert("A new OTP has succesfully been sent to your email."))
    .then(() => setTimer(60))
    .catch(console.log);
  }

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);


  // Field type validation for OTP input
  function matchIsNumeric(text : any) {
    const isNumber = typeof text === 'number';
    const isString = typeof text === 'string';
    return (isNumber || (isString && text !== '')) && !isNaN(Number(text))
  }
  const validateChar = (value: any) => {
    return matchIsNumeric(value)
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
              backgroundColor: 'white',
              borderRadius:'6px',
              padding: '22px'
            }}
          >
            <Typography component="h1" variant="h5" fontStyle={"semibold"}>
                Enter Security Code
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="body1" align='center'>
                        We sent your code to: <br></br> <b>{email.toUpperCase()}</b>
                    </Typography>
                    <Typography variant="body2" fontStyle='italic' fontSize='12px' align='center'>
                        Check your spam folder if you do not see the email
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <MuiOtpInput 
                        value={enteredOTP} 
                        onChange={handleOTPChange} 
                        validateChar={validateChar}
                        length={6}
                        TextFieldsProps={{ placeholder: '-' }}
                    />
                </Grid>
                <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick = {verifyOTP}
                >
                  Confirm
                </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align='center' fontSize={'18px'} color={"#404040"}>
                    Didn't recieve code?
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Link
                    align = "center"
                    style={{
                        color: "gray",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                    }}
                    onClick={() => resendOTP()}
                    >    
                        {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </Link>
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                      Log In
                    </Link>
                  </Grid>
                </Grid>
                <Grid item>
                </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    );
  
};
