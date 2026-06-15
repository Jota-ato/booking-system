import { NewCustomer } from "@/db/schema";
import { customersRepository, ICustomersRepository } from "./customers-repository";

export class CustomersService {
    constructor (
        private customersRepository: ICustomersRepository
    ) {}

    async getClientByPhone(phone: string) {
        return await this.customersRepository.getByPhone(phone)
    }

    async createClient(data: NewCustomer) {
        const client = await this.getClientByPhone(data.phone)
        if (client) throw new Error('Client already exist')
        
        return await this.customersRepository.createClient(data)
    }
}

export const customersService = new CustomersService(
    customersRepository
)