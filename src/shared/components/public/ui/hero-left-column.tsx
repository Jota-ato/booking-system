import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Heading } from "../../typography/heading";

export function HeroLeftColumn() {
    return (
        <div className="flex flex-col space-y-8 z-10">
            <div className="space-y-4">
                <Heading className="text-left">
                    Tus manos merecen una <br />
                    <span className="relative inline-block">
                        <span className="text-primary text-4xl md:text-6xl font-cavalier tracking-wider">Manita de Gato</span>
                        <svg
                            className="absolute -bottom-2 left-0 w-full h-2 text-primary/30"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 5 Q 25 0, 50 5 T 100 5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                    </span>
                </Heading>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                    Exclusive designs, professional care, and a moment of total relaxation just for you.
                    Specialists in acrylic nails, gel polish, and hand spa treatments.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    className="rounded-full text-base shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    size={'lg'}
                    asChild
                >
                    <Link
                        href={'/booking'}
                    >
                        Book now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-base"
                    asChild
                >
                    <Link href="#services">
                        Our services
                    </Link>
                </Button>
            </div>
        </div>
    )
}