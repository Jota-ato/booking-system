import { BsFacebook, BsInstagram } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { FooterSocialMediaButton } from "./footer-social-media-button";

const socialMediaLinks = [
    {
        link: process.env.NEXT_PUBLIC_INSTAGRAM_URL!,
        label: `@${process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE || 'instagram'}`,
        icon: BsInstagram,
        className: 'hover:text-pink-500 transition-colors duration-300 [&_span]:hover:bg-gradient-to-tr [&_span]:hover:from-yellow-500 [&_span]:hover:via-red-500 [&_span]:hover:to-purple-600 [&_span]:hover:bg-clip-text [&_span]:hover:text-transparent'
    },
    {
        link: process.env.NEXT_PUBLIC_FACEBOOK_URL!,
        label: `@${process.env.NEXT_PUBLIC_FACEBOOK_PROFILE || 'facebook'}`,
        icon: BsFacebook,
        className: 'hover:text-blue-600 transition-colors duration-300'
    },
    {
        link: process.env.NEXT_PUBLIC_WHATSAPP_URL!,
        label: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || 'WhatsApp',
        icon: FaWhatsapp,
        className: 'hover:text-emerald-300 transition-colors duration-300'
    }
];


export function FooterSocialLinks() {
    return (
        <div className="space-y-4">
            <h4 className="text-2xl font-bold text-accent">Contáctanos</h4>
            <div className="space-y-4">
                {socialMediaLinks.map(socialMediaLink => (
                    <FooterSocialMediaButton
                        key={socialMediaLink.link}
                        label={socialMediaLink.label}
                        link={socialMediaLink.link}
                        Icon={socialMediaLink.icon}
                        className={socialMediaLink.className}
                    />
                ))}
            </div>
        </div>
    )
}