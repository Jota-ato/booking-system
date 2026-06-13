import { requireAuth } from "@/lib/auth-server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for the booking system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const { session } = await requireAuth()

    if (!session) {
        redirect('/auth/sign-in')
    }
    
  return (
    <div>
        {children}
    </div>
  );
}
