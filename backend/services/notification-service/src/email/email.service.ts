/* eslint-disable @typescript-eslint/no-unsafe-call */
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import {
  DiscountEmailPayload,
  WelcomeEmailPayload,
} from '../types/email.types';

/**
 * Create SMTP transporter
 */
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  payload: WelcomeEmailPayload,
): Promise<void> {
  const { email, name } = payload;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome!',
    text: `Hello ${name}, welcome to our platform!`,
  });
}

export async function sendDiscountEmail(
  payload: DiscountEmailPayload,
): Promise<void> {
  const { email, code } = payload;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome!',
    text: `Hello ${code}, welcome to our platform!`,
  });
}
