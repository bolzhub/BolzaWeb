import { Resend } from "resend";
import { CONTACT_ADDRESS, MAX_MESSAGE_LENGTH } from "@/lib/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

// Renvoie le message nettoyé, ou null s'il est vide, trop long ou n'est pas du texte
export function parseMessage(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const message = value.trim();
    return message.length > 0 && message.length <= MAX_MESSAGE_LENGTH ? message : null;
}

// Envoie un e-mail à ton adresse de contact. Renvoie true si l'envoi a réussi.
export async function sendContactMail(options: {
    from: string;
    subject: string;
    text: string;
}): Promise<boolean> {
    try {
        const { error } = await resend.emails.send({ to: CONTACT_ADDRESS, ...options });
        if (error) {
            console.error("Resend error:", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Email sending error:", err);
        return false;
    }
}