import { requireAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { session } = await requireAuth()

    if (session && session.user.role === 'admin')
        redirect('/admin')

    return (
        <div>
            {children}
        </div>
    );
}
