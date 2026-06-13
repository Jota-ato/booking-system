"use client"

import { Button } from "@/shared/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInInput, signInSchema } from "../schemas/form-schemas"

export function SignInForm() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema)
    })

    const handleSignIn = (data: SignInInput) => {
        console.log("Sign-in data:", data)
        {/**TODO add actions to sign in */}
    }

    return (
        <form onSubmit={handleSubmit(handleSignIn)}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="email">
                            Email
                        </FieldLabel>
                        <Input 
                        id="email" 
                        type="email" 
                        {...register("email")}
                        />
                        <FieldError>
                            {errors.email && errors.email.message}
                        </FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">
                            Password
                        </FieldLabel>
                        <Input 
                        id="password" 
                        type="password" 
                        {...register("password")}
                        />
                        <FieldError>
                            {errors.password && errors.password.message}
                        </FieldError>
                    </Field>
                </FieldGroup>
                <Button
                    type="submit"
                >
                    Sign In
                </Button>
            </FieldSet>
        </form>
    )
}