import { headers } from "next/headers";
import { auth } from "@/lib/auth";


export async function getServerSession() {
    return await auth.api.getSession({
        headers: await headers()
    })
}

export async function requireAuth() { 
    const session = await getServerSession()

    return {
        session,
        isAuth: session ? true : false
    }
}