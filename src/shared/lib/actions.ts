import { AppError } from "./errors";
import { revalidateTag } from "next/cache";

export type NonPromiseActionResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
};

export type ActionResponse = Promise<NonPromiseActionResponse>;

type InferActionData<R> = R extends string ? string : R;

function getSuccessMessage(result: unknown, fallback = "Operation successful."): string {
    if (typeof result === "string") {
        return result;
    }

    if (result && typeof result === "object" && "message" in result && typeof result.message === "string") {
        return result.message;
    }

    return fallback;
}

export function adminAction<T extends any[], R>(
    callback: (...args: T) => Promise<R>,
    tag?: string
) {
    return async (...args: T): Promise<NonPromiseActionResponse<InferActionData<R>>> => {
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
                revalidateTag(tag, "max");
            }

            const isStringResult = typeof result === "string";

            return {
                success: true,
                message: getSuccessMessage(result),
                data: result as InferActionData<R>
            };

        } catch (error) {
            if (error instanceof AppError) {
                return { success: false, message: error.message };
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
    return async (...args: T): Promise<NonPromiseActionResponse<InferActionData<R>>> => {
        try {
            const result = await callback(...args);
            const isStringResult = typeof result === "string";

            return {
                success: true,
                message: getSuccessMessage(result),
                data: result as InferActionData<R>
            };

        } catch (error) {
            if (error instanceof AppError) {
                return { success: false, message: error.message };
            }

            console.error('[SERVER_ACTION_ERROR]:', error);
            return {
                success: false,
                message: "An unexpected internal error occurred. Please try again later."
            };
        }
    };
}