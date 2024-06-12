import { InvoiceLinesMapValueWithProductId } from '../../types'

export const makeInvoiceLinesAttributes = (invoiceLines: Array<InvoiceLinesMapValueWithProductId>) =>
  invoiceLines.map(({
    id, product, ...invoiceLineUpdater
  }) => ({ ...invoiceLineUpdater, ...(id > 0 ? { id } : {}) }));