export function FooterCopyright() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="border-t border-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground font-light">
            <p>© {currentYear} All rights reserved</p>
        </div>
    )
}