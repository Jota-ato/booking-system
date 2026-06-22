import { ServiceCard } from "@/features/services/components/service-card";
import { servicesService } from "@/features/services/services/services-service";
import { Heading } from "@/shared/components/typography/heading";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default async function ServicesPage() {

  const services = await servicesService.getServices();

  return (
    <section className="min-h-screen py-8 md:py-12 flex items-center justify-center">
      <Container>
        <Heading>Services</Heading>
        <Separator className="my-8"/>
        {services.length ?
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isAdmin
              />
            ))}
          </div>
          : (
            <p>No hay servicios disponibles</p>
          )
        }
      </Container>
    </section>
  )
}