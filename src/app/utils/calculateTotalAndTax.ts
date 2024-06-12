import { InvoiceLinesMapValue } from '../../types'
import { makeFinancialFormat } from './makeFinancialFormat'

export const calculateTotalAndTax = (invoiceLines: Array<InvoiceLinesMapValue> = []) => {
  const { total, tax } = invoiceLines.reduce(
    (acc: { total: number, tax: number }, { product, quantity, _destroy }) => {
      if (!product || _destroy) {
        return acc;
      }

      return {
        total: acc.total + +product.unit_price * quantity,
        tax: acc.tax + +product.unit_tax * quantity
      }
    }, { total: 0, tax: 0 });

  return { total: makeFinancialFormat(total), tax: makeFinancialFormat(tax) };
};
