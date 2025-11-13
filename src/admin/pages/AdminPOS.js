import React, { useState, useMemo, useEffect, useRef } from 'react';
import './AdminPOS.css';

// Mock services catalog
const SERVICES_CATALOG = [
  { id: 's1', name: "Women's Haircut", price: 65 },
  { id: 's2', name: "Men's Haircut", price: 40 },
  { id: 's3', name: 'Beard Trim', price: 25 },
  { id: 's4', name: 'Balayage', price: 220 },
  { id: 's5', name: 'Full Color', price: 150 },
  { id: 's6', name: 'Bridal Package', price: 450 },
  { id: 's7', name: 'Root Touch-up', price: 80 },
  { id: 's8', name: 'Head Shave', price: 30 },
];

const currency = (v) => `$${Number(v || 0).toFixed(2)}`;
const nowISO = () => new Date().toISOString();

export default function AdminPOS() {
  // Customer / cart state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES_CATALOG[0].id);
  const [cart, setCart] = useState([]);

  // Pricing fields
  const [discountValue, setDiscountValue] = useState(0); // absolute
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(12);

  // Payments record (persisted)
  const [payments, setPayments] = useState(() => {
    try {
      const raw = localStorage.getItem('pos_payments');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  // UI state
  const [paySearch, setPaySearch] = useState('');
  const [payStatusFilter, setPayStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showReceipt, setShowReceipt] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try { localStorage.setItem('pos_payments', JSON.stringify(payments)); } catch {}
  }, [payments]);

  // Add service to cart
  function addServiceToCart() {
    const svc = SERVICES_CATALOG.find(s => s.id === selectedServiceId);
    if (!svc) return;
    setCart(prev => {
      const existing = prev.find(p => p.id === svc.id);
      if (existing) {
        return prev.map(p => p.id === svc.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...svc, qty: 1 }];
    });
    showToast(`${svc.name} added to cart`);
  }

  function updateQty(id, qty) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, Number(qty) || 1) } : i));
  }

  function updateItemPrice(id, price) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, price: Number(price) || 0 } : i));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    if (!cart.length) return;
    if (!window.confirm('Clear all items from cart?')) return;
    setCart([]);
  }

  // Calculations
  const subTotal = useMemo(() => cart.reduce((s, it) => s + (it.price * (it.qty || 1)), 0), [cart]);
  const discountFromPercent = (discountPercent / 100) * subTotal;
  const effectiveDiscount = Math.max(0, Number(discountValue) || 0) + discountFromPercent;
  const taxedAmount = Math.max(0, subTotal - effectiveDiscount) * (Number(taxPercent) || 0) / 100;
  const grandTotal = Math.max(0, subTotal - effectiveDiscount) + taxedAmount;

  // Checkout
  function handleCheckout(paymentMethod = 'cash') {
    if (!customerName.trim()) {
      showToast('Enter customer name before checkout', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }
    const payment = {
      id: `p${Date.now()}`,
      dateTime: nowISO(),
      customer: { name: customerName.trim(), phone: customerPhone.trim(), email: customerEmail.trim() },
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subTotal, discount: Number(effectiveDiscount), tax: Number(taxedAmount), total: Number(grandTotal),
      paymentMethod, status: 'paid', note: '',
    };
    setPayments(prev => [payment, ...prev]);
    setCart([]);
    setDiscountPercent(0);
    setDiscountValue(0);
    setShowReceipt(payment);
    showToast('Payment recorded', 'success');
  }

  function updatePaymentStatus(paymentId, status) {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
    showToast(`Payment ${status}`, status === 'refunded' ? 'warning' : 'info');
  }

  function deletePayment(paymentId) {
    if (!window.confirm('Delete this payment record?')) return;
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    showToast('Payment deleted', 'info');
  }

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const q = paySearch.trim().toLowerCase();
      if (payStatusFilter !== 'all' && p.status !== payStatusFilter) return false;
      if (q) {
        const inCust = (p.customer?.name || '').toLowerCase().includes(q) || (p.customer?.phone || '').includes(q) || (p.id || '').includes(q);
        if (!inCust) return false;
      }
      if (dateFrom) {
        if (new Date(p.dateTime) < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23,59,59,999);
        if (new Date(p.dateTime) > end) return false;
      }
      return true;
    });
  }, [payments, paySearch, payStatusFilter, dateFrom, dateTo]);

  // Receipt printing
  const receiptRef = useRef();
  function printReceipt() {
    if (!showReceipt) return;
    const printContents = receiptRef.current?.innerHTML;
    if (!printContents) return;
    const w = window.open('', '_blank', 'width=600,height=800');
    w.document.write(`<html><head><title>Receipt</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse}th,td{padding:6px;border-bottom:1px solid #eee}</style>
      </head><body>${printContents}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  // Toast helper
  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2400);
  }

  // Quick-add
  const pickServiceQuick = (id) => {
    setSelectedServiceId(id);
    const svc = SERVICES_CATALOG.find(s => s.id === id);
    if (svc) {
      // add after slight delay to show selection
      setTimeout(() => addServiceToCart(), 60);
    }
  };

  const disablePay = cart.length === 0 || customerName.trim() === '';

  return (
    <div className="admin-pos-page">
      <h1 className="page-title">Point of Sales — Checkout</h1>

      <div className="pos-grid">
        <section className="pos-panel card">
          <div className="panel-head">
            <h2>Checkout</h2>
            <div className="panel-actions">
              <button className="btn small ghost" onClick={() => {
                setCustomerName(''); setCustomerPhone(''); setCustomerEmail('');
                showToast('Customer cleared', 'info');
              }}>Clear Customer</button>
              <button className="btn small danger ghost" onClick={clearCart} disabled={cart.length === 0}>Clear Cart</button>
            </div>
          </div>

          <div className="customer-row">
            <input placeholder="Customer name *" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            <input placeholder="Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            <input placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
          </div>

          <div className="service-select-row">
            <select value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
              {SERVICES_CATALOG.map(s => <option key={s.id} value={s.id}>{s.name} — {currency(s.price)}</option>)}
            </select>
            <button className="btn primary" onClick={addServiceToCart}>Add</button>
          </div>

          <div className="service-quick-list">
            {SERVICES_CATALOG.slice(0, 6).map(s => (
              <button key={s.id} className="quick-btn" onClick={() => pickServiceQuick(s.id)} title={`Add ${s.name}`}>
                <div className="qb-name">{s.name}</div>
                <div className="qb-price">{currency(s.price)}</div>
              </button>
            ))}
          </div>

          <div className="cart-table">
            <table>
              <thead>
                <tr><th>Service</th><th>Qty</th><th>Price</th><th>Line</th><th></th></tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan="5" className="muted">Cart is empty — add a service to begin</td></tr>
                ) : cart.map(item => (
                  <tr key={item.id}>
                    <td className="td-name">{item.name}</td>
                    <td><input type="number" min="1" value={item.qty} onChange={e => updateQty(item.id, e.target.value)} /></td>
                    <td><input type="number" min="0" step="0.01" value={item.price} onChange={e => updateItemPrice(item.id, e.target.value)} /></td>
                    <td className="td-right">{currency(item.qty * item.price)}</td>
                    <td><button className="btn small danger" onClick={() => removeFromCart(item.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pricing-row">
            <div className="pricing-block">
              <label>Subtotal</label>
              <div className="value">{currency(subTotal)}</div>
            </div>

            <div className="pricing-block">
              <label>Discount ($)</label>
              <input type="number" min="0" step="0.01" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} />
              <label className="label-small">or Discount %</label>
              <input className="small-input" type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
            </div>

            <div className="pricing-block">
              <label>Tax %</label>
              <input type="number" min="0" max="100" step="0.01" value={taxPercent} onChange={e => setTaxPercent(Number(e.target.value))} />
              <div className="tax-row"><label>Tax</label><div className="value">{currency(taxedAmount)}</div></div>
            </div>

            <div className="pricing-block total-block">
              <label>Total</label>
              <div className="value big">{currency(grandTotal)}</div>
              <div className="muted">Includes discount & tax</div>
            </div>
          </div>

          <div className="checkout-actions">
            <button className="btn primary large" onClick={() => handleCheckout('cash')} disabled={disablePay}>Pay — Cash</button>
            <button className="btn outline large" onClick={() => handleCheckout('card')} disabled={disablePay}>Pay — Card</button>
            <button className="btn ghost large" onClick={() => handleCheckout('upi')} disabled={disablePay}>Pay — UPI</button>
          </div>
        </section>

        <aside className="pos-panel card payments-panel">
          <div className="panel-head">
            <h2>Payments</h2>
            <div className="panel-actions">
              <button className="btn small ghost" onClick={() => { setPaySearch(''); setPayStatusFilter('all'); setDateFrom(''); setDateTo(''); }}>Reset</button>
            </div>
          </div>

          <div className="payments-controls">
            <input placeholder="Search by name / phone / id" value={paySearch} onChange={e => setPaySearch(e.target.value)} />
            <select value={payStatusFilter} onChange={e => setPayStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <div className="date-filters">
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="payments-list">
            {filteredPayments.length === 0 ? (
              <div className="muted">No payments found</div>
            ) : (
              filteredPayments.map(p => (
                <div key={p.id} className="payment-item">
                  <div className="p-left">
                    <div className="p-title"><strong>{p.customer?.name || 'Guest'}</strong> <small className="muted id">{p.id}</small></div>
                    <div className="muted">{new Date(p.dateTime).toLocaleString()}</div>
                  </div>

                  <div className="p-center">
                    <div className="p-amount">{currency(p.total)}</div>
                    <div className={`badge ${p.status === 'paid' ? 'paid' : p.status === 'refunded' ? 'refunded' : 'unpaid'}`}>{p.status}</div>
                  </div>

                  <div className="p-actions">
                    <button className="btn small" onClick={() => setShowReceipt(p)}>Receipt</button>
                    {p.status !== 'refunded' && <button className="btn small outline" onClick={() => updatePaymentStatus(p.id, 'refunded')}>Refund</button>}
                    <button className="btn small danger" onClick={() => deletePayment(p.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Receipt modal */}
      {showReceipt && (
        <div className="receipt-overlay" role="dialog" aria-modal="true" onClick={() => setShowReceipt(null)}>
          <div className="receipt-card card" ref={receiptRef} onClick={e => e.stopPropagation()}>
            <header className="receipt-header">
              <h3>Salon Receipt</h3>
              <small>{new Date(showReceipt.dateTime).toLocaleString()}</small>
            </header>

            <section className="receipt-customer">
              <div><strong>{showReceipt.customer?.name || 'Guest'}</strong></div>
              <div className="muted">{showReceipt.customer?.phone} • {showReceipt.customer?.email}</div>
            </section>

            <section className="receipt-items">
              <table>
                <thead><tr><th>Service</th><th>Qty</th><th>Price</th><th>Line</th></tr></thead>
                <tbody>
                  {showReceipt.items.map(it => (
                    <tr key={it.id}><td>{it.name}</td><td>{it.qty}</td><td>{currency(it.price)}</td><td>{currency(it.qty * it.price)}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="receipt-summary">
              <div>Subtotal: {currency(showReceipt.subTotal)}</div>
              <div>Discount: {currency(showReceipt.discount)}</div>
              <div>Tax: {currency(showReceipt.tax)}</div>
              <div className="total">Total: {currency(showReceipt.total)}</div>
              <div>Paid via: <strong>{showReceipt.paymentMethod}</strong></div>
            </section>

            <div className="receipt-actions">
              <button className="btn" onClick={printReceipt}>Print</button>
              <button className="btn ghost" onClick={() => setShowReceipt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
