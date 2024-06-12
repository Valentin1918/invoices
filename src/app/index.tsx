import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import { ApiProvider } from '../api'

import 'bootstrap/dist/css/bootstrap.min.css'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ApiProvider
      url="https://jean-test-api.herokuapp.com/"
      token="bf5984ba-bc88-4a65-b7ac-f16fdc539aef"
    >
      <App />
    </ApiProvider>
  </React.StrictMode>
)
