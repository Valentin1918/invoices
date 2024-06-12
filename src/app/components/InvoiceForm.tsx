import { useCallback, ChangeEvent, FC, memo } from 'react'
import { Form, Stack } from 'react-bootstrap'

import { LocalInvoice } from 'types'
import { makeFinancialFormat } from '../utils'
import { useTranslation } from 'react-i18next'

interface Props {
  invoice: LocalInvoice
  updateInvoice: (updater: LocalInvoice) => void
  isFinalized?: boolean
  isPaid?: boolean
}
const InvoiceForm: FC<Props> = ({ invoice, updateInvoice, isFinalized, isPaid }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.INVOICE_FORM' });

  const onFinalizedChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ finalized: e.target.checked });
  }, [updateInvoice]);

  const onPaidChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ paid: e.target.checked });
  }, [updateInvoice]);

  const onDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ date: e.target.value });
  }, [updateInvoice]);

  const onDeadlineChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ deadline: e.target.value });
  }, [updateInvoice]);

  return (
    <Stack gap={3}>

      <Form.Group>
        <Stack gap={3} direction="horizontal">
          <Form.Group className="flex-grow-1">
            <Form.Label>
              {t('TOTAL_LABEL')}
            </Form.Label>
            <Form.Control
              type="text"
              value={makeFinancialFormat(invoice.total)}
              disabled
            />
          </Form.Group>

          <Form.Group className="flex-grow-1">
            <Form.Label>
              {t('TAX_LABEL')}
            </Form.Label>
            <Form.Control
              type="text"
              value={makeFinancialFormat(invoice.tax)}
              disabled
            />
          </Form.Group>
        </Stack>
      </Form.Group>

      <Form.Group>
        <Stack gap={3} direction="horizontal">
          <Form.Group className="w-50">
            <Form.Check
              type="checkbox"
              label={t('FINALIZED_LABEL')}
              checked={invoice?.finalized || false}
              onChange={onFinalizedChange}
              disabled={isFinalized}
            />
          </Form.Group>

          <Form.Group className="w-50">
            <Form.Check
              type="checkbox"
              label={t('PAID_LABEL')}
              checked={invoice?.paid || false}
              onChange={onPaidChange}
              disabled={isFinalized && isPaid}
            />
          </Form.Group>
        </Stack>
      </Form.Group>

      <Form.Group>
        <Stack gap={3} direction="horizontal">
          <Form.Group className="flex-grow-1">
            <Form.Label>
              {t('DATE_LABEL')}
            </Form.Label>
            <Form.Control
              type="date"
              value={invoice?.date ? `${invoice.date}` : ''}
              onChange={onDateChange}
              disabled={isFinalized}
            />
          </Form.Group>

          <Form.Group className="flex-grow-1">
            <Form.Label>
              {t('DEADLINE_LABEL')}
            </Form.Label>
            <Form.Control
              type="date"
              value={invoice?.deadline ? `${invoice.deadline}` : ''}
              onChange={onDeadlineChange}
              disabled={isFinalized}
            />
          </Form.Group>
        </Stack>
      </Form.Group>

    </Stack>
  )
}

export default memo(InvoiceForm)
