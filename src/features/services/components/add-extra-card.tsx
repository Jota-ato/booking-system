import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ActionModal } from "@/shared/components/form/action-modal";
import { ExtraForm } from "./extra-form";

export function AddExtraCard({
} : {
}) {
    return (
        <ActionModal
            trigger={
                <Button
                    variant="outline"
                    className="group flex h-full  w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-transparent transition-all duration-300 hover:border-primary/50 hover:bg-muted/30"
                >
                    <div className="rounded-full bg-primary/10 p-2 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <Plus className="size-6" />
                    </div>

                    <div className="space-y-1 text-center whitespace-normal">
                        <p className="text-base font-semibold text-foreground">
                            Add new extra
                        </p>
                        <p className="text-sm font-normal text-muted-foreground">
                            Configure the price and details of the extra.
                        </p>
                    </div>
                </Button>
            }
            title="Create new extra"
            description="Fill in the data below to add a new extra to your catalog."
        >
            <ExtraForm />
        </ActionModal>
    );
}