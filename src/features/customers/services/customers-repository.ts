import { db } from "@/db"
import { Customer, customers, NewCustomer } from "@/db/schema"

export interface ICustomersRepository {
    getByPhone(phone:string): Promise<Customer | undefined>
    createClient(data: NewCustomer): Promise<Customer>
}

class CustomersRepository implements ICustomersRepository {
    async getByPhone(phone: string): Promise<Customer | undefined> {
        return await db
            .query
            .customers
            .findFirst({
                where: (customer, {eq}) => eq(customer.phone, phone)
            })
    }

    async createClient(data: NewCustomer): Promise<Customer> {
        return (
            await db
            .insert(customers)
            .values(data)
            .returning()
        )[0]
    }
}

export const customersRepository = new CustomersRepository()