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

  const itemsWithCost = invoiceItems.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    ...(item.cost_price !== undefined ? { cost_price: item.cost_price } : {}),
    invoice_id: invoice.id
  }));

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsWithCost);

  if (itemsError) {
    // If database table does not have 'cost_price' column yet, retry without cost_price
    if (itemsError.message?.includes('cost_price') || itemsError.code === 'PGRST204') {
      const itemsWithoutCost = invoiceItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        invoice_id: invoice.id
      }));
      const { error: retryError } = await supabase
        .from('invoice_items')
        .insert(itemsWithoutCost);
      if (retryError) throw retryError;
    } else {
      throw itemsError;
    }
  }

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
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    ...(item.cost_price !== undefined ? { cost_price: item.cost_price } : {}),
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
    if (insertError) {
      if (insertError.message?.includes('cost_price') || insertError.code === 'PGRST204') {
        const cleanInserts = itemsToInsert.map(({ cost_price, ...rest }) => rest);
        const { error: retryError } = await supabase
          .from('invoice_items')
          .insert(cleanInserts);
        if (retryError) throw retryError;
      } else {
        throw insertError;
      }
    }
  }

  // Execute Updates (one by one for simplicity and safety with triggers)
  if (itemsToUpdate.length > 0) {
    const updatePromises = itemsToUpdate.map(async (item) => {
      const { id, product_id, quantity, unit_price, total_price, cost_price } = item;
      const updatePayload = { quantity, unit_price, total_price };
      if (cost_price !== undefined) updatePayload.cost_price = cost_price;

      const { error: err } = await supabase
        .from('invoice_items')
        .update(updatePayload)
        .eq('id', id);

      if (err && (err.message?.includes('cost_price') || err.code === 'PGRST204')) {
        return supabase
          .from('invoice_items')
          .update({ quantity, unit_price, total_price })
          .eq('id', id);
      }
      if (err) throw err;
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
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayISO = startOfDay.toISOString();

  const { data: invoiceItems, error } = await supabase
    .from('invoice_items')
    .select(`
      quantity,
      products ( id, name ),
      invoices!inner ( invoice_type, created_at )
    `)
    .eq('invoices.invoice_type', 'sale')
    .gte('invoices.created_at', startOfDayISO);

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

export async function fetchTodayGrossProfit() {
  // Use same date calculation as fetchNetProfitMetrics for consistency
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayISO = startOfDay.toISOString();

  // Fetch today's sale invoices — .select() MUST come before filters
  let invoices = [];
  const { data: invData, error: invError } = await supabase
    .from('invoices')
    .select('id, discount_amount')
    .eq('invoice_type', 'sale')
    .gte('created_at', startOfDayISO);

  if (invError) {
    // Retry without discount_amount if column doesn't exist
    const { data: fbData, error: fbError } = await supabase
      .from('invoices')
      .select('id')
      .eq('invoice_type', 'sale')
      .gte('created_at', startOfDayISO);
    if (fbError) throw fbError;
    invoices = fbData || [];
  } else {
    invoices = invData || [];
  }

  if (!invoices || invoices.length === 0) return 0;

  const invoiceIds = invoices.map(inv => inv.id);

  // Fetch invoice items with snapshot cost_price (fallback to products.cost_price)
  let items = [];
  const { data: itemsData, error: itemsError } = await supabase
    .from('invoice_items')
    .select(`
      invoice_id,
      quantity,
      unit_price,
      total_price,
      cost_price,
      products ( cost_price )
    `)
    .in('invoice_id', invoiceIds);

  if (itemsError) {
    if (itemsError.message?.includes('cost_price') || itemsError.code === 'PGRST204') {
      const { data: fallbackItems, error: fbError } = await supabase
        .from('invoice_items')
        .select(`
          invoice_id,
          quantity,
          unit_price,
          total_price,
          products ( cost_price )
        `)
        .in('invoice_id', invoiceIds);

      if (fbError) throw fbError;
      items = fallbackItems || [];
    } else {
      throw itemsError;
    }
  } else {
    items = itemsData || [];
  }

  // Calculate gross profit using total_price (which correctly handles carton/egg pricing)
  // profit = total_price (revenue) - total_cost
  // total_cost = (cost_price_per_carton / EGGS_PER_CARTON) * quantity
  const EGGS_PER_CARTON = 30;
  const itemProfitMap = {};
  const detailedBreakdown = [];

  let totalSalesSum = 0;
  let totalCostSum = 0;

  for (const item of items || []) {
    const totalRevenue = Number(item.total_price || 0);
    const costPerCarton = (item.cost_price !== null && item.cost_price !== undefined)
      ? Number(item.cost_price)
      : Number(item.products?.cost_price || 0);
    const costPerEgg = costPerCarton / EGGS_PER_CARTON;
    const qty = Number(item.quantity || 0);
    const totalCost = costPerEgg * qty;
    const profit = totalRevenue - totalCost;

    totalSalesSum += totalRevenue;
    totalCostSum += totalCost;
    itemProfitMap[item.invoice_id] = (itemProfitMap[item.invoice_id] || 0) + profit;

    detailedBreakdown.push({
      'معرف الفاتورة': item.invoice_id?.slice(0, 8) + '...',
      'الكمية (بالبيضة)': qty,
      'إجمالي البيع (ج.م)': totalRevenue.toFixed(2),
      'تكلفة الكرتونة (ج.م)': costPerCarton.toFixed(2),
      'تكلفة البيضة (ج.م)': costPerEgg.toFixed(2),
      'إجمالي التكلفة (ج.م)': totalCost.toFixed(2),
      'الربح للبنود (ج.م)': profit.toFixed(2),
    });
  }

  // Subtract invoice-level discounts
  let totalDiscounts = 0;
  let totalGrossProfit = 0;
  for (const inv of invoices) {
    const itemProfitSum = itemProfitMap[inv.id] || 0;
    const discount = Number(inv.discount_amount || 0);
    totalDiscounts += discount;
    totalGrossProfit += (itemProfitSum - discount);
  }

  // Print detailed debug log to Browser Console
  if (typeof window !== 'undefined') {
    console.group('📊 تفاصيل حساب إجمالي أرباح اليوم (Today Gross Profit Breakdown)');
    console.log('📅 بداية اليوم (ISO):', startOfDayISO);
    console.log('🧾 عدد فواتير البيع اليوم:', invoices.length);
    console.log('📦 عدد البنود المباعة:', items.length);
    console.log('💵 إجمالي إيراد البنود:', totalSalesSum.toFixed(2), 'ج.م');
    console.log('📉 إجمالي التكلفة الكلية:', totalCostSum.toFixed(2), 'ج.م');
    console.log('🏷️ إجمالي الخصومات:', totalDiscounts.toFixed(2), 'ج.م');
    console.log('✨ إجمالي الربح الصافي النهائي:', totalGrossProfit.toFixed(2), 'ج.م');
    console.log('📋 تفاصيل البنود المباعة:');
    console.table(detailedBreakdown);
    console.groupEnd();

    // Attach function to window for manual re-triggering from browser console
    window.debugGrossProfit = fetchTodayGrossProfit;
  }

  return totalGrossProfit;
}


