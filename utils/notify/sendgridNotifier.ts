import sendgrid from '@sendgrid/mail';
import {
  NotificationMeta,
  NotificationResult,
  NotificationType,
} from './types';

export default class SendgridNotifier {
  // TO-DO Create Sengrid templates for all NotificationTypes
  templates: Record<NotificationType, string> = {
    [NotificationType.ForgotPassword]: 'd-01b1f3aef2f24ad79f887faf5266f7d1',
    [NotificationType.ModeratorInvite]: 'd-af3b97c7c478424cbdd73a44a4e9b97c',
    [NotificationType.ApplicationStatus]: '',
    [NotificationType.VerificationLink]: 'd-73e65be7f45242df847aee5df577ab6e',
  };

  async setup(): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable not set!');
    }
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendNotification<T extends NotificationType>(
    type: T,
    meta: NotificationMeta[T]
  ): Promise<NotificationResult> {
    await sendgrid.send({
      to: meta.recipient,
      from: 'nbjc@calblueprint.org',
      templateId: this.templates[type],
      dynamicTemplateData: meta,
    });

    return { ok: true } as NotificationResult;
  }
}
