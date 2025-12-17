import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  message: z.string().min(10).max(1000),
  productId: z.string().optional(),
  quantity: z.number().min(1).optional(),
});

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 1000,
  rateLimit: 3,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.parse(body);
    
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'myofficearmenia@gmail.com',
      subject: `New ${validatedData.productId ? 'Order' : 'Contact'} Request from ${validatedData.name}`,
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Phone: ${validatedData.phone}
        ${validatedData.productId ? `Product ID: ${validatedData.productId}` : ''}
        ${validatedData.quantity ? `Quantity: ${validatedData.quantity}` : ''}
        Message: ${validatedData.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New ${validatedData.productId ? 'Order' : 'Contact'} Request</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            ${validatedData.productId ? `<p><strong>Product ID:</strong> ${validatedData.productId}</p>` : ''}
            ${validatedData.quantity ? `<p><strong>Quantity:</strong> ${validatedData.quantity}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>This email was sent from the contact form on www.my-office.am</p>
          </div>
        </div>
      `,
    };

    // Send email with timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 5000)
    );
    
    await Promise.race([sendPromise, timeoutPromise]);

    // Send confirmation email to customer
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: validatedData.email,
      subject: 'Thank you for contacting My Office Armenia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for contacting My Office Armenia</h2>
          <p>Dear ${validatedData.name},</p>
          <p>We have received your ${validatedData.productId ? 'order' : 'message'} and will get back to you shortly.</p>
          <p>Here's a summary of your request:</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            ${validatedData.productId ? `<p><strong>Product ID:</strong> ${validatedData.productId}</p>` : ''}
            ${validatedData.quantity ? `<p><strong>Quantity:</strong> ${validatedData.quantity}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <ul>
            <li>Email: myofficearmenia@gmail.com</li>
            <li>Phone: [Your Phone Number]</li>
            <li>Address: [Your Address]</li>
          </ul>
          <p>Best regards,<br>My Office Armenia Team</p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 