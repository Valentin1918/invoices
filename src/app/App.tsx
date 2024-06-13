import { useCallback, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Notification, Events, NotificationContext } from './components'
import { InvoicesList, Invoice, Page404 } from './pages'
import { ROOT, INVOICE } from './routes'
import '../i18n';
import './assets';


function App() {
  const [activeNotification, setActiveNotification] = useState<Events | null>(null);
  const closeNotification = useCallback(() => setActiveNotification(null), []);

  return (
    <>
      <NotificationContext.Provider value={{ showNotification: setActiveNotification }}>
        <Router>
          <Routes>
            <Route path={INVOICE} Component={Invoice} />
            <Route path={ROOT} Component={InvoicesList} />
            <Route path="*" Component={Page404} />
          </Routes>
        </Router>
      </NotificationContext.Provider>

      <Notification
        activeNotification={activeNotification}
        onClose={closeNotification}
      />
    </>
  )
}

export default App
