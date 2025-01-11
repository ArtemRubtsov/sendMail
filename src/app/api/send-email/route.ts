import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req) {
  const { name, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    // secure: true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`, 
      to: process.env.EMAIL_USER, 
      subject: "Новое сообщение от пользователя", 
      text: message, 
    });

    return new Response(JSON.stringify({ message: "Email отправлен!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Ошибка отправки email:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при отправке email." }),
      { status: 500 }
    );
  }
}
