import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/shared/components/ui/theme-provider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "%s | Booking System",
  description:
    "Booking system for beauty salon, clinics  and other service-based businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster
              position='top-right'
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'font-sans',
                  success: '!border-success/30 !bg-success !text-success-foreground',
                  warning: '!border-warning/30 !bg-warning !text-warning-foreground',
                  error: '!border-destructive/30 !bg-destructive !text-destructive-foreground',
                  info: '!border-info/30 !bg-info !text-info-foreground',
                  actionButton: '!bg-primary !text-primary-foreground hover:!bg-primary/90',
                  cancelButton: '!bg-secondary !text-secondary-foreground hover:!bg-secondary/80',
                  closeButton: '!border-border !bg-background !text-muted-foreground hover:!bg-accent hover:!text-accent-foreground',
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
