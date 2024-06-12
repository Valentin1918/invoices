import { ReactElement, FC, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Stack } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import _ from 'lodash'

import { Invoice } from 'types'
import { INVOICE, INVOICE_ID_REPLACER } from '../../routes'
import styles from './InvoicesTable.module.css';


interface Props {
  invoicesList: Array<Invoice>
  isInitialLoading?: boolean
  isLoading?: boolean
  loadMorePages: () => void
}

const InvoicesTable: FC<Props> = ({
  invoicesList,
  isInitialLoading,
  isLoading,
  loadMorePages,
}): ReactElement => {
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICES_LIST.TABLE' });

  const makeInvoiceOpener = (id: number) => () => navigate(INVOICE.replace(INVOICE_ID_REPLACER, `${id}`));
  const tableWrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const scrollHandler = () => {
      if (!tableWrapRef.current) return;

      const scrollTop = tableWrapRef.current.scrollTop;
      const scrollHeight = tableWrapRef.current.scrollHeight;
      const clientHeight = tableWrapRef.current.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) {
        loadMorePages();
      }
    };

    const throttled = _.throttle(scrollHandler, 100);
    const tableWrapRefCurrent = tableWrapRef.current;
    tableWrapRefCurrent?.addEventListener('scroll', throttled);

    return () => {
      tableWrapRefCurrent?.removeEventListener('scroll', throttled);
    };
  }, [loadMorePages, isLoading]);

  return (
    <Stack className={styles['table-wrap']} ref={tableWrapRef}>
      <table className={classnames('table', 'table-bordered', 'table-striped', 'm-0', { [styles.table]: isInitialLoading || !invoicesList.length})}>
        <thead>
        <tr>
          <th className="col-1">{t('ID_COLUMN_HEADER')}</th>
          <th className="col-2">{t('CUSTOMER_COLUMN_HEADER')}</th>
          <th className="col-2">{t('ADDRESS_COLUMN_HEADER')}</th>
          <th className="col-1">{t('TOTAL_COLUMN_HEADER')}</th>
          <th className="col-1">{t('TAX_COLUMN_HEADER')}</th>
          <th className="col-1">{t('FINALIZED_COLUMN_HEADER')}</th>
          <th className="col-1">{t('PAID_COLUMN_HEADER')}</th>
          <th className="col-1">{t('DATE_COLUMN_HEADER')}</th>
          <th className="col-1">{t('DEADLINE_COLUMN_HEADER')}</th>
          <th className="col-1">{t('ACTIONS_COLUMN_HEADER')}</th>
        </tr>
        </thead>
        <tbody>
        {(!isInitialLoading && invoicesList.length) ? invoicesList.map((invoice) => (
          <tr key={invoice.id}  className={styles.invoice}>
            <td>{invoice.id}</td>
            <td>
              {invoice.customer?.first_name} {invoice.customer?.last_name}
            </td>
            <td>
              {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
              {invoice.customer?.city}
            </td>
            <td>{invoice.total}</td>
            <td>{invoice.tax}</td>
            <td>{invoice.finalized ? t('YES') : t('NO')}</td>
            <td>{invoice.paid ? t('YES') : t('NO')}</td>
            <td>{invoice.date}</td>
            <td>{invoice.deadline}</td>
            <td>
              <Stack>
                <Button type="button" variant="outline-primary" onClick={makeInvoiceOpener(invoice.id)}>
                  {t('OPEN_INVOICE_BUTTON')}
                </Button>
              </Stack>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={10} className="p-0">
              <Stack className={`align-items-center justify-content-center ${styles['stub-cell']}`}>
                {isInitialLoading ? (
                  <Spinner animation="border" />
                ) : (
                  <h3>{t('NO_RESULTS')}</h3>
                )}
              </Stack>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {isLoading && (
        <div className={`position-absolute ${styles['absolute-spinner']}`}>
          <Stack className="align-items-center justify-content-center w-100 h-100">
            <Spinner animation="border" />
          </Stack>
        </div>
      )}

    </Stack>
  )
}

export default InvoicesTable;
