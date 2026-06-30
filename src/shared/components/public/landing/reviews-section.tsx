"use client"

import { Star } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/shared/components/ui/card";
import { motion, AnimatePresence } from "motion/react"
import { Heading } from "../../typography/heading";
import { ScrollAnimateItem } from "../../animate/scroll-animate-item";

const reviewsData = [
    {
        nombre: "Mariana R.",
        inicial: "M",
        servicio: "Acrylic Nails",
        texto: "I loved the service. The facilities are super clean, the attention is top-notch, and my acrylic nails turned out identical to the photo I brought. It has definitely become my favorite place."
    },
    {
        nombre: "Valeria G.",
        inicial: "V",
        servicio: "Manicure & Gel Polish",
        texto: "Excellent service from the girls. The gel polish stays intact for over three weeks without chipping at all. They also offer you a delicious little coffee during your appointment."
    },
    {
        nombre: "Laura M.",
        inicial: "L",
        servicio: "Spa Pedicure",
        texto: "The Spa Pedicure is wonderful. They work with great patience and the products they use smell amazing. A 10/10 space to pamper yourself."
    }
];

export function ReviewsSection() {
    return (
        <section id="reviews" className="py-8 text-secondary-foreground min-h-screen flex items-center justify-center">
            <AnimatePresence>
                <div className="max-w-6xl mx-auto">
                    <motion.header
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Heading level={2} className="text-3xl font-bold mb-4">What our clients say</Heading>
                        <div className="flex justify-center items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                            ))}
                        </div>
                        <p className="text-muted-foreground font-medium">Rated 5 stars for our care and quality.</p>
                    </motion.header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviewsData.map((review, idx) => (
                            <ScrollAnimateItem
                                key={review.nombre}
                                delay={0.1 * idx * 1.8}
                            >
                                <Card key={idx} className="rounded-3xl border-border shadow-md flex flex-col h-full bg-card text-card-foreground">
                                    <CardHeader className="pl-8">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                            ))}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 text-sm md:text-base italic leading-relaxed">
                                        &quot;{review.texto}&quot;
                                    </CardContent>

                                    <CardFooter className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold shrink-0 border border-border">
                                            {review.inicial}
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-semibold text-foreground">
                                                {review.nombre}
                                            </CardTitle>
                                            <span className="text-xs text-muted-foreground block mt-0.5">
                                                {review.servicio}
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </ScrollAnimateItem>
                        ))}
                    </div>
                </div>
            </AnimatePresence>
        </section>
    );
}