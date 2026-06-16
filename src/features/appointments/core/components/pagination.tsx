import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
    onNext: () => void;
    onPrev: () => void;
}

export function Pagination({ onNext, onPrev }: PaginationProps) {
    return (
        <div className="p-2 flex items-center justify-center gap-2">
            <Button
                size={'icon'}
                onClick={onPrev}
                className="p-2 rounded-full text-foreground bg-transparent hover:text-primary hover:bg-transparent transition-colors duration-300"
            >
                <ArrowLeft className="size-5" />
            </Button>
            <Button
                size={'icon'}
                onClick={onNext}
                className="p-2 rounded-full text-foreground bg-transparent hover:text-primary hover:bg-transparent transition-colors duration-300"
            >
                <ArrowRight className="size-5" />
            </Button>
        </div>
    )
}