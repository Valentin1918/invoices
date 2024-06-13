import { useNavigate } from 'react-router'
import { Form, Button, Stack, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ROOT } from 'app/routes'
import {
  InvoiceForm,
  CustomerForm,
  InvoiceLines,
} from 'app/components'
import { useInvoice, useAreYouSureModals } from 'app/hooks';
import styles from './Invoice.module.css'


const Invoice = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW' });
  const navigate = useNavigate();
  const backToList = () => navigate(ROOT);

  const {
    invoice,
    invoiceLinesMap,
    isNew,
    isLoading,
    isVirgin,
    isFinalized,
    isPaid,
    postInvoice,
    putInvoice,
    deleteInvoice,
    updateInvoice,
    setInvoiceLinesMap,
  } = useInvoice();

  const {
    Modals,
    openUpdateInvoiceModal,
    openDeleteInvoiceModal,
    openLeaveInvoiceModal,
  } = useAreYouSureModals({
    onSubmitUpdateInvoiceModal: putInvoice,
    onSubmitDeleteInvoiceModal: deleteInvoice,
    onSubmitCloseInvoiceModal: backToList,
  });


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

            <Stack direction="horizontal" gap={3} className="justify-content-center">
              {isNew && (
                <Button
                  variant="primary"
                  disabled={!invoice.customer_id}
                  onClick={postInvoice}
                >
                  {t('CREATE_BUTTON')}
                </Button>
              )}
              {(!isFinalized && !isNew) && (
                <Button
                  variant="danger"
                  onClick={openDeleteInvoiceModal}
                >
                  {t('DELETE_BUTTON')}
                </Button>
              )}
              {(!isPaid && !isNew) && (
                <Button
                  variant="primary"
                  disabled={isVirgin}
                  onClick={openUpdateInvoiceModal}
                >
                  {t('UPDATE_BUTTON')}
                </Button>
              )}
            </Stack>

          </Stack>
        </Form.Group>
      </Form>
      {Modals}
    </Stack>
  )
}

export default Invoice;
