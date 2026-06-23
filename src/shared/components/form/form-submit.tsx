import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function FormSubmit({
    isSubmitting,
    isEditting = false,
    label,
    editingLabel = "Edit",
    submittingLabel,
    editingSubmittingLabel = "Saving...",
    className
}: {
    isSubmitting: boolean;
    isEditting?: boolean;
    label: string;
    editingLabel?: string;
    submittingLabel?: string;
    editingSubmittingLabel?: string;
    className?: string;
}) {

    const labelToShow = isEditting ? editingLabel : label;
    const submittingLabelToShow = isEditting ? editingSubmittingLabel : submittingLabel;

    return (
        <Button
            className={className}
            type="submit"
        >
            {isSubmitting ? <span><Spinner /> {submittingLabelToShow}</span> : labelToShow}
        </Button>
    )
}