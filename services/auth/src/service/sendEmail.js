import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const emailProviderUrl = process.env.EMAIL_API_URL;
const API_KEY = process.env.EMAIL_API_PASSKEY;

export const sendOtp = async (to, userName, otp) => {
  try {
    const body = `
     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
       <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
         <h1 style="color: #333333; text-align: center;">Welcome to ApnaBazaar !</h1>
         <p style="font-size: 16px; color: #555555; line-height: 1.5;">
           Hi <strong style="color: #007BFF;">${userName}</strong>,
         </p>
         <p style="font-size: 16px; color: #555555; line-height: 1.5;">
           Thank you for signing up! To complete your registration, please use the OTP code below to verify your email address.
         </p>
         <div style="margin: 30px 0; padding: 20px; text-align: center; background: #e9f7fe; border-radius: 8px;">
           <span style="font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 2px;">${otp}</span>
         </div>
         <p style="font-size: 14px; color: #666666; line-height: 1.5;">
           ⚠️ This OTP is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
         </p>
         <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
         <p style="font-size: 14px; color: #888888; line-height: 1.5;">
           Regards,<br/>
           <strong>ApnaBazaar Team</strong><br/>
           <small style="color: #cccccc;">&copy; 2025 ApnaBazaar, All rights reserved.</small>
         </p>
       </div>
     </div>
    `;

    const success = await axios.post(
      emailProviderUrl,
      {
        to,
        subject: "OTP Verification",
        body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return success.data;
  } catch (err) {
    throw err;
  }
};

export const sendPassResetOtp = async (to, userName, otp) => {
  try {
    const body = `
     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
       <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
         <h1 style="color: #333333; text-align: center;">ApnaBazaar Password Reset</h1>
         <p style="font-size: 16px; color: #555555; line-height: 1.5;">
           Hello <strong style="color: #007BFF;">${userName}</strong>,
         </p>
         <p style="font-size: 16px; color: #555555; line-height: 1.5;">
           You requested a password reset. Use the OTP code below to reset your password securely.
         </p>
         <div style="margin: 30px 0; background: #fff8e1; padding: 20px; text-align: center; border-radius: 8px;">
           <span style="font-size: 32px; font-weight: bold; color: #FFC107; letter-spacing: 2px;">${otp}</span>
         </div>
         <p style="font-size: 14px; color: #666666; line-height: 1.5;">
           ⚠️ This OTP is valid for <strong>5 minutes</strong>. If you did not request this, you can safely ignore this email.
         </p>
         <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
         <p style="font-size: 14px; color: #888888; line-height: 1.5;">
           Regards,<br/>
           <strong>ApnaBazaar Team</strong><br/>
           <small style="color: #cccccc;">&copy; 2025 ApnaBazaar, All rights reserved.</small>
         </p>
       </div>
     </div>
    `;

    const success = await axios.post(
      emailProviderUrl,
      {
        to,
        subject: "Password Reset OTP",
        body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return success.data;
  } catch (err) {
    throw err;
  }
};

export const sendDeviceLoginEmail = async (to, userName, deviceInfo) => {
  try {
    const fields = [];

    if (deviceInfo.deviceType) {
      fields.push(
        `<p style="margin:5px 0;"><strong>Device Type:</strong> ${deviceInfo.deviceType}</p>`
      );
    }
    if (deviceInfo.os) {
      fields.push(
        `<p style="margin:5px 0;"><strong>OS:</strong> ${deviceInfo.os}</p>`
      );
    }
    if (deviceInfo.browser) {
      fields.push(
        `<p style="margin:5px 0;"><strong>Browser:</strong> ${deviceInfo.browser}</p>`
      );
    }
    if (deviceInfo.ipAddress) {
      fields.push(
        `<p style="margin:5px 0;"><strong>IP Address:</strong> ${deviceInfo.ipAddress}</p>`
      );
    }
    if (deviceInfo.location && Object.keys(deviceInfo.location).length) {
      const loc = deviceInfo.location;
      const locationHtml = `
        <div style="margin:5px 0;">
          <strong>Location:</strong><br/>
          ${loc.city ? `${loc.city}, ` : ""}
          ${loc.region ? `${loc.region}, ` : ""}
          ${loc.country ? `${loc.country}` : ""}
          ${loc.postal ? ` - ${loc.postal}` : ""}<br/>
          ${
            loc.org
              ? `<span style="color:#777;">ISP: ${loc.org}</span><br/>`
              : ""
          }
          ${
            loc.latitude && loc.longitude
              ? `<a href="https://www.google.com/maps?q=${loc.latitude},${loc.longitude}" target="_blank" style="color:#1a73e8;">View on Map</a>`
              : ""
          }
        </div>
      `;
      fields.push(locationHtml);
    }

    fields.push(
      `<p style="margin:5px 0;"><strong>Login Time:</strong> ${new Date().toLocaleString(
        "en-IN",
        { timeZone: "Asia/Kolkata" }
      )}</p>`
    );

    const body = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff8e1; padding: 40px 20px;">
        <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 8px solid #FFD700;">
          <h2 style="color: #333333; text-align: center;">New Device Login Detected!</h2>
          <p style="font-size: 16px; color: #555555; line-height: 1.5;">
            Hi <strong style="color: #FFA000;">${userName}</strong>,
          </p>
          <p style="font-size: 16px; color: #555555; line-height: 1.5;">
            We noticed a login to your account from a new device. Here are the details:
          </p>
          <div style="margin: 20px 0; padding: 20px; background: #FFF8E1; border-left: 5px solid #FFD700; border-radius: 8px;">
            ${fields.join("")}
          </div>
          <p style="font-size: 16px; color: #555555; line-height: 1.5;">
            If this was you, you can safely ignore this email. If not, we recommend changing your password immediately.
          </p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
          <p style="font-size: 14px; color: #888888; line-height: 1.5;">
            Regards,<br/>
            <strong>ApnaBazaar Security Team</strong><br/>
            <small style="color: #cccccc;">&copy; 2025 ApnaBazaar. All rights reserved.</small>
          </p>
        </div>
      </div>
    `;

    const success = await axios.post(
      emailProviderUrl,
      {
        to,
        subject: "New Device Login Alert",
        body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return success.data;
  } catch (err) {
    throw err;
  }
};
