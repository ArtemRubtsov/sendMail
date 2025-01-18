import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ message: "Все поля обязательны для заполнения." }),
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailContent = `
      <p>Сообщение от: ${name}</p>
      <p>Email: ${phone}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: "Новая заявка на запись",
      html: emailContent,
    });

    return new Response(
      JSON.stringify({ message: "Email успешно отправлен!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка отправки email:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при отправке email." }),
      { status: 500 }
    );
  }
}