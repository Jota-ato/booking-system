export function FooterCopyright() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="border-t border-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground font-light">
            <p>© {currentYear} Manita de Gato. Todos los derechos reservados.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:underline">Política de Privacidad</a>
                <a href="#" className="hover:underline">Términos de Servicio</a>
            </div>
        </div>
    )
}