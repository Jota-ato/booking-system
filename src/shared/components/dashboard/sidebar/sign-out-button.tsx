"use client"
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { AlertDialogCustom } from "../../ui/alert-dialog-custom";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Sesión cerrada correctamente");
                    router.push("/auth/sign-in");
                },
                onError: () => {
                    toast.error("Ocurrió un error, intenta nuevamente");
                },
            },
        });
    };

    return (
        <>
            <AlertDialogCustom
                action={handleSignOut}
                actionLabel="Cerra sesión"
                dialogTitle="¿Seguro que quieres cerrar sesión?"
                triggerLabel="Cerrar sesión"
                dialogDescription="Salir de tu cuenta"
                srOnlyDescription
            />
        </>
    )
}