import { FC, useCallback } from 'react'
import { Form, Stack, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { Customer, LocalInvoice } from 'types'
import { CustomerAutocomplete, CustomerDetails } from 'app/components/index'


interface Props {
  customer?: Customer
  isFinalized?: boolean
  updateInvoice: (updater: LocalInvoice) => void
}
const CustomerForm: FC<Props> = ({ customer, isFinalized, updateInvoice }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.CUSTOMER_FORM' });

  const updateCustomer = useCallback((customer: Customer | null) => {
    if (customer) {
      updateInvoice({ customer, customer_id: customer.id });
    }
  }, [updateInvoice]);

  return (
    <Form.Group>
      <Stack gap={3}>

        <Form.Group>
          <Form.Label>
            {t('CUSTOMER_LABEL')}
          </Form.Label>
          <CustomerAutocomplete
            value={customer || null}
            onChange={updateCustomer}
            isDisabled={isFinalized}
          />
        </Form.Group>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              {t('CUSTOMER_DETAILS_LABEL')}
            </Accordion.Header>
            <Accordion.Body>
              <CustomerDetails customer={customer} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </Stack>
    </Form.Group>
  )
}

export default CustomerForm
