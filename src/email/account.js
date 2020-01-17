const sgMail = require('@sendgrid/mail');
const APIKey = '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'

sgMail.setApiKey(APIKey);
const sendWelcomeEmail = () => {
    sgMail.send({
        to: 'bhargavg445@gmail.com',
        from: 'bhargavr445@siraconsultinginc.com',
        subject: 'Test',
        text: `I Hope this ${email} reaches you.`
    });
}

module.exports = {
    sendWelcomeEmail
}

