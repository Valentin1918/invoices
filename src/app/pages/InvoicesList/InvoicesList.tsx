import { useEffect, useState, useCallback, ReactElement, useContext } from 'react'
import { Button, Stack } from 'react-bootstrap'

import { useApi } from 'api'
import { Invoice } from 'types'
import { InvoicesTable, FilteringSection, NotificationContext } from 'app/components'

import styles from './InvoicesList.module.css'
import { useNavigate } from 'react-router-dom'
import { INVOICE, INVOICE_ID_REPLACER, NEW_INVOICE_ID } from '../../routes'
import { useTranslation } from 'react-i18next'

const InvoicesList = (): ReactElement => {
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICES_LIST' });

  const openNewInvoice = () => navigate(INVOICE.replace(INVOICE_ID_REPLACER, NEW_INVOICE_ID));
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [invoicesLastPage, setInvoicesLastPage] = useState(1);
  const [invoicesTotalPages, setInvoicesTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  const updateIsLoading = (page: number, value: boolean, ) => {
    if (page > 1) {
      setIsLoading(value);
    } else {
      setIsInitialLoading(value);
    }
  };

  const fetchInvoices = useCallback((page: number = 1) => {
    updateIsLoading(page,true);

    const parameters = {
      page,
      ...(filter.length ? { filter } : {}),
    };

    api.getInvoices(parameters).then(({ data }) => {
      setInvoicesList((currentInvoicesList) => {
        if (data.pagination.page === 1) {
          return data.invoices;
        }
        return [ ...currentInvoicesList, ...data.invoices ];
      })

      setInvoicesLastPage(data.pagination.page);
      setInvoicesTotalPages(data.pagination.total_pages);
      updateIsLoading(page,false);
    }).catch((err) => {
      console.error('getInvoices', err);
      showNotification('error');
    })
  }, [api, filter]);


  const loadMorePages = useCallback(() => {
    if (!isLoading && invoicesLastPage < invoicesTotalPages) {
      fetchInvoices(invoicesLastPage + 1);
    }
  }, [invoicesLastPage, invoicesTotalPages, fetchInvoices, isLoading]);

  useEffect(() => {
    fetchInvoices();
  }, [api, filter, fetchInvoices])

  return (
    <Stack gap={3} className="h-100">
      <Stack direction="horizontal" gap={3} className={styles.header}>
        <FilteringSection setFilter={setFilter} />
        <Button type="button" onClick={openNewInvoice} className="lh-sm p-0 h-100">
          {t('CREATE_INVOICE_BUTTON')}
        </Button>
      </Stack>

      <InvoicesTable {...{ invoicesList, isInitialLoading, isLoading, loadMorePages }} />
    </Stack>
  )
}

export default InvoicesList
