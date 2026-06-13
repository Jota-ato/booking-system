
export const formatMXN = (value: number) => {
    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    return formatter.format(value)
}