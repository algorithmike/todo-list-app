const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//     to: process.env.TO_AND_FROM_EMAIL,
//     from: process.env.TO_AND_FROM_EMAIL,
//     subject: 'Test subject',
//     text: 'Test email text',
//     html: '<strong>Test html</strong>',
// };

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.TO_AND_FROM_EMAIL,
        subject: 'Welcome to the Task App',
        text: `Welcome to the Task App, ${name}`
        })
        .catch(x => {
            console.log(x)
        });
}

module.exports = sendWelcome