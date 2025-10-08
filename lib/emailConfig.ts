import nodemailer from 'nodemailer';

export interface EmailConfig {
  service: 'gmail' | 'sendgrid' | 'mailgun';
  user: string;
  pass: string;
  from: string;
}

export function createEmailTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  const config: EmailConfig = {
    service: emailService as 'gmail' | 'sendgrid' | 'mailgun',
    user: emailUser,
    pass: emailPass,
    from: emailUser,
  };

  // Create transporter based on service
  switch (config.service) {
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
        // Production settings for Gmail
        secure: process.env.NODE_ENV === 'production',
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });

    case 'sendgrid':
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: config.pass, // SendGrid API key
        },
      });

    case 'mailgun':
      return nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

    default:
      throw new Error(`Unsupported email service: ${config.service}`);
  }
}

export async function sendVerificationEmail(to: string, code: string) {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Ադմին մուտքի ստուգման կոդ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Ադմին մուտքի ստուգման կոդ</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px; color: #555;">
            Ձեր ստուգման կոդը՝ <strong style="color: #007bff; font-size: 18px;">${code}</strong>
          </p>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center;">
          Այս կոդը վավեր է 5 րոպե: Եթե դուք չեք հավանում այս հաղորդագրությունը, խնդրում ենք անտեսել այն:
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
} 