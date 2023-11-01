import { Request, Response, NextFunction } from 'express';
import { UserDocument } from '../models/user';
require('dotenv').config();

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_KEY;
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


var forgetPasswordEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

export async function sendForgetEmail(to : UserDocument, otp : String) {
    try {

        forgetPasswordEmail = {
            to: [{
                email: to.email,
            }],
            templateId: 1,
            params: {
                otp: otp
            },
            headers: {
                'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
            }
        };

        console.log(forgetPasswordEmail);
        
        const email = await apiInstance.sendTransacEmail(forgetPasswordEmail);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent",error);
    }
};