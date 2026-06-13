"use client"
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { AlertDialogCustom } from "../../ui/alert-dialog-custom";

export function SignOutButton({
    isCollapse
}: {
    isCollapse: boolean
}) {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Session closed successfully");
                    router.push("/auth/sign-in");
                },
                onError: () => {
                    toast.error("Something went wrong while closing the session. Please try again.");
                },
            },
        });
    };

    return (
        <>
            <AlertDialogCustom
                triggerIcon={LogOut}
                action={handleSignOut}
                actionLabel="Sign out"
                dialogTitle="Are you sure you want to sign out?"
                triggerLabel="Sign out"
                dialogDescription="You will need to sign in again to access your dashboard."
                srOnlyDescription
                showText={isCollapse}
            />
        </>
    )
}