import { FetchInvoiceArgs } from 'types'

export const prepareFilter = ({
  customer, total, totalOperator, finalized, paid, date, dateOperator, deadline, deadlineOperator,
}: Partial<FetchInvoiceArgs> = {}): string => {

  const filters = [];

  if (customer) {
    filters.push({
      field: 'customer_id',
      operator: 'eq',
      value: customer.id,
    })
  }
  if (total?.length) {
    filters.push({
      field: 'amount',
      operator: totalOperator,
      value: total,
    })
  }
  if (paid || finalized) {
    filters.push({
      field: 'status',
      operator: 'eq',
      value: paid ? 'paid_status' : ['upcoming_status','late_status','cancelled_status','partially_cancelled_status'],
    })
  }
  if (date) {
    filters.push({
      field: 'date',
      operator: dateOperator,
      value: date,
    })
  }
  if (deadline) {
    filters.push({
      field: 'deadline',
      operator: deadlineOperator,
      value: deadline,
    })
  }

  return filters.length ? JSON.stringify(filters) : '';
}
