import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
  namespace Schemas {
    export interface Customer {
      /**
       * example:
       * 6773
       */
      id: number;
      /**
       * example:
       * Jean
       */
      first_name: string;
      /**
       * example:
       * Dupont
       */
      last_name: string;
      /**
       * example:
       * 9 impasse Sauvey
       */
      address: string;
      /**
       * example:
       * 50100
       */
      zip_code: string;
      /**
       * example:
       * Cherbourg
       */
      city: string;
      /**
       * example:
       * France
       */
      country: string;
      /**
       * example:
       * FR
       */
      country_code: string;
    }
    export interface Error {
      message: string;
    }
    export interface Invoice {
      /**
       * example:
       * 5785
       */
      id: number;
      /**
       * example:
       * 6773
       */
      customer_id: number | null;
      /**
       * example:
       * false
       */
      finalized: boolean;
      /**
       * example:
       * true
       */
      paid: boolean;
      /**
       * example:
       * 2021-02-03
       */
      date: string | null;
      /**
       * example:
       * 2021-03-05
       */
      deadline: string | null;
      /**
       * example:
       * 120.00
       */
      total: string | null;
      /**
       * example:
       * 20.00
       */
      tax: string | null;
      invoice_lines: InvoiceLine[];
    }
    export interface InvoiceCreatePayload {
      /**
       * example:
       * 6773
       */
      customer_id: number;
      /**
       * example:
       * false
       */
      finalized?: boolean;
      /**
       * example:
       * true
       */
      paid?: boolean;
      /**
       * example:
       * 2021-02-03
       */
      date?: string | null;
      /**
       * example:
       * 2021-03-05
       */
      deadline?: string | null;
      invoice_lines_attributes?: InvoiceLineCreatePayload[];
    }
    export interface InvoiceLine {
      /**
       * example:
       * 9181
       */
      id: number;
      /**
       * example:
       * 5785
       */
      invoice_id: number;
      /**
       * example:
       * 67
       */
      product_id: number;
      /**
       * example:
       * 1
       */
      quantity: number;
      /**
       * example:
       * Tesla Model S with Pennylane logo
       */
      label: string;
      unit: Unit;
      vat_rate: VatRate;
      /**
       * example:
       * 1s20.00
       */
      price: string;
      /**
       * example:
       * 20.00
       */
      tax: string;
      product: Product;
    }
    export interface InvoiceLineCreatePayload {
      /**
       * example:
       * 67
       */
      product_id: number;
      /**
       * example:
       * 1
       */
      quantity?: number;
      /**
       * example:
       * Tesla Model S with Pennylane logo
       */
      label?: string;
      unit?: Unit;
      vat_rate?: VatRate;
      /**
       * example:
       * 120.00
       */
      price?: string | number;
      /**
       * example:
       * 20.00
       */
      tax?: string | number;
    }
    export interface InvoiceLineUpdatePayload {
      /**
       * If this parameter is set, the identified invoice_line will be updated (or deleted if _destroy is set to true) If this parameter is not set, a new invoice_line will be created
       * 
       * example:
       * 45
       */
      id?: number;
      /**
       * If this parameter is set to true, and if "id" is set, the identified invoice_line will be deleted
       * 
       * example:
       * false
       */
      _destroy?: boolean;
      /**
       * example:
       * 67
       */
      product_id?: number;
      /**
       * example:
       * 1
       */
      quantity?: number;
      /**
       * example:
       * Tesla Model S with Pennylane logo
       */
      label?: string;
      unit?: Unit;
      vat_rate?: VatRate;
      /**
       * example:
       * 120.00
       */
      price?: string | number;
      /**
       * example:
       * 20.00
       */
      tax?: string | number;
    }
    export interface InvoiceUpdatePayload {
      /**
       * example:
       * 6757
       */
      id: number;
      /**
       * example:
       * 6773
       */
      customer_id?: number;
      /**
       * example:
       * false
       */
      finalized?: boolean;
      /**
       * example:
       * true
       */
      paid?: boolean;
      /**
       * example:
       * 2021-02-03
       */
      date?: string | null;
      /**
       * example:
       * 2021-03-05
       */
      deadline?: string | null;
      invoice_lines_attributes?: InvoiceLineUpdatePayload[];
    }
    export interface Pagination {
      /**
       * example:
       * 2
       */
      page: number;
      /**
       * example:
       * 25
       */
      page_size: number;
      /**
       * example:
       * 2
       */
      total_pages: number;
      /**
       * example:
       * 30
       */
      total_entries: number;
    }
    export interface Product {
      /**
       * example:
       * 67
       */
      id: number;
      /**
       * example:
       * Tesla Model S
       */
      label: string;
      vat_rate: VatRate;
      unit: Unit;
      /**
       * example:
       * 1980
       */
      unit_price: string;
      /**
       * example:
       * 1800
       */
      unit_price_without_tax: string;
      /**
       * example:
       * 180
       */
      unit_tax: string;
    }
    export type Unit = "hour" | "day" | "piece";
    export type VatRate = "0" | "5.5" | "10" | "20";
  }
}
declare namespace Paths {
  namespace DeleteInvoice {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Id = number;
      export type XSESSION = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
  }
  namespace GetInvoice {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Id = number;
      export type XSESSION = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Invoice;
    }
  }
  namespace GetInvoices {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Filter = string;
      export type Page = number;
      export type PerPage = number;
      export type XSESSION = string;
    }
    export interface QueryParameters {
      page?: Parameters.Page;
      per_page?: Parameters.PerPage;
      filter?: Parameters.Filter;
    }
    namespace Responses {
      export interface $200 {
        pagination: Components.Schemas.Pagination;
        invoices: {
          /**
           * example:
           * 5785
           */
          id: number;
          /**
           * example:
           * 6773
           */
          customer_id: number | null;
          /**
           * example:
           * false
           */
          finalized: boolean;
          /**
           * example:
           * true
           */
          paid: boolean;
          /**
           * example:
           * 2021-02-03
           */
          date: string | null;
          /**
           * example:
           * 2021-03-05
           */
          deadline: string | null;
          /**
           * example:
           * 120.00
           */
          total: string | null;
          /**
           * example:
           * 20.00
           */
          tax: string | null;
          invoice_lines: Components.Schemas.InvoiceLine[];
          customer?: Components.Schemas.Customer;
        }[];
      }
    }
  }
  namespace GetSearchCustomers {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Page = number;
      export type PerPage = number;
      export type Query = string;
      export type XSESSION = string;
    }
    export interface QueryParameters {
      query?: Parameters.Query;
      page?: Parameters.Page;
      per_page?: Parameters.PerPage;
    }
    namespace Responses {
      export interface $200 {
        pagination: Components.Schemas.Pagination;
        customers: Components.Schemas.Customer[];
      }
    }
  }
  namespace GetSearchProducts {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Page = number;
      export type PerPage = number;
      export type Query = string;
      export type XSESSION = string;
    }
    export interface QueryParameters {
      query?: Parameters.Query;
      page?: Parameters.Page;
      per_page?: Parameters.PerPage;
    }
    namespace Responses {
      export interface $200 {
        pagination: Components.Schemas.Pagination;
        products: Components.Schemas.Product[];
      }
    }
  }
  namespace PostInvoices {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type XSESSION = string;
    }
    export interface RequestBody {
      invoice?: Components.Schemas.InvoiceCreatePayload;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Invoice;
    }
  }
  namespace PutInvoice {
    export interface HeaderParameters {
      "X-SESSION"?: Parameters.XSESSION;
    }
    namespace Parameters {
      export type Id = number;
      export type XSESSION = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export interface RequestBody {
      invoice?: Components.Schemas.InvoiceUpdatePayload;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Invoice;
    }
  }
}

export interface OperationMethods {
  /**
   * getSearchProducts - Search products
   */
  'getSearchProducts'(
    parameters?: Parameters<Paths.GetSearchProducts.QueryParameters & Paths.GetSearchProducts.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSearchProducts.Responses.$200>
  /**
   * getSearchCustomers - Search customers
   */
  'getSearchCustomers'(
    parameters?: Parameters<Paths.GetSearchCustomers.QueryParameters & Paths.GetSearchCustomers.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSearchCustomers.Responses.$200>
  /**
   * getInvoices - list invoices
   */
  'getInvoices'(
    parameters?: Parameters<Paths.GetInvoices.QueryParameters & Paths.GetInvoices.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetInvoices.Responses.$200>
  /**
   * postInvoices - create an invoice
   */
  'postInvoices'(
    parameters?: Parameters<Paths.PostInvoices.HeaderParameters> | null,
    data?: Paths.PostInvoices.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostInvoices.Responses.$200>
  /**
   * getInvoice - get an invoice
   */
  'getInvoice'(
    parameters?: Parameters<Paths.GetInvoice.PathParameters & Paths.GetInvoice.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetInvoice.Responses.$200>
  /**
   * putInvoice - update an invoice
   */
  'putInvoice'(
    parameters?: Parameters<Paths.PutInvoice.PathParameters & Paths.PutInvoice.HeaderParameters> | null,
    data?: Paths.PutInvoice.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutInvoice.Responses.$200>
  /**
   * deleteInvoice - delete an invoice
   */
  'deleteInvoice'(
    parameters?: Parameters<Paths.DeleteInvoice.PathParameters & Paths.DeleteInvoice.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
}

export interface PathsDictionary {
  ['/products/search']: {
    /**
     * getSearchProducts - Search products
     */
    'get'(
      parameters?: Parameters<Paths.GetSearchProducts.QueryParameters & Paths.GetSearchProducts.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSearchProducts.Responses.$200>
  }
  ['/customers/search']: {
    /**
     * getSearchCustomers - Search customers
     */
    'get'(
      parameters?: Parameters<Paths.GetSearchCustomers.QueryParameters & Paths.GetSearchCustomers.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSearchCustomers.Responses.$200>
  }
  ['/invoices']: {
    /**
     * getInvoices - list invoices
     */
    'get'(
      parameters?: Parameters<Paths.GetInvoices.QueryParameters & Paths.GetInvoices.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetInvoices.Responses.$200>
    /**
     * postInvoices - create an invoice
     */
    'post'(
      parameters?: Parameters<Paths.PostInvoices.HeaderParameters> | null,
      data?: Paths.PostInvoices.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostInvoices.Responses.$200>
  }
  ['/invoices/{id}']: {
    /**
     * putInvoice - update an invoice
     */
    'put'(
      parameters?: Parameters<Paths.PutInvoice.PathParameters & Paths.PutInvoice.HeaderParameters> | null,
      data?: Paths.PutInvoice.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutInvoice.Responses.$200>
    /**
     * getInvoice - get an invoice
     */
    'get'(
      parameters?: Parameters<Paths.GetInvoice.PathParameters & Paths.GetInvoice.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetInvoice.Responses.$200>
    /**
     * deleteInvoice - delete an invoice
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteInvoice.PathParameters & Paths.DeleteInvoice.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
