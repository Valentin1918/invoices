import { FC, useCallback } from 'react'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'
import { GroupBase } from 'react-select'

import { Product } from 'types'
import { useApi } from 'api'

interface Props {
  value: Product | null
  onChange: (product: Product | null) => void
  className?: string
  placeholder?: string
  isDisabled?: boolean
}

const defaultAdditional = { page: 1 }

const getCustomerValue = (product: Product) => `${product.id}`;

const ProductAutocomplete: FC<Props> = ({
  value,
  onChange,
  className,
  placeholder,
  isDisabled,
}) => {

  const api = useApi()

  const loadOptions: LoadOptions<Product, GroupBase<Product>, {page: number}> = useCallback(
    async (search, loadedOptions, additional) => {
      const page = additional?.page ?? 1
      const { data } = await api.getSearchProducts({
        query: search,
        per_page: 10,
        page,
      })

      return {
        options: data.products,
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
      placeholder={placeholder || 'Search a product'}
      debounceTimeout={500}
      additional={defaultAdditional}
      getOptionValue={getCustomerValue}
      value={value}
      onChange={onChange}
      loadOptions={loadOptions}
      isDisabled={isDisabled}
    />
  )
}

export default ProductAutocomplete
