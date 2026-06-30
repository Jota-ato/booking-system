// import Logo from "@/components/ui/logo";

import { Heading } from "../../typography/heading";
import { Logo } from "../../ui/logo";

export function FooterSlogan() {
    return (
        <div className="space-y-4">
            <Heading level={3} className="text-2xl font-bold flex items-center gap-2 text-accent-foreground">
                Manita de Gato
                <Logo />
            </Heading>

            <p className="text-sm md:text-md text-foreground max-w-xs leading-relaxed">
                Y tú... ¿Ya te diste una Manita de Gato?
            </p>
        </div>
    )
}