import { es } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { Pagination } from "./pagination";
import { cn, capitalizeFirstLetter } from "@/shared/lib/utils";

export function AgendaHeader({
    weekDays,
    today,
    onNext,
    onPrev
}: {
    weekDays: Date[];
    today: Date
    onNext: () => void;
    onPrev: () => void;
}) {

    const startOfWeekMonth = capitalizeFirstLetter(format(weekDays[0], "MMMM", {
        locale: es,
    }));
    const endOfWeekMonth = capitalizeFirstLetter(format(weekDays[weekDays.length - 1], "MMMM", {
        locale: es,
    }));

    const period =
        startOfWeekMonth === endOfWeekMonth ?
            startOfWeekMonth
            : `${startOfWeekMonth} - ${endOfWeekMonth}`

    return (
        <header
            className="bg-secondary shadow-md transition-all"
        >
            <div className="p-4 text-center font-bold">
                {period}
            </div>
            <div
                className="grid sticky top-0 z-20"
                style={{ gridTemplateColumns: `5rem repeat(${weekDays.length}, 1fr)` }}
            >
                <Pagination
                    onNext={onNext}
                    onPrev={onPrev}
                />

                {weekDays.map(day => {
                    const isToday = isSameDay(today, day);
                    return (<div
                        key={day.toISOString()}
                        className={cn("py-4 border-r border-accent-foreground last:border-r-0 flex items-center justify-center flex-col animate-in fade-in duration-300", isToday ? 'bg-primary' : 'bg-secondary text-muted-foreground')}
                    >
                        <p className="text-sm font-bold uppercase tracking-widest">
                            {format(day, 'EEE', { locale: es })}
                        </p>
                        <p className="text-md md:text-2xl font-black">
                            {format(day, 'd')}
                        </p>
                    </div>)
                })}
            </div>
        </header>
    )
}