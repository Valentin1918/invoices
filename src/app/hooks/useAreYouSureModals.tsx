import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AreYouSureModal} from 'app/components'


interface Props {
  onSubmitUpdateInvoiceModal: () => Promise<void>
  onSubmitDeleteInvoiceModal: () => void
  onSubmitCloseInvoiceModal: () => void
}
export const useAreYouSureModals = ({
  onSubmitUpdateInvoiceModal,
  onSubmitDeleteInvoiceModal,
  onSubmitCloseInvoiceModal,
}: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICE_SHOW' });

  const [updateInvoiceModalIsOpen, setUpdateInvoiceModalIsOpen] = useState(false);
  const openUpdateInvoiceModal = useCallback(() => setUpdateInvoiceModalIsOpen(true), []);
  const closeUpdateInvoiceModal = () => setUpdateInvoiceModalIsOpen(false);

  const [deleteInvoiceModalIsOpen, setDeleteInvoiceModalIsOpen] = useState(false);
  const openDeleteInvoiceModal = useCallback(() => setDeleteInvoiceModalIsOpen(true), []);
  const closeDeleteInvoiceModal = () => setDeleteInvoiceModalIsOpen(false);

  const [leaveInvoiceModalIsOpen, setLeaveInvoiceModalIsOpen] = useState(false);
  const openLeaveInvoiceModal = useCallback(() => setLeaveInvoiceModalIsOpen(true), []);
  const closeLeaveInvoiceModal = () => setLeaveInvoiceModalIsOpen(false);

  const onSubmitUpdate = () => {
    // onSubmitUpdateInvoiceModal.constructor.name === 'AsyncFunction'
    onSubmitUpdateInvoiceModal().finally(closeUpdateInvoiceModal);
  };

  const Modals = (
    <>
      <AreYouSureModal
        show={updateInvoiceModalIsOpen}
        onClose={closeUpdateInvoiceModal}
        onSubmit={onSubmitUpdate}
        bodyText={t('UPDATE_MODAL_BODY')}
        submitButtonText={t('UPDATE_MODAL_BUTTON')}
        key="update"
      />
      <AreYouSureModal
        show={deleteInvoiceModalIsOpen}
        onClose={closeDeleteInvoiceModal}
        onSubmit={onSubmitDeleteInvoiceModal}
        bodyText={t('DELETE_MODAL_BODY')}
        submitButtonText={t('DELETE_MODAL_BUTTON')}
        submitButtonVariant="danger"
        key="delete"
      />
      <AreYouSureModal
        show={leaveInvoiceModalIsOpen}
        onClose={closeLeaveInvoiceModal}
        onSubmit={onSubmitCloseInvoiceModal}
        bodyText={t('LEAVE_MODAL_BODY')}
        submitButtonText={t('LEAVE_MODAL_BUTTON')}
        key="leave"
      />
    </>
  );

  return {
    Modals,
    openUpdateInvoiceModal,
    openDeleteInvoiceModal,
    openLeaveInvoiceModal,
  }
}
