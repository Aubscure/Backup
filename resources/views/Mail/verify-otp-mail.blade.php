<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ManPro Management - OTP Verification</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="margin: 10px 5% 10px; background-color: #177604; border-radius: 10px; padding: 5px;">
        <div style="justify-content: center; align-items: center; text-align: center; margin: 10px">
            <img src="https://manpromanagement.com/images/ManPro.png" style="width: 15%; border: 3px solid white; border-radius: 10px; background-color: white;">
        </div>
        <div style="background-color: white; border-radius: 5px; overflow: hidden;">
            <!-- Banner Image -->
            <div style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="https://manpromanagement.com/images/ManPro-HRMS-Email-Banner.png" style="width: 100%; display: block; height: auto;">
            </div>

            <table width="100%" border="0" cellspacing="0" cellpadding="20" style="color: #5a5f61; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <tr>
                    <td>
                        <div style="font-size: 16px; line-height: 1.6;">
                            <div><strong>Dear {{ $user->firstname }} {{ $user->lastname }},</strong></div>
                            <div><br></div>
                            <div>
                                We received a login request for your account. To verify your identity, please use the following OTP verification code.
                            </div>
                            <div><br></div>

                            <!-- OTP Section -->
                            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #177604; text-align: center;">
                                <div style="font-size: 14px; font-weight: bold; color: #177604; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</div>
                                <div style="font-size: 36px; font-weight: bold; color: #177604; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0;">
                                    {{ $otp }}
                                </div>
                            </div>

                            <!-- Security Notice -->
                            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                                <div style="font-size: 16px; font-weight: bold; color: #d97706; margin-bottom: 10px;">⚠️ Security Notice</div>
                                <div style="font-size: 14px; color: #92400e;">
                                    <p style="margin: 8px 0;">• This OTP is valid for a limited time period</p>
                                    <p style="margin: 8px 0;">• Do not share this code with anyone</p>
                                    <p style="margin: 8px 0;">• If you did not request this verification, please ignore this email</p>
                                </div>
                            </div>

                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <div style="font-size: 13px; color: #6b7280;">
                                    This is an automated message from ManPro HRMS. Please do not reply to this email.
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <div style="text-align: center; padding: 20px; color: #fff; background-color: #177604; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6;">
                Your Gateway to Innovative Management Solutions for Businesses in the Philippines<br>
                <a href="mailto:support@manpro.ph" style="color: white; text-decoration: none;">support@manpro.ph</a><br>
                <a href="https://manpro.ph/" style="color: white; text-decoration: none;">https://manpro.ph/</a>
            </div>
        </div>
    </div>
</body>

</html>