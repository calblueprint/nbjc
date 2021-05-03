// TO-DO add more use cases as necessary
export enum NotificationType {
    ForgotPassword = "FORGOT_PASSWORD_REQUEST",
    ModeratorInvite = "MODERATOR_INVITATION",
    ApplicationStatus = "APPLICATION_STATUS",
    VerificationLink = "VERIFICATION_REQUEST",
}

type BaseNotificationMeta = {
    recipient: string,
};

type NotificationSpecificMeta = {[type in NotificationType]: unknown} & {
    [NotificationType.ForgotPassword]: {
      resetCode: string;
    };
    [NotificationType.ModeratorInvite]: {
      inviteCode: string;
    };
    [NotificationType.ApplicationStatus]: {
      applicationLink: string;
    };
    [NotificationType.VerificationLink]: {
      verificationCode: string;
    };
};

export type NotificationMeta = {
    [type in NotificationType] : BaseNotificationMeta &
        NotificationSpecificMeta[type];
};

export type NotificationResult = {
    ok: boolean;
}