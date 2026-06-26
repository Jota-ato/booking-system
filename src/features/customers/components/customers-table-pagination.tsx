"use client"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,

} from "@/shared/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation";

export function CustomersTablePagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    return (
        <Pagination className="mt-4 justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={isFirstPage ? "#" : createPageURL(currentPage - 1)}
                        className={isFirstPage ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={isFirstPage}
                    />
                </PaginationItem>

                <PaginationItem className="text-sm font-medium px-4">
                    Page {currentPage} of {totalPages || 1}
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        href={isLastPage ? "#" : createPageURL(currentPage + 1)}
                        className={isLastPage ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={isLastPage}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}