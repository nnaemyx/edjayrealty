"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, numberToWords } from "../../lib/utils";

interface Invoice {
  id: string;
  invoiceNumber?: string;
  clientName: string;
  clientPhone: string;
  estateName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  amountPaid: number;
  amountInWords: string;
  paymentMethod: "installment" | "one-off";
  installmentMonths?: number;
  bankName: string;
  description: string;
  receiptUrl?: string;
  createdAt: string;
}

interface Estate {
  id: string;
  name: string;
}

const emptyForm = {
  clientName: "",
  clientPhone: "",
  estateName: "",
  quantity: "1",
  unitPrice: "",
  paymentMethod: "one-off" as "installment" | "one-off",
  installmentMonths: "3",
  bankName: "Zenith Bank",
  customBankName: "",
  customEstateName: "",
  description: "",
  amountInWords: "",
  amountPaid: "",
};

const BANK_OPTIONS = [
  "Zenith Bank",
  "Access Bank",
  "Guaranty Trust Bank (GTB)",
  "United Bank for Africa (UBA)",
  "First Bank of Nigeria",
  "Fidelity Bank",
  "FCMB",
  "Stanbic IBTC",
  "Sterling Bank",
  "Other"
];

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(emptyForm);
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Invoices and Estates
  const fetchData = useCallback(async () => {
    try {
      const [invoicesRes, estatesRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/estates")
      ]);
      
      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }
      
      if (estatesRes.ok) {
        const estatesData = await estatesRes.json();
        setEstates(estatesData);
      }
    } catch (err) {
      console.error("Could not load data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle unit price or quantity changes to recalculate total and amount in words
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    const total = qty * price;
    
    if (total > 0) {
      try {
        const words = numberToWords(total);
        setFormData(prev => {
          // If payment method is one-off, default amount paid is the total.
          // If installment, default is total / number of months.
          let defaultPaid = String(total);
          if (prev.paymentMethod === "installment") {
            const months = parseInt(prev.installmentMonths) || 1;
            defaultPaid = String(Math.round(total / months));
          }

          // We auto-fill amountPaid if it is empty, zero, or equal to the previous total value.
          const prevTotal = (parseInt(prev.quantity) || 0) * (parseFloat(prev.unitPrice) || 0);
          const shouldOverWrite = 
            prev.amountPaid === "" || 
            prev.amountPaid === "0" || 
            parseFloat(prev.amountPaid) === prevTotal;

          return { 
            ...prev, 
            amountInWords: words,
            amountPaid: shouldOverWrite ? defaultPaid : prev.amountPaid
          };
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setFormData(prev => ({ ...prev, amountInWords: "", amountPaid: "" }));
    }
  }, [formData.quantity, formData.unitPrice, formData.paymentMethod, formData.installmentMonths]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Upload Payment Receipt
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceipt(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Receipt upload failed");
      const data = await res.json();
      setReceiptUrl(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload payment receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const openEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    
    // Determine bank option vs custom
    const isPredefinedBank = BANK_OPTIONS.includes(invoice.bankName);
    const bankNameOption = isPredefinedBank ? invoice.bankName : "Other";
    const customBankName = isPredefinedBank ? "" : invoice.bankName;

    // Determine estate option vs custom
    const matchingEstate = estates.find(e => e.name === invoice.estateName);
    const estateNameOption = matchingEstate ? invoice.estateName : (invoice.estateName ? "Other" : "");
    const customEstateName = matchingEstate ? "" : invoice.estateName;

    setFormData({
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone,
      estateName: estateNameOption,
      customEstateName: customEstateName,
      quantity: String(invoice.quantity),
      unitPrice: String(invoice.unitPrice),
      paymentMethod: invoice.paymentMethod,
      installmentMonths: String(invoice.installmentMonths || 3),
      bankName: bankNameOption,
      customBankName: customBankName,
      description: invoice.description,
      amountInWords: invoice.amountInWords,
      amountPaid: String(invoice.amountPaid),
    });
    setReceiptUrl(invoice.receiptUrl || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
    setFormData(emptyForm);
    setReceiptUrl("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const qty = parseInt(formData.quantity) || 1;
    const price = parseFloat(formData.unitPrice) || 0;
    const total = qty * price;
    const paid = parseFloat(formData.amountPaid) || total;

    const chosenEstate = formData.estateName === "Other" ? formData.customEstateName : formData.estateName;
    const chosenBank = formData.bankName === "Other" ? formData.customBankName : formData.bankName;

    if (!chosenEstate) {
      setError("Please specify the estate name.");
      setSubmitting(false);
      return;
    }

    if (!chosenBank) {
      setError("Please specify the payment bank.");
      setSubmitting(false);
      return;
    }

    const payload: Invoice = {
      id: editingInvoice ? editingInvoice.id : "inv-" + Math.random().toString(36).substring(2, 11),
      invoiceNumber: editingInvoice?.invoiceNumber,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      estateName: chosenEstate,
      quantity: qty,
      unitPrice: price,
      totalAmount: total,
      amountPaid: paid,
      amountInWords: formData.amountInWords || numberToWords(total),
      paymentMethod: formData.paymentMethod,
      installmentMonths: formData.paymentMethod === "installment" ? parseInt(formData.installmentMonths) : undefined,
      bankName: chosenBank,
      description: formData.description,
      receiptUrl: receiptUrl || undefined,
      createdAt: editingInvoice ? editingInvoice.createdAt : new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save invoice");
      }

      await fetchData();
      closeForm();
    } catch (err: any) {
      setError(err.message || "Failed to save invoice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the invoice for "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/invoices?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      alert("Failed to delete invoice. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Copy shareable invoice link to clipboard
  const handleCopyLink = (invoiceId: string) => {
    const origin = window.location.origin;
    const url = `${origin}/admin/invoices/${invoiceId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(invoiceId);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Direct WhatsApp Share
  const handleWhatsAppShare = (invoice: Invoice) => {
    const origin = window.location.origin;
    const url = `${origin}/admin/invoices/${invoice.id}`;
    const formattedTotal = formatCurrency(invoice.totalAmount);
    const formattedPaid = formatCurrency(invoice.amountPaid || 0);
    const formattedBalance = formatCurrency(invoice.totalAmount - (invoice.amountPaid || 0));
    const paymentPlan = invoice.paymentMethod === "installment" 
      ? `Installment Plan (${invoice.installmentMonths} Months)` 
      : "Outright / One-off Payment";

    const textMessage = `Hello *${invoice.clientName}*,\n\nHere is your official invoice for *${invoice.quantity} plot(s)* at *${invoice.estateName}* from Edjay Realty.\n\n*Invoice No:* ${invoice.invoiceNumber}\n*Total Value:* ${formattedTotal}\n*Advance Paid:* ${formattedPaid}\n*Balance Due:* ${formattedBalance}\n*Payment Method:* ${paymentPlan}\n\nYou can view, print, or download your invoice receipt copy directly via this link:\n👉 ${url}\n\nThank you for choosing Edjay Realty!\n_For The Future_`;
    
    // Clean and sanitize phone number (Nigeria code prefix logic)
    let sanitizedPhone = invoice.clientPhone.replace(/\D/g, "");
    if (sanitizedPhone.startsWith("0")) {
      sanitizedPhone = "234" + sanitizedPhone.substring(1);
    } else if (sanitizedPhone.length === 10) {
      sanitizedPhone = "234" + sanitizedPhone;
    }

    const waUrl = sanitizedPhone 
      ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(textMessage)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`;

    window.open(waUrl, "_blank");
  };

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    return (
      inv.clientName.toLowerCase().includes(query) ||
      inv.clientPhone.includes(query) ||
      inv.estateName.toLowerCase().includes(query) ||
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Client Invoices
          </h2>
          <p className="text-xs text-text-light">
            Generate and manage invoices for plot allocations, upload payment proofs, and share instantly on WhatsApp.
            {!loading && <span className="ml-2 font-bold text-primary">{invoices.length} generated</span>}
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          {showForm ? "✕ Cancel" : "+ Generate Invoice"}
        </button>
      </div>

      {/* Invoice Generator Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 max-w-3xl animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark font-[family-name:var(--font-heading)] pb-2 border-b border-border-light">
            {editingInvoice ? `Edit Invoice: ${editingInvoice.invoiceNumber}` : "New Client Invoice Details"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div>
              <label htmlFor="clientName" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Client Full Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g. John Obi"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
            {/* Client Phone */}
            <div>
              <label htmlFor="clientPhone" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Client Phone Number (WhatsApp preferred)
              </label>
              <input
                type="text"
                id="clientPhone"
                name="clientPhone"
                required
                value={formData.clientPhone}
                onChange={handleInputChange}
                placeholder="e.g. 08031234567"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Estate Dropdown */}
            <div>
              <label htmlFor="estateName" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Estate Purchased
              </label>
              <select
                id="estateName"
                name="estateName"
                required
                value={formData.estateName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white focus:border-primary outline-none"
              >
                <option value="">-- Select Estate --</option>
                {estates.map(e => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
                <option value="Other">Other (Custom name...)</option>
              </select>
            </div>

            {/* Custom Estate Input (conditional) */}
            {formData.estateName === "Other" && (
              <div className="sm:col-span-2">
                <label htmlFor="customEstateName" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                  Custom Estate Name
                </label>
                <input
                  type="text"
                  id="customEstateName"
                  name="customEstateName"
                  required
                  value={formData.customEstateName}
                  onChange={handleInputChange}
                  placeholder="e.g. Apex Luxury Homes Phase 1"
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
                />
              </div>
            )}

            {/* Quantity */}
            <div className={formData.estateName !== "Other" ? "sm:col-span-1" : "sm:col-span-1"}>
              <label htmlFor="quantity" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                No. of Plots (Quantity)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>

            {/* Amount Per Plot */}
            <div className={formData.estateName !== "Other" ? "sm:col-span-1" : "sm:col-span-1"}>
              <label htmlFor="unitPrice" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Amount Per Plot (₦)
              </label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                required
                min="0"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="e.g. 3000000"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-light pt-2">
            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white focus:border-primary outline-none"
              >
                <option value="one-off">One-off / Outright</option>
                <option value="installment">Installment</option>
              </select>
            </div>

            {/* Installment Months (conditional) */}
            {formData.paymentMethod === "installment" && (
              <div>
                <label htmlFor="installmentMonths" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                  Number of Months
                </label>
                <input
                  type="number"
                  id="installmentMonths"
                  name="installmentMonths"
                  required
                  min="1"
                  max="48"
                  value={formData.installmentMonths}
                  onChange={handleInputChange}
                  placeholder="e.g. 6"
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
                />
              </div>
            )}

            {/* Bank dropdown */}
            <div className={formData.paymentMethod !== "installment" ? "sm:col-span-2" : "sm:col-span-1"}>
              <label htmlFor="bankName" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Bank Person Paid To
              </label>
              <select
                id="bankName"
                name="bankName"
                required
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white focus:border-primary outline-none"
              >
                {BANK_OPTIONS.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Bank Name Input */}
          {formData.bankName === "Other" && (
            <div className="animate-slide-down">
              <label htmlFor="customBankName" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Specify Custom Bank & Account Details
              </label>
              <input
                type="text"
                id="customBankName"
                name="customBankName"
                required
                value={formData.customBankName}
                onChange={handleInputChange}
                placeholder="e.g. Kuda Bank (1234567890)"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
          )}

          {/* Amount Paid Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="amountPaid" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Amount Paid (Advance / Deposit) (₦)
              </label>
              <input
                type="number"
                id="amountPaid"
                name="amountPaid"
                required
                min="0"
                value={formData.amountPaid}
                onChange={handleInputChange}
                placeholder="e.g. 3000000"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
              <p className="text-[10px] text-text-light mt-0.5">Amount received for this receipt transaction.</p>
            </div>
          </div>

          {/* Quantity & Unit Price Auto Breakdown */}
          {parseFloat(formData.unitPrice) > 0 && (
            <div className="p-4 bg-surface rounded-xl border border-border/50 text-xs font-semibold text-text-muted space-y-1.5 animate-fade-in">
              <div className="flex justify-between">
                <span>Formula:</span>
                <span>{formData.quantity} Plot(s) x {formatCurrency(parseFloat(formData.unitPrice))} per plot</span>
              </div>
              <div className="flex justify-between border-t border-border-light pt-1.5 font-semibold">
                <span>Calculated Total:</span>
                <span className="text-dark font-bold">{formatCurrency(parseInt(formData.quantity) * parseFloat(formData.unitPrice))}</span>
              </div>
              <div className="flex justify-between border-t border-border-light pt-1.5 font-semibold">
                <span>Advance (Deposit Paid):</span>
                <span className="text-primary font-bold">{formatCurrency(parseFloat(formData.amountPaid) || 0)}</span>
              </div>
              <div className="flex justify-between border-t border-border-light pt-1.5 font-bold text-dark text-sm">
                <span>Remaining Balance:</span>
                <span className="text-accent font-black">
                  {formatCurrency(
                    (parseInt(formData.quantity) * parseFloat(formData.unitPrice)) - (parseFloat(formData.amountPaid) || 0)
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Amount In Words (Generated, but editable) */}
          <div>
            <label htmlFor="amountInWords" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Amount in Words
            </label>
            <input
              type="text"
              id="amountInWords"
              name="amountInWords"
              required
              value={formData.amountInWords}
              onChange={handleInputChange}
              placeholder="e.g. Three Million Naira Only"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
            />
            <p className="text-[10px] text-text-light mt-0.5">Automatically derived, but can be manually overridden if needed.</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Plot Description / Particulars
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g. Outright allocation payment for Block D, Plot 12 at Genesis City Layout."
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none"
            />
          </div>

          {/* Payment Receipt Upload */}
          <div className="border-t border-border-light pt-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
              Upload Client's Payment Receipt (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-14 rounded-lg bg-gray-100 border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors relative shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {receiptUrl ? (
                  <Image
                    src={receiptUrl}
                    alt="Receipt preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  {uploadingReceipt ? "Uploading..." : receiptUrl ? "Change Receipt" : "Upload Receipt"}
                </button>
                <p className="text-[10px] text-text-light mt-0.5">Attach PNG or JPG deposit slip / bank receipt.</p>
              </div>
              {receiptUrl && (
                <button
                  type="button"
                  onClick={() => setReceiptUrl("")}
                  className="text-accent hover:underline text-xs font-bold ml-auto cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingReceipt}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Saving Invoice…" : editingInvoice ? "Save Modifications" : "Generate Client Invoice"}
            </button>
          </div>
        </form>
      )}

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border/50 shadow-sm max-w-md">
        <svg className="w-4 h-4 text-text-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search client, phone, or estate..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs text-dark outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-text-light hover:text-dark font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-100 rounded w-28" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices List */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light bg-surface/30">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-4">Client Detail</th>
                  <th className="py-4 px-4">Estate & Description</th>
                  <th className="py-4 px-4">Bank Detail</th>
                  <th className="py-4 px-4">Method</th>
                  <th className="py-4 px-4 text-right">Total</th>
                  <th className="py-4 px-4 text-right">Advance</th>
                  <th className="py-4 px-4 text-right">Balance</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-surface/10 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-4 px-6 font-bold text-dark whitespace-nowrap">
                      {invoice.invoiceNumber || "Pending"}
                      <span className="block text-[9px] font-medium text-text-light">{invoice.createdAt}</span>
                    </td>
                    {/* Client Detail */}
                    <td className="py-4 px-4 leading-normal">
                      <p className="font-bold text-dark">{invoice.clientName}</p>
                      <p className="text-text-light">{invoice.clientPhone}</p>
                    </td>
                    {/* Estate Details */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-dark leading-tight">{invoice.estateName}</p>
                      <p className="text-text-light text-[10px] line-clamp-1 mt-0.5">{invoice.description}</p>
                      <span className="inline-block bg-surface-alt text-primary px-1.5 py-0.5 rounded text-[9px] font-bold mt-1">
                        {invoice.quantity} Plot(s)
                      </span>
                      {invoice.receiptUrl && (
                        <span className="inline-block bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded text-[9px] font-bold ml-1">
                          ✓ Receipt
                        </span>
                      )}
                    </td>
                    {/* Bank Details */}
                    <td className="py-4 px-4 text-dark whitespace-nowrap">{invoice.bankName}</td>
                    {/* Method */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          invoice.paymentMethod === "one-off"
                            ? "bg-primary/10 text-primary"
                            : "bg-gold/20 text-gold"
                        }`}
                      >
                        {invoice.paymentMethod === "one-off" ? "One-off" : `${invoice.installmentMonths} M Plan`}
                      </span>
                    </td>
                    {/* Total Value */}
                    <td className="py-4 px-4 text-right text-dark font-medium whitespace-nowrap">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    {/* Advance Paid */}
                    <td className="py-4 px-4 text-right text-primary font-bold whitespace-nowrap">
                      {formatCurrency(invoice.amountPaid || 0)}
                    </td>
                    {/* Remaining Balance */}
                    <td className="py-4 px-4 text-right text-accent font-extrabold whitespace-nowrap">
                      {formatCurrency(invoice.totalAmount - (invoice.amountPaid || 0))}
                    </td>
                     {/* Actions */}
                     <td className="py-4 px-6 text-right whitespace-nowrap">
                       <div className="flex items-center justify-end gap-3.5">
                         {/* View Invoice Document */}
                         <Link
                           href={`/admin/invoices/${invoice.id}`}
                           target="_blank"
                           className="text-blue-600 hover:text-blue-800 font-bold underline"
                           title="View Invoice Document"
                         >
                           View
                         </Link>

                         {/* WhatsApp Share Icon Link */}
                         <button
                           onClick={() => handleWhatsAppShare(invoice)}
                           className="text-primary hover:text-primary-dark font-bold underline flex items-center gap-1 cursor-pointer"
                           title="Share Invoice on WhatsApp"
                         >
                           WhatsApp
                         </button>
                         
                         {/* Copy Link button */}
                         <button
                           onClick={() => handleCopyLink(invoice.id)}
                           className="text-text-muted hover:text-dark font-bold underline cursor-pointer"
                         >
                           {copiedId === invoice.id ? "Copied!" : "Copy Link"}
                         </button>
 
                         <button
                           onClick={() => openEdit(invoice)}
                           className="text-amber-600 hover:underline font-bold"
                         >
                           Edit
                         </button>
 
                         <button
                           onClick={() => handleDelete(invoice.id, invoice.clientName)}
                           disabled={deletingId === invoice.id}
                           className="text-accent hover:underline font-bold disabled:opacity-50"
                         >
                           {deletingId === invoice.id ? "..." : "Delete"}
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-dark">No invoices found.</p>
                <p className="text-xs text-text-muted mt-1">Generate a new invoice or refine your search parameters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
