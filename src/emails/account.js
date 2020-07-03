const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: process.env.TO_AND_FROM_EMAIL,
    from: process.env.TO_AND_FROM_EMAIL,
    subject: 'Test subject',
    text: 'Test email text',
    html: '<strong>Test html</strong>',
  };
  sgMail.send(msg).catch(x => {
      console.log(x)
  });