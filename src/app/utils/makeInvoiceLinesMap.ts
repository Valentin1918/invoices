import { InvoiceLinesMapValueWithProductId } from '../../types'

export const makeInvoiceLinesMap = (invoiceLines: Array<InvoiceLinesMapValueWithProductId>): {[key: string]: InvoiceLinesMapValueWithProductId} => {
  return invoiceLines.reduce((acc, line) => {
    return {
      ...acc,
      [line.id]: {
        ...line,
        price: +(line.product?.unit_price || 0) * line.quantity,
        tax: +(line.product?.unit_tax || 0) * line.quantity,
      }}
  }, {})
};
