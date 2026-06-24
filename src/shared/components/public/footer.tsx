import { FooterCopyright } from "./footer-copyright";
import { FooterNav } from "./footer-nav";
import { FooterSlogan } from "./footer-slogan";
import { FooterSocialLinks } from "./footer-social-links";

export function Footer() {
    return (
        <footer className="w-full bg-primary border-t border-border">
            <div className="w-[90%] max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FooterSlogan />
                    <FooterNav />
                    <FooterSocialLinks />
                </div>

                <FooterCopyright />
            </div>
        </footer>
    );
}