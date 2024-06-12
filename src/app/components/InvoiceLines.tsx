import { FC, useState, useCallback, MouseEvent, Dispatch, SetStateAction } from 'react'
import { useParams } from 'react-router'
import { Form, Button, Stack, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { InvoiceLinesMapValue } from 'types'
import { Components } from 'api/gen/client'
import { makeRandomTempoId } from 'app/utils'
import { InvoiceLine } from 'app/components/index'

interface Props {
  isFinalized?: boolean
  invoiceLinesMap: {[key: number]: InvoiceLinesMapValue}
  setInvoiceLinesMap: Dispatch<SetStateAction<{   [p: number]: InvoiceLinesMapValue }>>
}
const InvoiceLines: FC<Props> = ({ isFinalized, invoiceLinesMap, setInvoiceLinesMap  }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.INVOICE_LINES' });

  const [expandedLineId, setExpandedLineId] = useState<string | undefined>();
  const resetExpandedLineId = () => setExpandedLineId(undefined);

  const updateInvoiceLinesMap = useCallback((id: number, updatedInvoiceLine: Partial<Components.Schemas.InvoiceLine>) => {
    setInvoiceLinesMap((currentInvoiceLinesMap) => {
      return {
        ...currentInvoiceLinesMap, [id]: { ...currentInvoiceLinesMap[id], ...updatedInvoiceLine }
      }
    })
  }, [setInvoiceLinesMap]);

  const handleAddLine = () => {
    setInvoiceLinesMap((currentInvoiceLinesMap) => {
      const ids = Object.keys(currentInvoiceLinesMap);

      let tempoId;
      do {
        tempoId = makeRandomTempoId();
      } while (ids.includes(`${tempoId}`));

      setExpandedLineId(`${tempoId}`);

      return {
        ...currentInvoiceLinesMap, [tempoId]: {
          id: tempoId,
          quantity: 0,
          price: '0.00',
          tax: '0.00',
          invoice_id: isNaN(Number(id)) ? undefined : Number(id)
        }
      }
    })
  };

  const makeOnDeleteLine = (id: number) => (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setInvoiceLinesMap((currentInvoiceLinesMap) => {
      const copy = { ...currentInvoiceLinesMap };

      if (id < 0) {
        delete copy[id];
        return copy;
      }

      return {...currentInvoiceLinesMap, [id]: { ...currentInvoiceLinesMap[id], _destroy: true }}
    })
  };

  return (
    <Form.Group>
      <Form.Label>
        {t('TITLE')}
      </Form.Label>

      <Accordion activeKey={expandedLineId} onSelect={resetExpandedLineId}>
        {Object.values(invoiceLinesMap).map(({
           id,
           label,
           product,
           quantity,
           price,
           tax,
           _destroy,
         }, index, array) => _destroy ? null : (
          <Accordion.Item eventKey={`${id}`} key={id}>
            <Accordion.Header>
              <Stack direction="horizontal" className={`w-100 me-3 justify-content-${product ? 'between' : 'end'}`}>
                {label}
                {!isFinalized && (
                  <div className="btn btn-outline-danger" onClick={makeOnDeleteLine(id)}>
                    {t('DELETE_LINE_BUTTON')}
                  </div>
                )}
              </Stack>

            </Accordion.Header>
            <Accordion.Body>
              <InvoiceLine
                lineId={id}
                {...{ product, quantity, price, tax }}
                updateInvoiceLinesMap={updateInvoiceLinesMap}
                isFinalized={isFinalized}
              />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {!isFinalized && (
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={handleAddLine}
        >
          {t('ADD_LINE_BUTTON')}
        </Button>
      )}
    </Form.Group>
  )
}

export default InvoiceLines
