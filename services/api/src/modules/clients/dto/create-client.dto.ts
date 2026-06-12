export class CreateClientDto {
  name!: string;
  contactName?: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  billingAddress?: string;
  notes?: string;
}