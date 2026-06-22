import { Extra, Service, ServiceExtra } from "@/db/schema"

export type RawServiceWithExtras = Service & {
    serviceExtras: ServiceExtraWithExtra[]
}

export type ServiceExtraWithExtra = ServiceExtra & {
    extra: Extra
}

export type ServiceWithExtras = {
    data: Service
    extras: Extra[]
}