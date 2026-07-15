import { supabase } from './client';

/**
 * ==========================================
 * READ OPERATIONS
 * ==========================================
 */

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers_suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchDailySession(sessionId) {
  const { data, error } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchActiveSession() {
  const { data, error } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchTreasuryBalance() {
  const { data, error } = await supabase
    .from('treasury')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchTodayExpenses(sessionId) {
  if (!sessionId) return [];
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('type', 'expense')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchSessionSalesTotal(sessionId) {
  if (!sessionId) return { totalSales: 0, totalPurchases: 0, invoiceCount: 0 };
  
  const { data, error } = await supabase
    .from('invoices')
    .select('total_amount, invoice_type, payment_type')
    .eq('session_id', sessionId);

  if (error) throw error;

  const totalSales = (data || [])
    .filter(inv => inv.invoice_type === 'sale')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const totalPurchases = (data || [])
    .filter(inv => inv.invoice_type === 'purchase')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  return {
    totalSales,
    totalPurchases,
    invoiceCount: (data || []).length,
  };
}

/**
 * ==========================================
 * WRITE OPERATIONS (UPDATES / INSERTS)
 * ==========================================
 */

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertInvoice(invoiceData, invoiceItems) {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([invoiceData])
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  const itemsWithInvoiceId = invoiceItems.map(item => ({
    ...item,
    invoice_id: invoice.id
  }));

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsWithInvoiceId);

  if (itemsError) throw itemsError;

  return invoice;
}

export async function updateInvoice(invoiceId, invoiceData, oldItems, newItems) {
  // 1. Update the main invoice record
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .update(invoiceData)
    .eq('id', invoiceId)
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // 2. Identify which items to DELETE, UPDATE, or INSERT
  const newItemIds = newItems.filter(item => item.id).map(item => item.id);
  const itemsToDelete = oldItems.filter(oldItem => !newItemIds.includes(oldItem.id));
  
  const itemsToInsert = newItems.filter(item => !item.id).map(item => ({
    ...item,
    invoice_id: invoiceId
  }));
  
  const itemsToUpdate = newItems.filter(item => item.id);

  // Execute Deletes
  if (itemsToDelete.length > 0) {
    const idsToDelete = itemsToDelete.map(item => item.id);
    const { error: deleteError } = await supabase
      .from('invoice_items')
      .delete()
      .in('id', idsToDelete);
    if (deleteError) throw deleteError;
  }

  // Execute Inserts
  if (itemsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert);
    if (insertError) throw insertError;
  }

  // Execute Updates (one by one for simplicity and safety with triggers)
  if (itemsToUpdate.length > 0) {
    const updatePromises = itemsToUpdate.map(async (item) => {
      const { id, product_id, quantity, unit_price, total_price } = item;
      return supabase
        .from('invoice_items')
        .update({ quantity, unit_price, total_price })
        .eq('id', id);
    });
    
    await Promise.all(updatePromises);
  }

  return invoice;
}

export async function insertExpense(expenseData) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert([{ ...expenseData, type: 'expense' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function closeSession(sessionId) {
  const { data, error } = await supabase
    .from('daily_sessions')
    .update({ status: 'closed', closed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function openSession() {
  const { data, error } = await supabase
    .from('daily_sessions')
    .insert([{ status: 'open', opening_balance: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function insertSpoilageLog(spoilageData) {
  const { data, error } = await supabase
    .from('spoilage_logs')
    .insert([spoilageData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==========================================
// CRM & Financial Transactions
// ==========================================

export async function fetchEntities() {
  const { data, error } = await supabase
    .from('customers_suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function insertEntity(entityData) {
  const { data, error } = await supabase
    .from('customers_suppliers')
    .insert([entityData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEntity(id, updates) {
  const { data, error } = await supabase
    .from('customers_suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEntity(id) {
  const { error } = await supabase
    .from('customers_suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function insertFinancialTransaction(transactionData) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert([transactionData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFinancialTransaction(id, updates) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchEntityById(id) {
  const { data, error } = await supabase
    .from('customers_suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchEntityTransactions(entityId) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      *,
      daily_sessions ( opened_at, closed_at )
    `)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ==========================================
// Dashboard Queries
// ==========================================

export async function fetchRecentInvoices(limit = 5) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers_suppliers(name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function fetchRecentTransactions(limit = 5) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select(`
      *,
      customers_suppliers(name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function fetchLowStockProducts(threshold = 10, limit = 5) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lte('stock_quantity', threshold)
    .order('stock_quantity', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function fetchAllInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers_suppliers(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchInvoiceDetails(invoiceId) {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      customers_suppliers(name)
    `)
    .eq('id', invoiceId)
    .single();

  if (invoiceError) throw invoiceError;

  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select(`
      *,
      products(name, sku)
    `)
    .eq('invoice_id', invoiceId);

  if (itemsError) throw itemsError;

  return { ...invoice, items };
}

export async function fetchEntityInvoices(entityId) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', entityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchInvoiceItems(invoiceId) {
  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId);

  if (error) throw error;
  return data;
}

export async function deleteInvoice(invoiceId) {
  // Delete invoice_items first (if no ON DELETE CASCADE), then the invoice
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', invoiceId);

  if (itemsError) throw itemsError;

  const { error: invoiceError } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId);

  if (invoiceError) throw invoiceError;

  return true;
}

export async function fetchNetProfitMetrics() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayISO = startOfDay.toISOString();

  const { data: invoices, error: invoiceError } = await supabase
    .from('invoices')
    .select('total_amount, invoice_type')
    .gte('created_at', startOfDayISO);

  if (invoiceError) throw invoiceError;

  const { data: transactions, error: transactionError } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('type', 'expense')
    .gte('created_at', startOfDayISO);

  if (transactionError) throw transactionError;

  const totalSales = (invoices || [])
    .filter(inv => inv.invoice_type === 'sale')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const totalPurchases = (invoices || [])
    .filter(inv => inv.invoice_type === 'purchase')
    .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const totalExpenses = (transactions || [])
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const netProfit = totalSales - (totalPurchases + totalExpenses);

  return {
    totalSales,
    totalPurchases,
    totalExpenses,
    netProfit
  };
}

export async function fetchProductsSoldQuantity() {
  const { data: invoiceItems, error } = await supabase
    .from('invoice_items')
    .select(`
      quantity,
      products ( id, name ),
      invoices!inner ( invoice_type )
    `)
    .eq('invoices.invoice_type', 'sale');

  if (error) throw error;

  const productSales = {};
  for (const item of invoiceItems || []) {
    if (!item.products) continue;
    const pid = item.products.id;
    if (!productSales[pid]) {
      productSales[pid] = {
        id: pid,
        name: item.products.name,
        total_quantity: 0
      };
    }
    productSales[pid].total_quantity += Number(item.quantity || 0);
  }

  return Object.values(productSales).sort((a, b) => b.total_quantity - a.total_quantity);
}
