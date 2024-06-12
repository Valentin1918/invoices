import { SetStateAction, useContext } from 'react'
import { InvoiceLinesMapValue, InvoiceLinesMapValueWithProductId, LocalInvoice } from '../../types'
import { calculateTotalAndTax, makeInvoiceLinesAttributes, makeInvoiceLinesMap } from '../utils'
import { useApi } from '../../api'
import { NotificationContext } from '../components'

interface Props {
  id?: string
  invoice: LocalInvoice
  setIsLoading: (value: SetStateAction<boolean>) => void
  onPutSuccess: (invoice: LocalInvoice, invoiceLinesMap: {[key: string]: InvoiceLinesMapValue}) => void
}
export const usePutInvoice = ({ id, invoice, setIsLoading, onPutSuccess }: Props) => {
  const api = useApi();
  const { showNotification } = useContext(NotificationContext);

  return () => {
    if (!id) return;

    setIsLoading(true);

    const {
      customer,
      invoice_lines,
      paid,
      finalized,
      ...invoiceUpdater
    } = invoice;

    const invoiceLinesWithProduct = (invoice_lines || []).filter(
      (invoiceLine) => !!invoiceLine?.product_id
    ) as Array<InvoiceLinesMapValueWithProductId>

    api.putInvoice(id, {
      invoice: {
        ...invoiceUpdater,
        paid,
        finalized: paid || finalized,
        id: +id,
        customer_id: customer?.id,
        invoice_lines_attributes: invoice_lines ? makeInvoiceLinesAttributes(invoiceLinesWithProduct) : undefined,
      }
    }).then((res) => {
      const { total, tax } = calculateTotalAndTax(res.data.invoice_lines);
      const invoiceLinesMap = makeInvoiceLinesMap(res.data.invoice_lines);
      const invoiceLines = Object.values(invoiceLinesMap);
      const updatedData = { ...res.data, total, tax, invoice_lines: invoiceLines };

      onPutSuccess(updatedData, invoiceLinesMap);
      showNotification('invoiceUpdated');
    }).catch((err) => {
      console.error('putInvoice', err);
      showNotification('error');
    })

  }

}
