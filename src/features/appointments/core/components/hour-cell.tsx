
export function HourCell() {
    return (
        <div
            className="w-full h-20 border-b border-foreground cursor-pointer transition-colors hover:bg-muted group relative"
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border rounded-lg border-foreground m-1 pointer-events-none transition-opacity" />
        </div>
    )
}