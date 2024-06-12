import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from 'react-bootstrap';

import { ROOT } from 'app/routes';
import styles from './Page404.module.css';

const Page404: FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'AUTH' });

  return (
    <Stack direction="vertical" className={`justify-content-center align-items-center ${styles['page-wrap']}`} gap={2}>
      <h1>
        {t('404')}
      </h1>

      <h5>
        {t('PAGE_NOT_FOUND_TITLE')}
      </h5>

      <p>
        {t('PAGE_NOT_FOUND_TEXT')}
      </p>

      <Button variant="contained">
        <Link to={ROOT}>
          {t('RETURN_BUTTON_TEXT')}
        </Link>
      </Button>
    </Stack>
  );
};

export default Page404;
