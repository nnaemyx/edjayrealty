import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getInvoiceById } from "../../../lib/db";
import { formatCurrency } from "../../../lib/utils";
import InvoiceClientActions from "./InvoiceClientActions";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInvoiceDetailPage({ params }: InvoicePageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const paymentPlan = invoice.paymentMethod === "installment"
    ? `Installment Plan (${invoice.installmentMonths} Months)`
    : "Outright / One-off Payment";

  const totalAmountNaira = Math.floor(invoice.totalAmount).toLocaleString("en-NG");
  const amountPaidNaira = Math.floor(invoice.amountPaid).toLocaleString("en-NG");
  const balanceNaira = Math.max(0, Math.floor(invoice.totalAmount - invoice.amountPaid)).toLocaleString("en-NG");
  const unitPriceNaira = Math.floor(invoice.unitPrice).toLocaleString("en-NG");

  return (
    <div className="min-h-screen bg-emerald-950/15 pt-6 pb-12 print:bg-white print:pt-0 print:pb-0 flex items-center justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 11px !important;
          }
          .print\\:hidden, #site-header, #site-footer, header, footer {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: transparent !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0.5cm !important;
            margin: 0 !important;
            width: 100% !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}} />

      <div className="container mx-auto max-w-3xl px-4 print-container">
        
        {/* Actions bar (hidden during printing) */}
        <div className="flex justify-between items-center gap-4 mb-4 print:hidden">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 text-xs font-bold uppercase transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Invoices</span>
          </Link>
          
          <InvoiceClientActions receiptUrl={invoice.receiptUrl} clientName={invoice.clientName} invoiceNumber={invoice.invoiceNumber} />
        </div>

        {/* Invoice Card (Digital layout matching screenshot) */}
        <div className="invoice-card bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-emerald-900/10 text-emerald-950 font-[family-name:var(--font-body)]">
          
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-emerald-900/10">
            {/* Logo & Brand Details */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-900 flex-shrink-0 bg-emerald-900 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Edjay Realty Logo"
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-wider font-[family-name:var(--font-heading)] text-emerald-900">
                  EDJAY
                </span>
                <span className="text-xl font-semibold tracking-wider font-[family-name:var(--font-heading)] text-emerald-900 mt-0.5">
                  REALTY
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.25em] text-emerald-700 font-bold mt-2">
                  For The Future &bull; We Bank The Future
                </span>
              </div>
            </div>

            {/* Specialization & Contact details */}
            <div className="text-left md:text-right font-semibold text-[11px] text-emerald-900 space-y-1 max-w-[280px]">
              <p className="font-bold text-dark text-xs uppercase tracking-wide">Bespoke Land & Property Allocations</p>
              <p className="text-[10px] text-text-muted italic leading-normal">
                Estate development, property investment, real estate consulting and land sales.
              </p>
              
              <div className="pt-2 leading-relaxed text-text-muted">
                <p className="font-bold text-emerald-950 uppercase text-[9px] tracking-wider">HEAD OFFICE:</p>
                <p>Awka, Anambra State, Nigeria.</p>
                <p className="mt-0.5">📞 +234 806 563 8548</p>
                <p>✉ info@edjayrealty.com</p>
              </div>
            </div>
          </div>

          {/* Client Meta Data & Invoice Badge Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 pb-4 items-end text-xs font-bold text-emerald-950">
            {/* Client Info fields */}
            <div className="md:col-span-7 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <span className="text-text-muted w-14 flex-shrink-0">CLIENT:</span>
                <span className="text-dark font-extrabold text-sm">{invoice.clientName}</span>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <span className="text-text-muted w-14 flex-shrink-0">PHONE:</span>
                <span className="text-dark font-bold">{invoice.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <span className="text-text-muted w-14 flex-shrink-0">DATE:</span>
                <span className="text-dark font-bold">{invoice.createdAt}</span>
              </div>
            </div>

            {/* Invoice Serial Details */}
            <div className="md:col-span-5 flex flex-col items-start md:items-end gap-1.5">
              <div className="bg-[#0c3a21] text-white px-4 py-1 text-center font-bold tracking-widest rounded text-[9px] uppercase">
                INVOICE RECEIPT
              </div>
              <div className="text-2xl font-black font-[family-name:var(--font-heading)] text-emerald-900 tracking-wider">
                {invoice.invoiceNumber || "EJ-0000"}
              </div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="mt-4 border border-[#d1dcd5] rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px] font-semibold text-emerald-950">
              <thead>
                <tr className="bg-[#eef2ef] text-emerald-900 border-b border-[#d1dcd5] divide-x divide-[#d1dcd5]">
                  <th className="py-2.5 px-3 text-center w-[8%] font-bold">NO.</th>
                  <th className="py-2.5 px-3 text-center w-[8%] font-bold">QTY</th>
                  <th className="py-2.5 px-4 w-[50%] text-left font-bold">DESCRIPTION OF PROPERTY / ALLOCATION</th>
                  <th className="py-2.5 px-3 text-right w-[16%] font-bold">UNIT PRICE</th>
                  <th className="py-2.5 px-1 text-center w-[18%] colspan-2 font-bold">
                    <span className="block border-b border-[#d1dcd5] pb-0.5">AMOUNT</span>
                    <span className="grid grid-cols-2 text-[8px] pt-0.5 font-bold">
                      <span>NAIRA (₦)</span>
                      <span>KOBO</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1dcd5] text-center divide-x divide-[#d1dcd5]">
                {/* Active Property item */}
                <tr className="divide-x divide-[#d1dcd5] align-middle hover:bg-emerald-50/10">
                  <td className="py-3 px-3 text-text-muted">1</td>
                  <td className="py-3 px-3 text-dark font-bold">{invoice.quantity}</td>
                  <td className="py-3 px-4 text-left leading-normal">
                    <p className="font-extrabold text-dark">{invoice.estateName}</p>
                    <p className="text-[10px] text-text-light mt-0.5">{invoice.description}</p>
                  </td>
                  <td className="py-3 px-3 text-right text-dark font-bold">₦{unitPriceNaira}</td>
                  <td className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-[#d1dcd5] h-full text-right align-middle">
                      <span className="py-3 px-2 text-dark font-bold">₦{totalAmountNaira}</span>
                      <span className="py-3 px-2 text-center text-text-muted">00</span>
                    </div>
                  </td>
                </tr>

                {/* Empty Filler Rows for receipt voucher style */}
                {[1, 2, 3, 4].map((idx) => (
                  <tr key={idx} className="divide-x divide-[#d1dcd5] h-7.5">
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                    <td className="p-0 h-full">
                      <div className="grid grid-cols-2 divide-x divide-[#d1dcd5] h-full">
                        <span></span>
                        <span></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note & Summary Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-start text-xs font-semibold text-emerald-950">
            {/* Note Column */}
            <div className="md:col-span-7 bg-[#f8faf8] border-l-2 border-emerald-800 p-4 rounded-r-xl">
              <span className="font-extrabold uppercase text-[9px] tracking-wider text-emerald-900 block mb-1">
                NOTE:
              </span>
              <p className="text-[10.5px] leading-relaxed text-text-muted">
                All property allocations are subject to terms defined in the contract agreement. Documentation including survey plans and deed of assignment is initiated upon verification of advance payments.
              </p>
            </div>

            {/* Totals Summary Box */}
            <div className="md:col-span-5 bg-[#f8faf8] p-4 rounded-xl border border-emerald-900/5 space-y-2.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-text-muted uppercase tracking-wider text-[10px]">TOTAL</span>
                <span className="font-extrabold text-dark text-xs">₦{totalAmountNaira}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-[11px]">
                <span className="text-text-muted uppercase tracking-wider text-[10px]">ADVANCE</span>
                <span className="font-extrabold text-emerald-850 text-xs">₦{amountPaidNaira}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-[11px]">
                <span className="text-emerald-950 uppercase tracking-widest text-[10px] font-black">BALANCE DUE</span>
                <span className="font-black text-red-600 text-sm">₦{balanceNaira}</span>
              </div>
            </div>
          </div>

          {/* Amount In Words & Collection Date Pills */}
          <div className="mt-5 space-y-3 font-semibold text-[11px]">
            {/* Amount In Words Pill */}
            <div className="bg-[#f8faf8] px-4 py-2.5 rounded-lg border border-emerald-900/5 flex items-center">
              <span className="text-text-muted uppercase tracking-wider text-[9px] w-36 flex-shrink-0">
                AMOUNT IN WORDS:
              </span>
              <span className="text-dark font-extrabold italic">{invoice.amountInWords}</span>
            </div>

            {/* Collection Date / Payment details Pill */}
            <div className="bg-[#f8faf8] px-4 py-2.5 rounded-lg border border-emerald-900/5 flex items-center">
              <span className="text-text-muted uppercase tracking-wider text-[9px] w-36 flex-shrink-0">
                PAYMENT DETAILS:
              </span>
              <span className="text-dark font-extrabold uppercase tracking-wide">
                {paymentPlan} &bull; {invoice.bankName}
              </span>
            </div>
          </div>

          {/* Signature panel */}
          <div className="flex flex-row justify-between items-end gap-6 pt-12 text-emerald-950 font-bold text-xs">
            {/* Customer Sign */}
            <div className="flex flex-col items-center gap-1.5 w-44">
              <div className="w-full border-b border-gray-200 pb-0.5 h-6"></div>
              <span className="text-[9px] uppercase tracking-wider text-text-light font-bold">Customer's Sign</span>
            </div>

            {/* Edjay Sign */}
            <div className="flex flex-col items-center gap-1.5 w-44 text-right">
              <span className="text-[10px] font-bold text-emerald-900 tracking-wide">For Edjay Realty Limited</span>
              <div className="w-full border-b border-gray-200 pb-0.5 h-6 flex items-center justify-center">
                <span className="font-serif italic text-emerald-800 text-[10px]">Edjay Realty</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-text-light font-bold">Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
