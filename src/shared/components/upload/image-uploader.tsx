"use client"

import { UploadDropzone } from "@/shared/utils/uploadthing"
import { useState } from "react"
import { toast } from "sonner"
import { ImageIcon, X, CheckCircle2 } from "lucide-react"
import Image from "next/image";

export default function ImageUploader({
    label,
    onChange,
    image
}: {
    label: string
    onChange: (url: string | null) => void
    image?: string
}) {
    const [imageUrl, setImageUrl] = useState<string | null>(image ?? '')
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>

            {imageUrl ? (
                // Preview de la imagen subida
                <div className="relative group rounded-xl overflow-hidden border border-border h-60 w-full">
                    <Image
                        src={imageUrl}
                        fill
                        alt="Portada de la comunidad"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay con opción de cambiar */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setImageUrl(null)
                                onChange(null)
                            }}
                            className="flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-lg px-3 py-1.5 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <X className="size-3.5" />
                            Cambiar imagen
                        </button>
                    </div>
                    {/* Badge de éxito */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <CheckCircle2 className="size-3" />
                        Subida
                    </div>
                </div>
            ) : (
                <UploadDropzone
                    endpoint="meetiUploader"
                    config={{ mode: "auto" }}
                    content={{
                        label: isUploading ? "Subiendo imagen..." : "Arrastra una imagen aquí",
                        allowedContent: "PNG, JPG o WEBP · Máx. 1MB",
                        button({ ready, isUploading }) {
                            if (isUploading) return "Subiendo..."
                            if (ready) return "Subir archivo"
                            return "Seleccionar archivo"
                        },
                        uploadIcon: () => <ImageIcon className="size-8 text-muted-foreground" />
                    }}
                    appearance={{
                        container: `
                            relative flex flex-col items-center justify-center
                            border-2 border-dashed rounded-xl
                            h-40 w-full cursor-pointer
                            transition-colors duration-200
                            ${isUploading
                                ? "border-primary/50 bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }
                        `,
                        uploadIcon: "size-8 text-muted-foreground mb-1",
                        label: "text-sm font-medium text-foreground mt-1",
                        allowedContent: "text-xs text-muted-foreground mt-0.5",
                        button: `
                            mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold
                            bg-primary text-primary-foreground
                            hover:opacity-90 transition-opacity
                            disabled:opacity-50
                        `,
                    }}
                    onUploadBegin={() => {
                        setIsUploading(true)
                        toast.info("Subiendo imagen...")
                    }}
                    onClientUploadComplete={(res) => {
                        setIsUploading(false)
                        setImageUrl(res[0].ufsUrl)
                        onChange(res[0].ufsUrl)
                        toast.success("Imagen subida correctamente")
                    }}
                    onUploadError={() => {
                        setIsUploading(false)
                        toast.error(`Error al subir`)
                    }}
                />
            )}
        </div>
    )
}