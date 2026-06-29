import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

export function HeroRightColumn() {
    return (
        <div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <Image
                    src="https://3znc0tm3cy.ufs.sh/f/DWXg3fIaM0N2UCpIwRcOcLaPYky3q4zXUHSr8utQWf79lohC"
                    alt="Interior del salón Manita de Gato"
                    width={400}
                    height={800}
                    className="w-full h-auto object-cover aspect-4/5 lg:aspect-square"
                />

                <Card className="absolute bottom-4 left-4 right-4 ">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <div className="p-2 w-fit bg-primary/10 text-primary rounded-lg">
                                <Star className="w-8 h-8" />
                            </div>
                            Top Rated Salon
                        </CardTitle>
                        <CardDescription>
                            <p className="text-xs sm:text-sm">4.8/5 basado en reseñas de Google</p>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}