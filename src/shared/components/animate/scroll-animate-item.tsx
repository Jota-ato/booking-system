"use client"
import { motion } from "motion/react"

export function ScrollAnimateItem({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    )
}