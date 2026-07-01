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
