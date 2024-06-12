import { useEffect, useState, ReactElement, ChangeEvent, FC, useRef } from 'react'
import { Stack, Button, Form, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import { Customer, ArithmeticOperator } from 'types'
import { CustomerAutocomplete } from 'app/components'

import { prepareFilter } from 'app/utils'
import styles from './FilteringSection.module.css';

interface Props {
  setFilter: (filter: string) => void
}
const FilteringSection: FC<Props> = ({ setFilter }): ReactElement => {
  const { t } = useTranslation('translation', { keyPrefix: 'INVOICES_LIST.FILTERING' });
  const accordionRef = useRef<HTMLDivElement | null>(null);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [total, setTotal] = useState<string>('');
  const [totalOperator, setTotalOperator] = useState<ArithmeticOperator>('gt');
  const [finalized, setFinalized] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');
  const [dateOperator, setDateOperator] = useState<ArithmeticOperator>('gt');
  const [deadline, setDeadline] = useState<string>('');
  const [deadlineOperator, setDeadlineOperator] = useState<ArithmeticOperator>('gt');
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(null);
  const [autocompleteIsOpen, setAutocompleteIsOpen] = useState<boolean>(false);

  const onFinalizedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFinalized(e.target.checked);
  };

  const onPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaid(e.target.checked);
  };

  const onTotalOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTotalOperator(e.target.value as ArithmeticOperator);
  };

  const onDateOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateOperator(e.target.value as ArithmeticOperator);
  };

  const onTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value);
  };

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const onDeadlineOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDeadlineOperator(e.target.value as ArithmeticOperator);
  };

  const onDeadlineChange =(e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const clearCustomer = () => {
    setCustomer(null);
  };

  const resetAll = () => {
    clearCustomer();
    setFinalized(false);
    setPaid(false);
    setTotal('');
    setTotalOperator('gt');
    setDate('');
    setDateOperator('gt');
    setDeadline('');
    setDeadlineOperator('gt');
    setActiveAccordionKey(null);
  };

  useEffect(() => {
    setFilter(prepareFilter({
      customer, total, totalOperator, finalized, paid, date, dateOperator, deadline, deadlineOperator
    }))
  }, [setFilter, customer, total, totalOperator, finalized, paid, date, dateOperator, deadline, deadlineOperator]);

  useEffect(() => {

    const clickOutsideHandler = (e: MouseEvent | TouchEvent) => {
      if (accordionRef.current && !accordionRef.current.contains(e.target as HTMLDivElement)) {
        if (!autocompleteIsOpen) {
          setActiveAccordionKey(null);
        }
      }
    };

    document.addEventListener('click', clickOutsideHandler, true);

    return () => document.removeEventListener('click', clickOutsideHandler, true);
  }, [autocompleteIsOpen])

  const onAccordionSelect = (eventKey: string | string[] | undefined | null) => {
    if (typeof eventKey === 'string' || eventKey === null) {
      setActiveAccordionKey(eventKey)
    }
  }

  return (
    <Accordion
      className={styles['filtering-section']}
      ref={accordionRef}
      activeKey={activeAccordionKey}
      onSelect={onAccordionSelect}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          {t('FILTERING_OPTIONS')}
        </Accordion.Header>
        <Accordion.Body>
          <Stack gap={3}>

            <Stack gap={3} direction="horizontal">

              <Form.Group className="flex-grow-1">
                <Form.Label>
                  {t('TOTAL_LABEL')}
                </Form.Label>
                <Stack gap={3} direction="horizontal">

                  <Form.Select
                    value={totalOperator}
                    onChange={onTotalOperatorChange}
                    className={styles['input-wrap']}
                  >
                    <option value="gt">{t('MORE')}</option>
                    <option value="lt">{t('LESS')}</option>
                    <option value="eq">{t('EQUAL')}</option>
                  </Form.Select>

                  <Form.Control
                    className={styles['input-wrap']}
                    type="number"
                    min={0}
                    value={total}
                    onChange={onTotalChange}
                  />
                </Stack>
              </Form.Group>

              <Form.Group className="flex-grow-1">
                <Form.Label>
                  {t('STATUSES_LABEL')}
                </Form.Label>
                <Stack gap={3} direction="horizontal">

                  <Form.Check
                    type="checkbox"
                    label="Finalized"
                    checked={finalized}
                    onChange={onFinalizedChange}
                    className={styles['input-wrap']}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Paid"
                    checked={paid}
                    onChange={onPaidChange}
                    className={styles['input-wrap']}
                  />
                </Stack>
              </Form.Group>

            </Stack>

            <Stack gap={3} direction="horizontal">

              <Form.Group className="flex-grow-1">
                <Form.Label>
                  {t('DATE_LABEL')}
                </Form.Label>
                <Stack gap={3} direction="horizontal">

                  <Form.Select
                    value={dateOperator}
                    onChange={onDateOperatorChange}
                    className={styles['input-wrap']}
                  >
                    <option value="gt">{t('MORE')}</option>
                    <option value="lt">{t('LESS')}</option>
                    <option value="eq">{t('EQUAL')}</option>
                  </Form.Select>

                  <Form.Control
                    type="date"
                    value={date ? `${date}` : ''}
                    onChange={onDateChange}
                    className={styles['input-wrap']}
                  />
                </Stack>
              </Form.Group>

              <Form.Group className="flex-grow-1">
                <Form.Label>
                  {t('DEADLINE_LABEL')}
                </Form.Label>
                <Stack gap={3} direction="horizontal">

                  <Form.Select
                    value={deadlineOperator}
                    onChange={onDeadlineOperatorChange}
                    className={styles['input-wrap']}
                  >
                    <option value="gt">{t('MORE')}</option>
                    <option value="lt">{t('LESS')}</option>
                    <option value="eq">{t('EQUAL')}</option>
                  </Form.Select>

                  <Form.Control
                    type="date"
                    value={deadline ? `${deadline}` : ''}
                    onChange={onDeadlineChange}
                    className={styles['input-wrap']}
                  />
                </Stack>
              </Form.Group>

            </Stack>

            <Stack gap={3} direction="horizontal">
              <Form.Group>
                <Form.Label>
                  {t('CUSTOMER_LABEL')}
                </Form.Label>
                <Stack gap={3} direction="horizontal">
                  <CustomerAutocomplete
                    value={customer}
                    onChange={setCustomer}
                    className={styles['autocomplete-wrap']}
                    setAutocompleteIsOpen={setAutocompleteIsOpen}
                  />
                  <Button
                    className={styles['clear-customer-button']}
                    onClick={clearCustomer}
                    variant="outline-primary"
                  >
                    {t('CLEAR_CUSTOMER_BUTTON')}
                  </Button>
                </Stack>
              </Form.Group>

              <Stack direction="horizontal" gap={3} className="w-100 justify-content-end align-items-end">
                <Button
                  className={styles['reset-button']}
                  onClick={resetAll}
                >
                  {t('RESET_ALL_BUTTON')}
                </Button>
              </Stack>
            </Stack>

          </Stack>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default FilteringSection;
