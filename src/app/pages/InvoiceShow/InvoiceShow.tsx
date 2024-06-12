import { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Form, Button, Stack, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

import { useApi } from 'api'
import { InvoiceLinesMapValue, LocalInvoice } from 'types'
import { ROOT, NEW_INVOICE_ID } from 'app/routes'
import { makeInvoiceLinesMap, calculateTotalAndTax } from 'app/utils'
import {
  InvoiceForm,
  AreYouSureModal,
  CustomerForm,
  InvoiceLines,
  InvoiceHandlers,
  NotificationContext,
} from 'app/components'
import { usePostInvoice, usePutInvoice } from 'app/hooks'
import styles from './InvoiceShow.module.css'


const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = useMemo(() => id === NEW_INVOICE_ID, [id]);
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW' });

  const [updateInvoiceModalIsOpen, setUpdateInvoiceModalIsOpen] = useState(false);
  const openUpdateInvoiceModal = useCallback(() => setUpdateInvoiceModalIsOpen(true), []);
  const closeUpdateInvoiceModal = () => setUpdateInvoiceModalIsOpen(false);

  const [deleteInvoiceModalIsOpen, setDeleteInvoiceModalIsOpen] = useState(false);
  const openDeleteInvoiceModal = useCallback(() => setDeleteInvoiceModalIsOpen(true), []);
  const closeDeleteInvoiceModal = () => setDeleteInvoiceModalIsOpen(false);

  const [leaveInvoiceModalIsOpen, setLeaveInvoiceModalIsOpen] = useState(false);
  const openLeaveInvoiceModal = () => setLeaveInvoiceModalIsOpen(true);
  const closeLeaveInvoiceModal = () => setLeaveInvoiceModalIsOpen(false);

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

  const onPutSuccess = (invoice: LocalInvoice, invoiceLinesMap: {[key: string]: InvoiceLinesMapValue} ) => {
    setInvoice(invoice);
    setInitialInvoice(invoice);
    setInvoiceLinesMap(invoiceLinesMap);
    closeUpdateInvoiceModal();
    setIsLoading(false);
  }

  const putInvoice = usePutInvoice({ id, invoice, setIsLoading, onPutSuccess });

  const postInvoice = usePostInvoice({ invoice, setIsLoading });

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


  if (isLoading) {
    return (
      <Stack className="min-vh-100 align-items-center justify-content-center">
        <Spinner animation="border" />
      </Stack>
    )
  }

  return (
    <Stack className={`min-vh-100 align-items-center justify-content-center ${styles['invoice-wrap']}`}>
      <Form className={`pt-4 my-5 ${styles.invoice}`}>
        <Form.Group>
          <Stack gap={3}>
            <Stack direction="horizontal" className="justify-content-start">
              <Button
                variant="outline-info"
                onClick={(isNew || !isVirgin) ? openLeaveInvoiceModal : backToList}
              >
                {t('BACK_TO_LIST_BUTTON')}
              </Button>
            </Stack>

            <Form.Label className="mb-0">
              <h2 className="mb-0">
                {t('TITLE')}
              </h2>
            </Form.Label>

            <InvoiceForm
              invoice={invoice}
              updateInvoice={updateInvoice}
              isFinalized={isFinalized}
              isPaid={isPaid}
            />

            <CustomerForm
              customer={invoice?.customer}
              updateInvoice={updateInvoice}
              isFinalized={isFinalized}
            />

            <InvoiceLines
              isFinalized={isFinalized}
              invoiceLinesMap={invoiceLinesMap}
              setInvoiceLinesMap={setInvoiceLinesMap}
            />

            <InvoiceHandlers
              {...{ isNew, isVirgin, isPaid, isFinalized }}
              hasCustomer={!!invoice.customer_id}
              onCreate={postInvoice}
              onDelete={openDeleteInvoiceModal}
              onUpdate={openUpdateInvoiceModal}
            />
          </Stack>
        </Form.Group>
      </Form>
      <AreYouSureModal
        show={updateInvoiceModalIsOpen}
        onClose={closeUpdateInvoiceModal}
        onSubmit={putInvoice}
        bodyText={t('UPDATE_MODAL_BODY')}
        submitButtonText={t('UPDATE_MODAL_BUTTON')}
        key="update"
      />
      <AreYouSureModal
        show={deleteInvoiceModalIsOpen}
        onClose={closeDeleteInvoiceModal}
        onSubmit={deleteInvoice}
        bodyText={t('DELETE_MODAL_BODY')}
        submitButtonText={t('DELETE_MODAL_BUTTON')}
        submitButtonVariant="danger"
        key="delete"
      />
      <AreYouSureModal
        show={leaveInvoiceModalIsOpen}
        onClose={closeLeaveInvoiceModal}
        onSubmit={backToList}
        bodyText={t('LEAVE_MODAL_BODY')}
        submitButtonText={t('LEAVE_MODAL_BUTTON')}
        key="leave"
      />
    </Stack>
  )
}

export default InvoiceShow;
