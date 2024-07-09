import nodemailer  from 'nodemailer';

export class MailSender {

    init(transportOpt, log) {
        this.transporter = nodemailer.createTransport(transportOpt);
        this.log = log;
    }

    async sendEmail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.log.info(`Message sent: ${info.messageId}`);
            this.log.info(`Message:${mailOptions.text}`);
        } catch(error) {
            this.log.error(`Error sending email:${error}`);
            this.log.error(`Error message:${mailOptions.text}`);
            throw error;
        }
    }
}