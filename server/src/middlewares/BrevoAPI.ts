import { Request, Response, NextFunction } from 'express';
import { UserDocument } from '../models/user';

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


var forgetPasswordEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

export async function sendForgetEmail(to : UserDocument, otp : String) {
    try {

        forgetPasswordEmail = {
            to: [{
                email: to.email,
                name: to.firstName + " " + to.lastName
            }],
            templateId: 1,
            params: {
                firstName: to.firstName,
                lastName: to.lastName,
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
