import { HeroLeftColumn } from "./hero-left-column";
import { HeroRightColumn } from "./hero-right-column";

export function Hero() {
    return (
        <section className="relative py-8 w-full overflow-hidden bg-background flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <HeroLeftColumn />
                    <HeroRightColumn />
                </div>
            </div>
        </section>
    );
}