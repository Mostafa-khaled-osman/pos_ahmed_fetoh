import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import POSPage from './features/pos/POSPage';
import TreasuryPage from './features/treasury/TreasuryPage';
import InventoryPage from './features/inventory/InventoryPage';
import CustomersPage from './features/crm/CustomersPage';
import EntityLedgerPage from './features/crm/EntityLedgerPage';
import AddInvoicePage from './features/invoicing/AddInvoicePage';
import EditInvoicePage from './features/invoicing/EditInvoicePage';
import InvoicesListPage from './features/invoicing/InvoicesListPage';
import InvoiceDetailPage from './features/invoicing/InvoiceDetailPage';
import StatementOfAccountPage from './features/crm/StatementOfAccountPage';
import DashboardPage from './features/dashboard/DashboardPage';
import NotFound from './shared/components/layout/NotFound';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="w-full h-full">
          <Routes>
            <Route path="/" element={<POSPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/treasury" element={<TreasuryPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<EntityLedgerPage />} />
            <Route path="/customers/:id/statement" element={<StatementOfAccountPage />} />
            <Route path="/add-invoice" element={<AddInvoicePage />} />
            <Route path="/invoices" element={<InvoicesListPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}
