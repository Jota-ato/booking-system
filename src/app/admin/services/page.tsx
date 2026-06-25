import { AddServiceCard } from "@/features/services/components/add-service-card";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceDialog } from "@/features/services/components/service-dialog";
import { extrasService } from "@/features/services/services/extras-service";
import { servicesService } from "@/features/services/services/services-service";
import { Heading } from "@/shared/components/typography/heading";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/shared/components/ui/tabs";

export default async function ServicesPage() {

  const services = await servicesService.getAllServices();
  const activeServices = services.filter(service => service.data.isActive)
  const unactiveServices = services.filter(service => !service.data.isActive)
  const extras = await extrasService.getExtras();

  return (
    <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
      <Container>
        <Heading>Services</Heading>
        <Separator className="my-8" />
        <Tabs defaultValue="activeServices">
          <TabsList>
            <TabsTrigger value="activeServices">Active services</TabsTrigger>
            <TabsTrigger value="unactiveServices">Unactive services</TabsTrigger>
          </TabsList>
          <TabsContent value="activeServices">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Heading level={2} className="md:col-span-2 lg:col-span-3 my-4">No active services</Heading>
                )
              }
              <AddServiceCard
                extras={extras}
              />

            </div>
          </TabsContent>
          <TabsContent value="unactiveServices">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Heading level={2} className="md:col-span-2 lg:col-span-3 my-4">No unactive services</Heading>
                )
              }
            </div>
          </TabsContent>
        </Tabs>
      </Container>
      <ServiceDialog
        extras={extras}
      />
    </section>
  )
}