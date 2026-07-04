const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendRegistrationEmail = async (userEmail, name) => {
    const subject = 'Welcome to Backend Ledger';

    const text = `Hello ${name},\n\nThank you for your registration at Backend Ledger. We are excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;

    const html = `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering at <strong>Backend Ledger</strong>. We are excited to have you on board!</p>
            <br />
            <p>Best regards,<br /><em>The Backend Ledger Team</em></p>
        </div>
    `;

    // Invoking the wrapped abstraction engine seamlessly
    await sendEmail(userEmail, subject, text, html);
};

const sendTransactionEmail = async (userEmail, name, amount, toAccount) => {
    const subject = `Transaction Successfull`;
    const text = `Hello ${name},\n\n Your transaction of $${amount} to account ${toAccount} was successful.\n\nBest Regards,\n The Backend Ledger Team`;
    const html = `<p>Hello ${name}, </p><p>Your transaction of amount $${amount} to account ${toAccount} was successful.</p><p>Best Regards, <br /><em>The Backend Ledger Team</em></p>`;

    await sendEmail(userEmail, subject, text, html);
}

const sendTransactionFailedEmail = async (userEmail, name, amount, toAccount) => {
    const subject = `Transaction Failed`;
    const text = `Hello ${name},\n\n Your transaction of $${amount} to account ${toAccount} is Failed.`;
    const html = `<p>Hello ${name}, </p><p>Your transaction of amount $${amount} to account ${toAccount} has failed.</p><p>Best Regards, <br /><em>The Backend Ledger Team</em></p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail
};