import { Heading } from "@/shared/components/typography/heading";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default function SignInPage() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <Container>
                <Heading>Sign In</Heading>

                <Separator className="my-8" />

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">
                            Enter your credentials to sign in to your account.
                        </CardTitle>
                        <CardDescription className="text-center">
                            Only authenticated users can access the admin dashboard. Please sign in to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Sign-in form will go here */}
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                        <p className="text-center text-sm text-muted-foreground">
                            Or sign in with
                        </p>
                        <Button variant={'outline'}>
                            Sign in with Google
                        </Button>
                    </CardFooter>
                </Card>
            </Container>
        </section>
    );
}
