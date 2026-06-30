import { FooterCopyright } from "./footer-copyright";
import { FooterNav } from "./footer-nav";
import { FooterSlogan } from "./footer-slogan";
import { FooterSocialLinks } from "./footer-social-links";

export function Footer() {
    return (
        <footer className="w-full bg-secondary border-t border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <FooterSlogan />
                <FooterNav />
                <FooterSocialLinks />
            </div>

            <FooterCopyright />
        </footer>
    );
}