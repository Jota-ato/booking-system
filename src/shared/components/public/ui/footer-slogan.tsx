// import Logo from "@/components/ui/logo";

export function FooterSlogan() {
    return (
        <div className="space-y-4">
            <div className="text-2xl text-accent font-bold flex items-center gap-2">
                Manita de Gato
                {/* <Logo width={32} height={32} /> */}
            </div>

            <p className="text-sm md:text-md text-foreground max-w-xs leading-relaxed">
                Y tú... ¿Ya te diste una Manita de Gato?
            </p>
        </div>
    )
}