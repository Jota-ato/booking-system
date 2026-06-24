import { AddServiceCard } from "@/features/services/components/add-service-card";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceDialog } from "@/features/services/components/service-dialog";
import { extrasService } from "@/features/services/services/extras-service";
import { servicesService } from "@/features/services/services/services-service";
import { Heading } from "@/shared/components/typography/heading";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default async function ServicesPage() {

  const services = await servicesService.getServices();
  const extras = await extrasService.getExtras();

  return (
    <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
      <Container>
        <Heading>Services</Heading>
        <Separator className="my-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length ?
            services.map(service => (
              <ServiceCard
                key={service.data.id}
                service={service}
                isAdmin
              />
            ))
            : (
              <p className="md:col-span-2 lg:col-span-3">No hay servicios disponibles</p>
            )
          }
          <AddServiceCard
            extras={extras}
          />
          <ServiceDialog 
            extras={extras}
          />
        </div>
      </Container>
    </section>
  )
}