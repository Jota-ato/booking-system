const COLUMNS = ["Name", "Phone", "Appointments", "Latest activity"]

export function CustomerTableHeader() {
    return (
        <div className="px-4 py-3 grid grid-cols-4 gap-4 bg-background rounded-md text-xs text-muted-foreground uppercase tracking-wide">
            {COLUMNS.map(col => <span key={col}>{col}</span>)}
        </div>
    )
}