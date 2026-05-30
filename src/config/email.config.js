import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API_orderapp1) {
  throw new Error("Please Provide RESEND API KEY in .env !!");
}
const resend = new Resend(process.env.RESEND_API_orderapp1);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "OrderApp <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log(error);
  }
};

// (async function () {
//   const { data, error } = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["delivered@resend.dev"],
//     subject: "Hello World",
//     html: "<strong>It works!</strong>",
//   });

//   if (error) {
//     return console.error({ error });
//   }

//   console.log({ data });
// })();

export { sendEmail };
