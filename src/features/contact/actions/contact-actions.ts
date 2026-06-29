"use server"

import { customerAction } from "@/shared/lib/actions";
import { ContactInput, contactSchema } from "../schemas/contact-schema";
import { AppError } from "@/shared/lib/errors";
import { resend } from "@/lib/resend";

const contactEmail = process.env.CONTACT_EMAIL;

export const sendContactFormAction = customerAction(async (data: ContactInput) => {
    const zodResponse = contactSchema.safeParse(data);
    if (!zodResponse.success) {
        throw new AppError("Invalid form data");
    }

    const response = await resend.emails.send({
        from: "contact-form@mail.julio-zavala.me",
        to: contactEmail!,
        subject: "New contact form submission",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Submission</title>
</head>
<body style="background-color: #fbf8f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; padding: 40px 10px; margin: 0; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto;">
        
        <!-- Subtle Context Pill Header -->
        <tr>
            <td style="text-align: center; padding-bottom: 20px;">
                <span style="background-color: #ebdcd9; color: #3b2e2f; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; display: inline-block;">
                    Workspace Notification
                </span>
            </td>
        </tr>
        
        <!-- Principal White Card Container -->
        <tr>
            <td style="background-color: #ffffff; padding: 36px; border-radius: 12px; border: 1px solid #ebdcd9; box-shadow: 0 4px 12px rgba(59, 46, 47, 0.02);">
                <h1 style="font-size: 20px; font-weight: 700; color: #3b2e2f; margin: 0 0 4px 0; letter-spacing: -0.01em;">New Inbound Message</h1>
                <p style="font-size: 14px; color: #736162; margin: 0 0 28px 0;">A user has submitted a request via the public contact interface.</p>
                
                <!-- Metadata Identity Rows -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #fbf8f7; border-radius: 8px; border: 1px solid #ebdcd9;">
                    <tr>
                        <td style="padding: 14px 16px; border-bottom: 1px solid #ebdcd9; font-size: 13px; font-weight: 600; color: #736162; width: 25%; text-transform: uppercase; letter-spacing: 0.04em;">Sender</td>
                        <td style="padding: 14px 16px; border-bottom: 1px solid #ebdcd9; font-size: 14px; color: #3b2e2f; font-weight: 500;">${zodResponse.data.name} ${zodResponse.data.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #736162; text-transform: uppercase; letter-spacing: 0.04em;">Email</td>
                        <td style="padding: 14px 16px; font-size: 14px; color: #c57787; font-weight: 500;">
                            <a href="mailto:${zodResponse.data.email}" style="color: #c57787; text-decoration: none;">${zodResponse.data.email}</a>
                        </td>
                    </tr>
                </table>

                <!-- Content Message Box -->
                <p style="font-size: 12px; font-weight: 700; color: #736162; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Message Content</p>
                <div style="background-color: #ffffff; border-left: 3px solid #c57787; padding: 4px 0 4px 16px; margin: 0 0 12px 0;">
                    <p style="font-size: 15px; line-height: 1.6; color: #3b2e2f; margin: 0; white-space: pre-wrap; font-style: italic;">"${zodResponse.data.message}"</p>
                </div>
            </td>
        </tr>
        
        <!-- Platform Footprint -->
        <tr>
            <td style="text-align: center; padding-top: 24px;">
                <p style="font-size: 11px; color: #736162; margin: 0; line-height: 1.4; letter-spacing: 0.01em;">
                    Automated delivery by <strong>Manita de Gato</strong> Core Engine.<br>
                    Replies sent to this email wrapper will automatically route back to the client.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `
    })

    if (response.error) {
        console.error("Failed to send email:", response.error);
        throw new AppError("Failed to send email");
    }
    console.error("Email sent successfully:", response.data);
    return "Email sent successfully";
})