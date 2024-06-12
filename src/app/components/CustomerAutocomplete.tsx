import { useCallback, FC, useState } from 'react'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'
import { GroupBase } from 'react-select'

import { Customer } from 'types'
import { useApi } from 'api'

interface Props {
  value: Customer | null
  onChange: (Customer: Customer | null) => void
  className?: string,
  isDisabled?: boolean,
  setAutocompleteIsOpen?: (isOpen: boolean) => void
}

const defaultAdditional = { page: 1 }

const getCustomerLabel = (customer: Customer) => {
  return `${customer.first_name} ${customer.last_name}`
}

const getCustomerValue = (customer: Customer) => `${customer.id}`;

const CustomerAutocomplete: FC<Props> = ({
  value,
  onChange,
  className,
  isDisabled,
  setAutocompleteIsOpen,
}) => {
  const api = useApi();

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const updateMenuIsOpen = useCallback((value: boolean) => {
    setMenuIsOpen(value);
    if (setAutocompleteIsOpen) {
      setAutocompleteIsOpen(value);
    }
  }, [setAutocompleteIsOpen]);

  const onMenuOpen = useCallback(() => updateMenuIsOpen(true), [updateMenuIsOpen]);
  const onMenuClose = useCallback(() => updateMenuIsOpen(false), [updateMenuIsOpen]);

  const loadOptions: LoadOptions<Customer, GroupBase<Customer>, {page: number}> = useCallback(
    async (search, loadedOptions, additional) => {
      const page = additional?.page ?? 1
      const { data } = await api.getSearchCustomers({
        query: search,
        per_page: 10,
        page,
      })

      return {
        options: data.customers,
        hasMore: data.pagination.page < data.pagination.total_pages,
        additional: {
          page: page + 1,
        },
      }
    },
    [api]
  )

  return (
    <AsyncPaginate
      className={className}
      placeholder="Search a customer"
      debounceTimeout={500}
      getOptionLabel={getCustomerLabel}
      getOptionValue={getCustomerValue}
      additional={defaultAdditional}
      value={value}
      onChange={onChange}
      loadOptions={loadOptions}
      isDisabled={isDisabled}
      menuIsOpen={menuIsOpen}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
    />
  )
}

export default CustomerAutocomplete
