import { Components, OperationMethods } from 'api/gen/client'
import { Awaited } from './helpers'

export type Invoice = Awaited<
  ReturnType<OperationMethods['getInvoices']>
>['data']['invoices'][0]

export type Product = Awaited<
  ReturnType<OperationMethods['getSearchProducts']>
>['data']['products'][0]

export type Customer = Awaited<
  ReturnType<OperationMethods['getSearchCustomers']>
>['data']['customers'][0]

export type ArithmeticOperator = 'gt' | 'lt' | 'eq';

export interface FetchInvoiceArgs {
  customer: Customer | null
  total: string
  totalOperator: ArithmeticOperator
  finalized: boolean
  paid: boolean
  date: string
  dateOperator: ArithmeticOperator
  deadline: string
  deadlineOperator: ArithmeticOperator
}

export interface InvoiceLinesMapValue extends Partial<Components.Schemas.InvoiceLine> {
  id: number
  quantity: number
  price: string
  tax: string
  _destroy?: boolean
}

export interface LocalInvoice extends Omit<Partial<Invoice>, 'invoice_lines'> {
  invoice_lines?: Array<InvoiceLinesMapValue>
}

export interface InvoiceLinesMapValueWithProductId extends InvoiceLinesMapValue {
  product_id: number
}