import { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'

import styles from './AreYouSureModal.module.css'

interface Props {
  show: boolean
  onClose: () => void
  onSubmit: () => void
  bodyText: string
  submitButtonText: string
  submitButtonVariant?: string
}
const AreYouSureModal: FC<Props> = ({
  show,
  onClose,
  onSubmit,
  bodyText,
  submitButtonText,
  submitButtonVariant,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'ARE_YOU_SURE_MODAL' });
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>
          {t('TITLE')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer className={classnames( { [styles.reverse]: submitButtonVariant === 'danger' })}>
        <Button variant="secondary" onClick={onClose}>
          {t('CANCEL_BUTTON')}
        </Button>
        <Button variant={submitButtonVariant || 'primary'} onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AreYouSureModal;