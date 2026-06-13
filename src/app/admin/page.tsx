import { DailyAppointmentsSection } from "@/features/appointments/components/daily-appointments-section";
import { appointmentsService } from "@/features/appointments/services/appointments-service";
import { Heading } from "@/shared/components/typography/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Container } from "@/shared/components/ui/container";
import { Separator } from "@/shared/components/ui/separator";

export default async function AdminPage() {

  const today = new Date()

  const appointments = await appointmentsService.getDayAppointments(today)

  return (
    <section className="h-full w-full flex flex-col items-center justify-center py-8 md:p-12">
      <Heading level={2}>Admin dashboard</Heading>

      <Separator className="my-8" />

      <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DailyAppointmentsSection 
          appointments={appointments}
        />
        <Card>
          <CardHeader>
            <CardTitle>
              Quick actions
            </CardTitle>
            <CardDescription>
              Create, cancel, create block time
            </CardDescription>
            <CardContent>
              {/**TODO quick actions */}
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Daily incomes
            </CardTitle>
            <CardDescription>
              {/**TODO show the relation between expected incomes and paid incomes 
               * Temporal placeholders
              */}
              <p className="text-muted-foreground">1200/<span className="text-accent-foreground">2500</span></p>
            </CardDescription>
          </CardHeader>
        </Card>
      </Container>
    </section>
  )
}