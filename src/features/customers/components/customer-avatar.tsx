export function CustomerAvatar({ name, lastName }: { name: string; lastName: string }) {
    return (
        <span className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
            {name[0]}{lastName[0]}
        </span>
    )
}