import { Service } from "@/db/schema"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { formatMXN } from "@/shared/lib/currency"

export function ServicesSelect({
    services
}: {
    services: Service[]
}) {
  return (
    <Select >
      <SelectTrigger className="w-full">
        <SelectValue defaultValue={'select service'} placeholder="Select service" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel>Services</SelectLabel>
            {services.map(service => (
                <SelectItem className="flex items-center justify-between" key={service.id} value={service.id}>
                    {service.name}
                    {formatMXN(+service.price)}
                </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}