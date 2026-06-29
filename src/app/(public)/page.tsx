import { ThemeToggle } from "@/shared/components/ui/toggle-theme";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <h1>Hola mundo! :3</h1>
            <nav>
                <Link href="/agenda" className="text-blue-500 hover:underline">
                    Go to agenda
                </Link>
            </nav>
        </>
    );
}
