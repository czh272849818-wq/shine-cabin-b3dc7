import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import IndustryAnalysis from './pages/IndustryAnalysis'
import IPPositioning from './pages/IPPositioning'
import ContentFactory from './pages/ContentFactory'
import CustomerCenter from './pages/CustomerCenter'
import DataInsights from './pages/DataInsights'
import Login from './pages/Login'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<IndustryAnalysis />} />
          <Route path="positioning" element={<IPPositioning />} />
          <Route path="content" element={<ContentFactory />} />
          <Route path="customers" element={<CustomerCenter />} />
          <Route path="insights" element={<DataInsights />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
