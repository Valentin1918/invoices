import { FC, memo } from 'react'
import { Button, Stack } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props {
  isNew: boolean
  isVirgin: boolean
  isPaid?: boolean
  isFinalized?: boolean
  hasCustomer: boolean
  onCreate: () => void
  onDelete: () => void
  onUpdate: () => void
}
const InvoiceHandlers: FC<Props> = ({
  isNew,
  isVirgin,
  isPaid,
  isFinalized,
  hasCustomer,
  onCreate,
  onDelete,
  onUpdate,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW.HANDLERS' });

  return (
    <Stack direction="horizontal" gap={3} className="justify-content-center">
      {isNew && (
        <Button
          variant="primary"
          disabled={!hasCustomer}
          onClick={onCreate}
        >
          {t('CREATE_BUTTON')}
        </Button>
      )}
      {(!isFinalized && !isNew) && (
        <Button
          variant="danger"
          onClick={onDelete}
        >
          {t('DELETE_BUTTON')}
        </Button>
      )}
      {(!isPaid && !isNew) && (
        <Button
          variant="primary"
          disabled={isVirgin}
          onClick={onUpdate}
        >
          {t('UPDATE_BUTTON')}
        </Button>
      )}
    </Stack>
  );
}

export default memo(InvoiceHandlers);
