const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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

const sendGoodbye = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.TO_AND_FROM_EMAIL,
        subject: 'Bye for now',
        text: `${name}, sorry to see you leave the best app in the world. We know you'll be back ;-)`
        })
        .catch(x => {
            console.log(x)
        });
}

module.exports = {
    sendWelcome,
    sendGoodbye
}