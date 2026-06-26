export const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, "")

    if (digits.length === 12) {
        const cc = digits.slice(0, 2)
        const area = digits.slice(2, 4)
        const partOne = digits.slice(4, 8)
        const partTwo = digits.slice(8, 12)
        return `${cc}-${area}-${partOne}-${partTwo}`
    }

    if (digits.length === 11) {
        const cc = digits.slice(0, 1)
        const area = digits.slice(1, 4)
        const partOne = digits.slice(4, 8)
        const partTwo = digits.slice(8, 11)
        return `${cc}-${area}-${partOne}-${partTwo}`
    }

    return `${digits}`
}