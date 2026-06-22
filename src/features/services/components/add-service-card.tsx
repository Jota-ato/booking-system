import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ActionModal } from "@/shared/components/form/action-modal";

export function AddServiceCard() {
    return (
        <ActionModal
            trigger={
                <Button
                    variant="outline"
                    className="group flex h-full min-h-62.5 w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-transparent transition-all duration-300 hover:border-primary/50 hover:bg-muted/30"
                >
                    <div className="rounded-full bg-primary/10 p-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <Plus className="size-8" />
                    </div>

                    <div className="space-y-1 text-center whitespace-normal">
                        <p className="text-base font-semibold text-foreground">
                            Añadir nuevo servicio
                        </p>
                        <p className="text-sm font-normal text-muted-foreground">
                            Configura precios, duración y extras.
                        </p>
                    </div>
                </Button>
            }
            title="Crear un nuevo servicio"
            description="Llena los datos a continuación para agregar una nueva opción a tu catálogo."
        >
        </ActionModal>
    );
}