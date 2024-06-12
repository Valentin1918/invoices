import { FC, memo } from 'react'
import { Form, Stack } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { Customer } from 'types'


interface Props {
  customer?: Customer
}
const CustomerDetails: FC<Props> = ({ customer }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.CUSTOMER_FORM' });

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('FIRST_NAME_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.first_name || ''} />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('LAST_NAME_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.last_name || ''} />
        </Form.Group>
      </Stack>

      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('ADDRESS_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.address || ''} />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('CITY_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.city || ''} />
        </Form.Group>
      </Stack>

      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('COUNTRY_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.country || ''} />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('ZIP_CODE_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={customer?.zip_code || ''} />
        </Form.Group>
      </Stack>
    </Stack>
  )
}

export default memo(CustomerDetails)
