import { FC, ChangeEvent, useCallback, memo } from 'react'
import { Form, Stack, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { Product } from 'types'
import { Components } from 'api/gen/client'
import { makeFinancialFormat } from 'app/utils'
import { ProductAutocomplete, ProductDetails } from './index'

interface Props {
  lineId: number
  product?: Product
  quantity: number
  price: string
  tax: string
  updateInvoiceLinesMap: (id: number, updatedInvoiceLine: Partial<Components.Schemas.InvoiceLine>) => void
  isFinalized?: boolean
}
const InvoiceLine: FC<Props> = ({
  lineId,
  product,
  quantity,
  price,
  tax,
  updateInvoiceLinesMap,
  isFinalized,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.INVOICE_LINES' });

  const onProductChange = useCallback((product: Product | null) => {
    if (product) {
      updateInvoiceLinesMap(lineId, {
        product,
        product_id: product.id,
        label: product.label,
        unit: product?.unit,
        vat_rate: product?.vat_rate,
        price: makeFinancialFormat(+product.unit_price * quantity),
        tax: makeFinancialFormat(+product.unit_tax * quantity),
      });
    }
  }, [lineId, quantity, updateInvoiceLinesMap]);

  const onQuantityChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const quantity = +e.target.value;

    updateInvoiceLinesMap(lineId, {
      quantity,
      ...(product ? { price: makeFinancialFormat(+product.unit_price * quantity) } : {}),
      ...(product ? { tax: makeFinancialFormat(+product.unit_tax * quantity) } : {}),
    });
  }, [lineId, updateInvoiceLinesMap, product]);

  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={3}>
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('PRODUCT_LABEL')}
          </Form.Label>
          <ProductAutocomplete
            value={product || null}
            onChange={onProductChange}
            isDisabled={isFinalized}
          />
        </Form.Group>

        <Form.Group className="flex-grow-3">
          <Form.Label>
            {t('QUANTITY_LABEL')}
          </Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={quantity}
            onChange={onQuantityChange}
            disabled={isFinalized}
          />
        </Form.Group>
      </Stack>

      <Stack direction="horizontal" gap={3}>
        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('PRICE_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(price)}
            disabled
          />
        </Form.Group>

        <Form.Group className="flex-grow-1">
          <Form.Label>
            {t('TAX_LABEL')}
          </Form.Label>
          <Form.Control
            type="text"
            value={makeFinancialFormat(tax)}
            disabled
          />
        </Form.Group>
      </Stack>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {t('PRODUCT_DETAILS_LABEL')}
          </Accordion.Header>
          <Accordion.Body>
            <ProductDetails product={product} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Stack>
  )
}

export default memo(InvoiceLine)
