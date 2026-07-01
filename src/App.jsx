import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import POSPage from './features/pos/POSPage';
import TreasuryPage from './features/treasury/TreasuryPage';
import InventoryPage from './features/inventory/InventoryPage';
import CustomersPage from './features/crm/CustomersPage';
import EntityLedgerPage from './features/crm/EntityLedgerPage';
import NotFound from './shared/components/layout/NotFound';

export default function App() {
  return (
    <Router>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<POSPage />} />
          <Route path="/treasury" element={<TreasuryPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<EntityLedgerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
