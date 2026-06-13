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
import { SignUpInput, signUpSchema } from "../schemas/form-schemas"

export function SignUpForm() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema)
    })

    const handleSignUp = (data: SignUpInput) => {
        console.log("Sign-up data:", data)
        {/**TODO add actions to sign up */}
    }

    return (
        <form onSubmit={handleSubmit(handleSignUp)}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">
                            Name
                        </FieldLabel>
                        <Input 
                        id="name" 
                        type="text" 
                        {...register("name")}
                        />
                        <FieldError>
                            {errors.name && errors.name.message}
                        </FieldError>
                    </Field>
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
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">
                            Confirm Password
                        </FieldLabel>
                        <Input 
                        id="confirmPassword" 
                        type="password" 
                        {...register("confirmPassword")}
                        />
                        <FieldError>
                            {errors.confirmPassword && errors.confirmPassword.message}
                        </FieldError>
                    </Field>
                </FieldGroup>
                <Button
                    type="submit"
                >
                    Sign Up
                </Button>
            </FieldSet>
        </form>
    )
}