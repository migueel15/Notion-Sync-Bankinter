import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const sendMail = async (url: string) => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GOOGLE_EMAIL,
			pass: process.env.GOOGLE_PASSWORD,
		},
	})

	const mailOptions = {
		from: process.env.GOOGLE_EMAIL,
		to: process.env.GOOGLE_EMAIL,
		subject: "Sync Bank with Notion",
		html: `
			<p>Click <a href="${url}">here</a> to validate the requisition</p>
		`,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error("Error sending email: ", error)
		} else {
			console.log("Email sent: ", info.response)
		}
	})
}
