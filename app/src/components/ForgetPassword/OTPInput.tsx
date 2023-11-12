import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import { RecoveryContext, delayTime } from '../../pages/ForgetPassword';
import axios, { AxiosResponse } from 'axios';
import { MuiOtpInput } from 'mui-one-time-password-input'
import {createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Alert, Grid, Paper, Link, Photo} from '../ComponentsIndex'

const defaultTheme = createTheme();


export default function OTPInput() {

  const navigate = useNavigate();

  const [enteredOTP, setEnteredOTP] = useState('');
  const [isCorrectOTP, setIsCorrectOTP] = useState({} as boolean)
  const [isOTPSent, setIsOTPSent] = useState(false);
  const { email, otp, setOTP, setPage } = useContext(RecoveryContext)
  const [timerCount, setTimer] = React.useState(60);
  const [disable, setDisable] = useState(true);

  // Handle changes to OTP Input
  const handleOTPChange = (newInput : string) => {
    setEnteredOTP(newInput);
  };
  
  // Verify OTP
  function verifyOTP(event: React.MouseEvent) {
    setIsOTPSent(true);
    event.preventDefault();
    if (enteredOTP === otp) {
      setIsCorrectOTP(true);
      setTimeout(()=>setPage("reset"),delayTime);
      return;
    }
    setIsCorrectOTP(false);
    return;
  }

  // Resend OTP to email with 60s cooldown
  function resendOTP() {
    if (disable) return;
    axios.post(`https://${process.env.REACT_APP_SERVER_URL}/users/forget-password`, { email : email })
    .then((response : AxiosResponse) => setOTP(response?.data.otp.token))
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
    }, 1000); 
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


  const OTPMessage = () => {
    if (isOTPSent && !isCorrectOTP) {
      return <Alert severity="error"> Wrong OTP entered, please try again </Alert> ;
    } else if (isOTPSent && isCorrectOTP) {
      return <Alert severity="success"> Verified, please reset your password </Alert> ;
    }
    return null;
  };

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
                  <OTPMessage/>
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
                </Grid>
              </Box>
              </Box>
              </Grid>
              </Grid>
        </ThemeProvider>
    );
  
};
