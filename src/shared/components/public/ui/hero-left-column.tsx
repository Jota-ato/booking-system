"use client"
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Heading } from "../../typography/heading";
import { AnimatePresence, motion } from "motion/react"

export function HeroLeftColumn() {
    return (
        <AnimatePresence>
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="space-y-4"
                >
                    <Heading className="text-left">
                        Tus manos merecen una <br />
                        <span className="relative inline-block">
                            <span className="text-primary font-cavalier tracking-wider">Manita de Gato</span>
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
                    <motion.p
                        className="text-muted-foreground max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                    >
                        Exclusive designs, professional care, and a moment of total relaxation just for you.
                        Specialists in acrylic nails, gel polish, and hand spa treatments.
                    </motion.p>
                </motion.div>

                <div className="flex gap-2">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2 }}
                    >
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
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                    >
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
                    </motion.button>

                </div>
            </div>
        </AnimatePresence>
    )
}