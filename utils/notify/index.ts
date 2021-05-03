import SendgridNotifier from './sendgridNotifier';

const EmailNotifier = new SendgridNotifier();

async function setupNotifier(): Promise<void> {
    try {
        EmailNotifier.setup();
    } catch (err) {
        console.error('Email Notifier failed to setup', err);
    }
}

setupNotifier();

export default EmailNotifier;