import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import _ from 'lodash';
import { useApi } from 'api';
import {InvoiceLinesMapValue, InvoiceLinesMapValueWithProductId, LocalInvoice} from 'types';
import {ROOT, NEW_INVOICE_ID, INVOICE, INVOICE_ID_REPLACER} from 'app/routes';
import {makeInvoiceLinesMap, calculateTotalAndTax, makeInvoiceLinesAttributes} from 'app/utils';
import { NotificationContext } from 'app/components';


export const useInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = useMemo(() => id === NEW_INVOICE_ID, [id]);
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isVirgin, setIsVirgin] = useState(true);
  const [initialInvoice, setInitialInvoice] = useState<LocalInvoice>();
  const [invoice, setInvoice] = useState<LocalInvoice>({});
  const [invoiceLinesMap, setInvoiceLinesMap] = useState<{[key: number]: InvoiceLinesMapValue}>({});

  const isFinalized = useMemo(() => initialInvoice?.finalized, [initialInvoice]);
  const isPaid = useMemo(() => initialInvoice?.paid, [initialInvoice]);

  const backToList = () => navigate(ROOT);

  const updateInvoice = useCallback((updater: LocalInvoice) => {
    setInvoice((currentInvoice) => {
      return { ...currentInvoice, ...updater }
    })
  }, []);

  useEffect(() => {
    const invoiceLines = Object.values(invoiceLinesMap);
    const { total, tax } = calculateTotalAndTax(invoiceLines);

    updateInvoice({ invoice_lines: invoiceLines, total, tax });
  }, [invoiceLinesMap, updateInvoice]);

  useEffect(() => {
    if (invoice && initialInvoice) {
      setIsVirgin(_.isEqual(invoice, initialInvoice));
    }
  }, [invoice, initialInvoice]);

  const putInvoice = async () => {
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

    try {
      const res = await api.putInvoice(id, {
        invoice: {
          ...invoiceUpdater,
          paid,
          finalized: paid || finalized,
          id: +id!,
          customer_id: customer?.id,
          invoice_lines_attributes: invoice_lines ? makeInvoiceLinesAttributes(invoiceLinesWithProduct) : undefined,
        }
      })


      const { total, tax } = calculateTotalAndTax(res.data.invoice_lines);
      const invoiceLinesMap = makeInvoiceLinesMap(res.data.invoice_lines);
      const invoiceLines = Object.values(invoiceLinesMap);
      const updatedData = { ...res.data, total, tax, invoice_lines: invoiceLines };

      setInvoice(updatedData);
      setInitialInvoice(updatedData);
      setInvoiceLinesMap(invoiceLinesMap);
      // closeUpdateInvoiceModal();
      setIsLoading(false);
      showNotification('invoiceUpdated');
    } catch (err) {
      console.error('putInvoice', err);
      showNotification('error');
    }

  }

  const postInvoice = () => {
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
  }

  const deleteInvoice = () => {
    api.deleteInvoice(id).then((res) => {
      backToList();
      showNotification('invoiceDeleted');
    }).catch((err) => {
      console.error('deleteInvoice', err);
      showNotification('error');
    })
  }

  useEffect(() => {
    if (isNew) {
      setIsLoading(false);
    } else if (isNaN(+id!)) {
      console.error('URL id is invalid!');
    } else {
      setIsLoading(true);
      api.getInvoice(id).then(({ data }) => {
        /**
         total ,tax, as well as invoice_lines price and tax should be calculated
         based on the invoice_lines quantity, and it's product unit_price and unit_tax
         so the uniq source of truth are the invoice_lines's quantity, and it's product data
         */
        const { total, tax } = calculateTotalAndTax(data.invoice_lines);
        const invoiceLinesMap = makeInvoiceLinesMap(data.invoice_lines);
        const invoiceLines = Object.values(invoiceLinesMap);
        const updatedData = { ...data, total, tax, invoice_lines: invoiceLines };

        setInvoice(updatedData);
        setInitialInvoice(updatedData);
        setInvoiceLinesMap(invoiceLinesMap);
        setIsLoading(false);
      }).catch((err) => {
        console.error('getInvoice', err);
      })
    }
  }, [api, id, isNew]);

  return {
    invoice,
    invoiceLinesMap,
    isNew,
    isVirgin,
    isLoading,
    isFinalized,
    isPaid,
    putInvoice,
    postInvoice,
    deleteInvoice,
    updateInvoice,
    setInvoiceLinesMap,
  }
}
