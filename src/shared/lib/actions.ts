import { AppError } from "./errors"
import { revalidatePath, revalidateTag } from "next/cache"

export type ActionResponse = Promise<NonPromiseActionResponse>

export type NonPromiseActionResponse = {
    success: boolean,
    message: string
}

export function adminAction<T extends any[], R>(
    callback: (...args: T) => Promise<R>,
    tag?: string
) {
    return async (...args: T) => {
        try {
            const { requireAuth } = await import("@/lib/auth-server");
            const { isAdmin } = await requireAuth();
            if (!isAdmin) {
                return {
                    success: false,
                    message: "You do not have authorization to perform this action."
                };
            }

            const result = await callback(...args);
            if (tag) {
                revalidateTag(tag, "default");
            }

            return {
                success: true,
                message: typeof result === 'string' ? result : "Operation successful.",
                data: result ? result : undefined
            };

        } catch (error) {
            if (error instanceof AppError) {
                return {
                    success: false,
                    message: error.message
                };
            }

            console.error('[SERVER_ACTION_ERROR]:', error);
            return {
                success: false,
                message: "An unexpected internal error occurred. Please try again later."
            };
        }
    };
}

export function customerAction<T extends any[], R>(
    callback: (...args: T) => Promise<R>,
) {
    return async (...args: T) => {
        try {

            const result = await callback(...args);

            return {
                success: true,
                message: typeof result === 'string' ? result : "Operation successful.",
                data: result ? result : undefined
            };

        } catch (error) {
            if (error instanceof AppError) {
                return {
                    success: false,
                    message: error.message
                };
            }

            console.error('[SERVER_ACTION_ERROR]:', error);
            return {
                success: false,
                message: "An unexpected internal error occurred. Please try again later."
            };
        }
    };
}