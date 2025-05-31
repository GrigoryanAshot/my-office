import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'myofficearmenia@gmail.com',
      subject: 'Դուք ունեք նոր պատվեր զանգի համար',
      text: `
        Անուն: ${name}
        Հեռախոս: ${phone}
      `,
      html: `
        <h3>Նոր պատվեր զանգի համար</h3>
        <p><strong>Անուն:</strong> ${name}</p>
        <p><strong>Հեռախոս:</strong> ${phone}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 