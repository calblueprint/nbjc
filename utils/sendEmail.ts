import sendgrid from '@sendgrid/mail';

const sendEmail = async (emailSubject: string, recipient: string, content: string) => {
    if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY environment variable is not set');
    }
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    await sendgrid.send({
        to: recipient,
        from: 'nbjc@calblueprint.org',
        text: content,
        subject: emailSubject,
    });
};

export default sendEmail;