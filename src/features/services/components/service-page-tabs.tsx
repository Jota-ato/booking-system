"use client"
import {
    Tabs,
    TabsContent,
} from "@/shared/components/ui/tabs";
import { ServicePageTabsList } from "@/features/services/components/service-page-tabs-list";
import { AddExtraCard } from "@/features/services/components/add-extra-card";
import { AddServiceCard } from "@/features/services/components/add-service-card";
import { ExtraCard } from "@/features/services/components/extra-card";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceWithExtras } from "../types/service.types";
import { Extra } from "@/db/schema";
import { Heading } from "@/shared/components/typography/heading";
import { useIsMobile } from "@/hooks/use-mobile";

export function ServicePageTabs({
    activeServices,
    unactiveServices,
    activeExtras,
    unactiveExtras,
    extras,
}: {
    activeServices: ServiceWithExtras[],
    unactiveServices: ServiceWithExtras[],
    activeExtras: Extra[],
    unactiveExtras: Extra[],
    extras: Extra[],
}) {

    const isMobile = useIsMobile()

    return (
        <Tabs orientation={isMobile ? "vertical" : "horizontal"} defaultValue="activeServices">
            <ServicePageTabsList />
            <TabsContent className="min-h-120" value="activeServices">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {activeServices.length ?
                        activeServices
                            .map(service => (
                                <ServiceCard
                                    key={service.data.id}
                                    service={service}
                                    isAdmin
                                />
                            ))
                        : (
                            <Heading level={2} className="sm:col-span-2 md:col-span-3 my-4">No active services</Heading>
                        )
                    }
                    <AddServiceCard
                        extras={extras}
                    />

                </div>
            </TabsContent>
            <TabsContent className="min-h-120" value="unactiveServices">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {unactiveServices.length ?
                        unactiveServices
                            .map(service => (
                                <ServiceCard
                                    key={service.data.id}
                                    service={service}
                                    isAdmin
                                />
                            ))
                        : (
                            <Heading level={2} className="sm:col-span-2 md:col-span-3 my-4">No unactive services</Heading>
                        )
                    }
                </div>
            </TabsContent>
            <TabsContent className="min-h-120" value="activeExtras">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <AddExtraCard />
                    {activeExtras.length ?
                        activeExtras.map(extra => (
                            <ExtraCard key={extra.id} extra={extra} />
                        ))
                        : <Heading level={2} className="sm:col-span-3 md:col-span-4 my-4">No extras</Heading>
                    }
                </div>
            </TabsContent>
            <TabsContent className="min-h-120" value="unactiveExtras">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {unactiveExtras.length ?
                        unactiveExtras.map(extra => (
                            <ExtraCard key={extra.id} extra={extra} />
                        ))
                        : <Heading level={2} className="sm:col-span-3 md:col-span-4 my-4">No unactive extras</Heading>
                    }
                </div>
            </TabsContent>
        </Tabs>
    )
}