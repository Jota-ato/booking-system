import { type ClassValue } from "clsx";
import { IconType } from "react-icons";

interface FooterSocialMediaButtonProps {
    label: string
    link: string
    Icon: IconType;
    className?: ClassValue
}

export function FooterSocialMediaButton({ className, link, label, Icon }: FooterSocialMediaButtonProps) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm ${className}`}
        >
            <Icon className="shrink-0 text-base fill-current" />
            <span>{label}</span>
        </a>
    )
}