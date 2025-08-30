import nodemailer from "nodemailer";

export async function sendEmail(Receiver, subject, html, attachments) {
  try {
    if (!Receiver) throw new Error("Receiver email is required");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.verify(); // optional, but useful in dev

    const info = await transporter.sendMail({
      from: `"Lgmada" <${process.env.EMAIL_SENDER}>`,
      to: Receiver,
      subject: subject || "Hello",
      html: html || "<h1>Hello</h1>",
      attachments: attachments || [],
    });

    return info.accepted.length > 0;
  } catch (err) {
    console.error("Email sending failed:", err.message);
    return false;
  }
}
