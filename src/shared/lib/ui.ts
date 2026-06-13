export const currentPath = (href: string, pathname: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}