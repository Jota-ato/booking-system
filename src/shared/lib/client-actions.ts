import { toast } from "sonner";
import { NonPromiseActionResponse } from "./actions";

/**
 * Toast the user if the action had success or not.
 * Preserva al 100% el tipado estricto de los datos devueltos.
 * * @param response la respuesta genérica de una acción
 * @returns el contenido de response.data tipado con precisión o undefined si falló
 */
export const showResponse = <T,>(response: NonPromiseActionResponse<T>): T | undefined => {
    if (response.success) {
        toast.success(response.message);
        return response.data;
    } else {
        toast.error(response.message);
        return undefined;
    }
};