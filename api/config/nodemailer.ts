import pug from "pug";
import nodemailer from "nodemailer";
import { AppConfig } from "./index";

const sendEmail = async (
    emailData: Record<string, string>,
    pugTemplatePath: string
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: AppConfig.NODEMAILER_USER_EMAIL,
            pass: AppConfig.NODEMAILER_USER_PASSWORD,
        },
    });

    // Compile a Pug template from a file to a function
    const compiledFunction = pug.compileFile(pugTemplatePath);
    // Render the function
    const emailHTML = compiledFunction(emailData);

    const result = await transporter.sendMail({
        from: {
            name: "BuyAfrica",
            address: AppConfig.NODEMAILER_USER_EMAIL,
        },
        to: emailData.email,
        subject: emailData.subject,
        html: emailHTML,
    });

    return result;
};

export default sendEmail;
