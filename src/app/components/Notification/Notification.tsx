import { createContext, FC, memo } from 'react'
import { ToastContainer, Toast } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'

interface NotificationState {
  showNotification: (name: Events) => void
}

export const NotificationContext = createContext<NotificationState>({
  showNotification: () => {},
})

const emptyNotification = {
  title: '', text: '', variant: 'secondary'
}

export type Events = 'invoiceCreated' | 'invoiceUpdated' | 'invoiceDeleted' | 'error';

interface Props {
  activeNotification: Events | null
  onClose: () => void
}
const Notification: FC<Props> = ({ activeNotification, onClose }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'NOTIFICATION' });

  const notificationMap = {
    invoiceCreated: { title: t('INVOICE_CREATED.TITLE'), text: t('INVOICE_CREATED.TEXT'), variant: 'success' },
    invoiceUpdated: { title: t('INVOICE_UPDATED.TITLE'), text: t('INVOICE_UPDATED.TEXT'), variant: 'success' },
    invoiceDeleted: { title: t('INVOICE_DELETED.TITLE'), text: t('INVOICE_DELETED.TEXT'), variant: 'success' },
    error: { title: t('ERROR.TITLE'), text: t('INVOICE_DELETED.TEXT'), variant: 'danger' },
  };

  const notification = activeNotification ? (notificationMap[activeNotification] || emptyNotification) : emptyNotification;
  const show = !!(activeNotification && notificationMap[activeNotification]);


  return (
    <ToastContainer
      className="p-3"
      position="bottom-end"
    >
      <Toast onClose={onClose} show={show} delay={3000} autohide bg={notification.variant}>
        <Toast.Header>
          <strong className="me-auto">
            {notification?.title}
          </strong>
        </Toast.Header>
        <Toast.Body>
          {notification?.text}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default memo(Notification);
