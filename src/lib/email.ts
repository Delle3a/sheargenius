
"use server";

import nodemailer from 'nodemailer';

const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;

// We only initialize the transporter if the credentials are provided
const transporter = user && pass ? nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: user,
        pass: pass,
    },
}) : null;

interface SendConfirmationEmailParams {
    to: string;
    name: string;
    token: string;
}

export async function sendConfirmationEmail({ to, name, token }: SendConfirmationEmailParams) {
    // Determine the base URL. Use FIREBASE_STUDIO_PREVIEW_URL which is always available in this environment.
    const baseUrl = process.env.FIREBASE_STUDIO_PREVIEW_URL || 'http://localhost:3000';
    const confirmationUrl = `${baseUrl}/signup/confirm?token=${token}`;
    
    if (!transporter) {
        console.warn("Email server not configured. Skipping sending real email.");
        console.log("Confirmation URL (for simulation):", confirmationUrl);
        // Return a flag indicating that the email was not sent
        return { emailSent: false };
    }


    const mailOptions = {
        from: `Shear Genius <${user}>`,
        to,
        subject: 'Confirmez votre compte Shear Genius',
        html: `
            <h1>Bonjour ${name},</h1>
            <p>Merci de vous être inscrit(e) chez Shear Genius. Veuillez cliquer sur le lien ci-dessous pour confirmer votre compte :</p>
            <a href="${confirmationUrl}" style="background-color: #FFB300; color: #8B4513; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmer mon compte</a>
            <p>Si vous n'avez pas créé de compte, veuillez ignorer cet e-mail.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', to);
        return { emailSent: true };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // In a real app, you'd want more robust error handling, perhaps re-queueing the email.
        throw new Error("Could not send confirmation email.");
    }
}
