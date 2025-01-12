import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { name, email, message, specialist, date, time } = await req.json();

    if (!name || !email || !message || !specialist || !date || !time) {
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
      <p>Email: ${email}</p>
      <p>Выбранный специалист: ${specialist}</p>
      <p>Дата: ${date}</p>
      <p>Время: ${time}</p>
      <p>Сообщение: ${message}</p>
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

