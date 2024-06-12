import { FC } from 'react'
import { Form, Stack } from 'react-bootstrap'

import { Product } from 'types'
import { makeFinancialFormat } from 'app/utils'
import { useTranslation } from 'react-i18next'

interface Props {
  product?: Product | null
}
const ProductDetails: FC<Props> = ({ product }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.INVOICE_LINES.PRODUCT_DETAILS' });

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('LABEL_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={product?.label || ''} />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('UNIT_LABEL')}
          </Form.Label>
          <Form.Control type="text" disabled value={product?.unit || ''} />
        </Form.Group>
      </Stack>

      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('PRICE_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(product?.unit_price)}
            disabled
          />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('TAX_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(product?.unit_tax)}
            disabled
          />
        </Form.Group>
      </Stack>

      <Stack gap={3} direction="horizontal">
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('PRICE_WO_TAX_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(product?.unit_price_without_tax)}
            disabled
          />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('VAT_RATE_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(product?.vat_rate)}
            disabled
          />
        </Form.Group>
      </Stack>
    </Stack>
  )
}

export default ProductDetails
