import { Appointment } from '@/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const from = 'Manita de Gato <hola@julio-zavala.me>'; // Branded sender

/**
 * Formats a Drizzle ISO timestamp string into a friendly localized date/time string.
 */
function formatLocaleDate(isoString: string): { dateStr: string; timeStr: string } {
    try {
        const date = new Date(isoString);

        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Mexico_City'
        });

        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Mexico_City'
        });

        return { dateStr, timeStr };
    } catch {
        return { dateStr: isoString, timeStr: '' };
    }
}

export async function sendConfirmationEmail(
    to: string,
    appointment: Appointment
) {
    // 1. Process Date and Time allocations
    const { dateStr, timeStr } = formatLocaleDate(appointment.startTime);
    const { timeStr: endTimeStr } = formatLocaleDate(appointment.endTime);

    // 2. Compute financial sums securely
    const basePrice = parseFloat(appointment.servicePriceSnapshot || '0.00');
    const additionalPrice = parseFloat(appointment.adittionalPrice || '0.00');
    const totalPrice = (basePrice + additionalPrice).toFixed(2);

    // 3. Dynamic WhatsApp confirmation bridge builder
    const whatsappBaseUrl = "https://wa.me/521234567890"; // Replace with your company phone
    const whatsappMessage = encodeURIComponent(
        `Hi Manita de Gato team! I'm confirming my appointment for ${appointment.serviceNameSnapshot} on ${dateStr} at ${timeStr}.`
    );
    const confirmationUrl = `${whatsappBaseUrl}?text=${whatsappMessage}`;

    try {
        await resend.emails.send({
            from,
            to,
            subject: `Appointment Confirmed: ${appointment.serviceNameSnapshot || 'Your Reservation'}`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Appointment Confirmation</title>
</head>
<body style="background-color: #fbf8f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; padding: 40px 10px; margin: 0; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto;">
        
        <tr>
            <td style="text-align: center; padding-bottom: 24px;">
                <h2 style="font-size: 22px; font-weight: bold; letter-spacing: 0.05em; color: #3b2e2f; margin: 0; text-transform: uppercase;">Manita de Gato</h2>
            </td>
        </tr>
        
        <tr>
            <td style="background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #ebdcd9; box-shadow: 0 4px 12px rgba(59, 46, 47, 0.03);">
                <h1 style="font-size: 24px; font-weight: 700; color: #3b2e2f; margin: 0 0 8px 0;">Your appointment is set!</h1>
                <p style="font-size: 15px; line-height: 1.5; color: #736162; margin: 0 0 32px 0;">
                    Hi ${appointment.customerNameSnapshot || 'Valued Client'}, thank you for booking with us. Below you will find your complete reservation summary.
                </p>
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; width: 35%; font-size: 14px; font-weight: 600; color: #736162; text-transform: uppercase; letter-spacing: 0.05em;">Service</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; font-size: 16px; color: #3b2e2f; font-weight: 500;">${appointment.serviceNameSnapshot || 'General Booking'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; font-size: 14px; font-weight: 600; color: #736162; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; font-size: 16px; color: #3b2e2f;">${dateStr}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; font-size: 14px; font-weight: 600; color: #736162; text-transform: uppercase; letter-spacing: 0.05em;">Time Window</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #ebdcd9; font-size: 16px; color: #3b2e2f;">${timeStr} - ${endTimeStr}</td>
                    </tr>
                </table>

                <div style="background-color: #fbf8f7; border-radius: 8px; padding: 20px; margin-bottom: 32px; border: 1px dashed #ebdcd9;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #3b2e2f; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Cost Breakdown</h3>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="font-size: 14px; color: #736162; padding: 4px 0;">Base Service Price</td>
                            <td style="font-size: 14px; color: #3b2e2f; text-align: right; padding: 4px 0;">$${basePrice.toFixed(2)}</td>
                        </tr>
                        ${additionalPrice > 0 ? `
                        <tr>
                            <td style="font-size: 14px; color: #736162; padding: 4px 0;">Additional Add-ons</td>
                            <td style="font-size: 14px; color: #3b2e2f; text-align: right; padding: 4px 0;">$${additionalPrice.toFixed(2)}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="font-size: 15px; font-weight: 700; color: #3b2e2f; padding: 12px 0 0 0; border-top: 1px solid #ebdcd9;">Estimated Total</td>
                            <td style="font-size: 18px; font-weight: 700; color: #c57787; text-align: right; padding: 12px 0 0 0; border-top: 1px solid #ebdcd9;">$${totalPrice}</td>
                        </tr>
                    </table>
                </div>
                
                <p style="font-size: 15px; line-height: 1.5; color: #3b2e2f; margin: 0 0 16px 0; text-align: center;">
                    Need to secure your slot quickly or talk to your specialist? Confirm your attendance directly with our reception team via WhatsApp:
                </p>
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; text-align: center;">
                    <tr>
                        <td>
                            <a href="${confirmationUrl}" target="_blank" style="background-color: #c57787; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 4px rgba(197, 119, 135, 0.2);">
                                Confirm Attendance via WhatsApp
                            </a>
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 12px; line-height: 1.5; color: #736162; margin: 24px 0 0 0; text-align: center;">
                    If you need to reschedule or cancel your visit, please contact our support desk at least 24 hours prior to your scheduled block.
                </p>
            </td>
        </tr>
        
        <tr>
            <td style="text-align: center; padding-top: 32px;">
                <p style="font-size: 12px; color: #736162; margin: 0; line-height: 1.4;">
                    © 2026 Manita de Gato. All rights reserved.<br>
                    You are receiving this operational receipt because an appointment request was made using your contact records.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        });
    } catch (error) {
        console.error('Error while sending the email:', error);
    }
}