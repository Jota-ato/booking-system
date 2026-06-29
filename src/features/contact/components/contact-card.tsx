import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"
import { ContactForm } from "./contact-form"

export function ContactCard() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    Please fill out the form below
                </CardTitle>
                <CardDescription>
                    We will get back to you as soon as possible
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ContactForm />
            </CardContent>
        </Card>
    )
}