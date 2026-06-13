import GoogleAuthButton from "@/features/auth/components/google-auth-button";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { Heading } from "@/shared/components/typography/heading";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";

export default function SignInPage() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <Container>
                <Heading>Sign In</Heading>

                <Separator className="my-8" />

                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">
                            Enter your credentials to sign in to your account.
                        </CardTitle>
                        <CardDescription className="text-center">
                            Only authorized users can access the admin dashboard. Please sign in to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignInForm />
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                        <Separator />
                        <p className="text-center text-sm text-muted-foreground">
                            Or sign in with
                        </p>
                        <GoogleAuthButton />
                    </CardFooter>
                </Card>
                <div className="max-w-lg w-full mx-auto flex mt-4 items-center justify-between">
                    <Button
                        variant={'link'}
                    >
                        <Link
                            href="/auth/sign-up"
                        >
                            Sign Up
                        </Link>
                    </Button>
                    <Button
                        variant={'link'}
                    >
                        <Link
                            href="/auth/sign-up"
                        >
                            Forgot Password?
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
