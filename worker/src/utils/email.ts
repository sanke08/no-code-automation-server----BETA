import nodemailer from "nodemailer";



const transport = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});


export const sendEmail = async (to: string, body: string) => {
    await transport.sendMail({
        from: process.env.MY_EMAIL,
        sender: process.env.MY_EMAIL,
        to,
        subject: "Hello from Zapier",
        text: body
    })


}