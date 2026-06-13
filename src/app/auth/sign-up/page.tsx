import GoogleAuthButton from "@/features/auth/components/google-auth-button";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { Heading } from "@/shared/components/typography/heading";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default function SignInPage() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <Container>
                <Heading>Sign UP</Heading>

                <Separator className="my-8" />

                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">
                            Enter your credentials to create your account.
                        </CardTitle>
                        <CardDescription className="text-center">
                            Only authorized users can access the admin dashboard. Please sign up to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Sign-in form will go here */}
                        <SignInForm />
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                        <Separator />
                        <p className="text-center text-sm text-muted-foreground">
                            Or sign in with
                        </p>
                        <GoogleAuthButton
                            mode="signup"
                        />
                    </CardFooter>
                </Card>
            </Container>
        </section>
    );
}
