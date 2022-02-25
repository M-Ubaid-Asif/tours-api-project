const nodemailer = require('nodemailer')


const sendEmail =async options =>{
    // create a transporter
    console.log('node mailer is called')
    console.log('waiting for email')
    const transporter = nodemailer.createTransport({
        host:"smtp.mailtrap.io",
        port:465,
        secure:false,
        auth:{
            user:'e41a463a08eaa9',
            pass:'babc89e09e86a4'
        },
        tls:{
            rejectUnauthorized:false
        }
        // activate in gmail 'less secure app' option
        
    })
    console.log(`${options.email}   ${options.subject}  ${options.message}`)
    // define the email options
    const mailOptions={
        from:"ubaid asif <hello@gmail.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
        // html
    }
    console.log('hahah mail option')

    // send the email
    await transporter.sendMail(mailOptions)
    console.log('ubaid')
}


module.exports = sendEmail