import { SetStateAction, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router'

import { useApi } from 'api'
import { InvoiceLinesMapValueWithProductId, LocalInvoice } from 'types'
import { makeInvoiceLinesAttributes } from '../utils'
import { INVOICE, INVOICE_ID_REPLACER } from '../routes'
import { NotificationContext } from '../components'

interface Props {
  invoice: LocalInvoice
  setIsLoading: (value: SetStateAction<boolean>) => void
}
export const usePostInvoice = ({ invoice, setIsLoading }: Props) => {
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  return useCallback(() => {
    const {
      customer,
      customer_id,
      invoice_lines,
      paid,
      finalized,
      ...invoiceUpdater
    } = invoice;

    if (customer_id) {
      setIsLoading(true);

      const invoiceLinesWithProduct = (invoice_lines || []).filter(
        (invoiceLine) => !!invoiceLine?.product_id
      ) as Array<InvoiceLinesMapValueWithProductId>

      api.postInvoices(null,{ invoice: {
          ...invoiceUpdater,
          paid,
          finalized: paid || finalized,
          customer_id,
          invoice_lines_attributes: invoice_lines ? makeInvoiceLinesAttributes(invoiceLinesWithProduct) : undefined,
        }}).then((res) => {
        navigate(INVOICE.replace(INVOICE_ID_REPLACER, `${res.data.id}`));
        showNotification('invoiceCreated');
      }).catch((err) => {
        console.error('postInvoices', err);
        showNotification('error');
      })
    }
  }, [api, invoice, navigate, setIsLoading, showNotification]);

}