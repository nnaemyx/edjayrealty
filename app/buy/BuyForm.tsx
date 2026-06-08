"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Estate } from "../lib/data";
import {
  TITLES,
  GENDERS,
  MARITAL_STATUSES,
  ID_TYPES,
  LAND_PURPOSES,
  RELATIONSHIPS,
  NATIONALITIES,
  UNIT_OPTIONS,
  PAYMENT_PACKAGES,
} from "./buyFormOptions";
import { buildWhatsAppUrl, navigateWhatsAppWindow } from "../lib/whatsapp";

interface BuyFormProps {
  estates: Estate[];
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-border text-sm focus:border-primary outline-none bg-white";
const labelClass = "block text-xs font-semibold text-text-muted mb-1.5";
const sectionClass = "bg-white rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8 space-y-5";

const emptyForm = {
  estateId: "",
  propertyTemplate: "",
  units: "1",
  paymentPlan: "",
  paymentPackage: "",
  landPurpose: "",
  propertyLocation: "",
  plotSize: "",
  referralCode: "",
  title: "",
  firstName: "",
  lastName: "",
  otherName: "",
  gender: "",
  maritalStatus: "",
  birthDate: "",
  nationality: "",
  motherMaidenName: "",
  occupation: "",
  phone: "",
  email: "",
  meansOfIdentification: "",
  address: "",
  nokTitle: "",
  nokFirstName: "",
  nokLastName: "",
  nokOtherName: "",
  nokPhone: "",
  nokEmail: "",
  nokRelationship: "",
};

function formatBuyMessage(
  form: typeof emptyForm,
  estateName: string,
  idFile?: string,
  forWhatsApp = false
) {
  const docNote = idFile
    ? `ID Document uploaded: ${idFile}`
    : forWhatsApp
      ? "ID Document: Not uploaded — I will attach it on WhatsApp."
      : "ID Document: Not uploaded";

  const lines = [
    forWhatsApp ? "Hello Edjay Realty, I submitted a buy application:" : "",
    "=== PROPERTY DETAIL ===",
    `Estate: ${estateName}`,
    `Property Template: ${form.propertyTemplate}`,
    `Number of Units: ${form.units}`,
    `Payment Plan: ${form.paymentPlan}`,
    `Payment Package: ${form.paymentPackage}`,
    `Land Purpose: ${form.landPurpose}`,
    `Property Location: ${form.propertyLocation}`,
    `Plot Size: ${form.plotSize}`,
    form.referralCode ? `Referral Code: ${form.referralCode}` : "",
    "",
    "=== APPLICANT DETAIL ===",
    `Title: ${form.title}`,
    `Name: ${form.firstName} ${form.lastName}${form.otherName ? ` ${form.otherName}` : ""}`,
    `Gender: ${form.gender}`,
    `Marital Status: ${form.maritalStatus}`,
    `Date of Birth: ${form.birthDate}`,
    `Nationality: ${form.nationality}`,
    `Mother Maiden Name: ${form.motherMaidenName}`,
    `Occupation: ${form.occupation}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email}`,
    `Means of ID: ${form.meansOfIdentification}`,
    docNote,
    form.address ? `Address: ${form.address}` : "",
    "",
    "=== NEXT OF KIN ===",
    `Title: ${form.nokTitle}`,
    `Name: ${form.nokFirstName} ${form.nokLastName}${form.nokOtherName ? ` ${form.nokOtherName}` : ""}`,
    `Phone: ${form.nokPhone}`,
    `Email: ${form.nokEmail}`,
    `Relationship: ${form.nokRelationship}`,
    "",
    forWhatsApp
      ? "=== DOCUMENTS ===\nPlease attach on WhatsApp: valid ID (" +
        (form.meansOfIdentification || "NIN/Passport") +
        "), passport photo if available, and proof of payment when ready."
      : "",
  ];
  return lines.filter((l) => l !== undefined && l !== "").join("\n");
}

export default function BuyForm({ estates }: BuyFormProps) {
  const searchParams = useSearchParams();
  const preselectedEstate = searchParams.get("estate") || "";

  const [form, setForm] = useState(emptyForm);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFileUrl, setIdFileUrl] = useState("");
  const [uploadingId, setUploadingId] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableEstates = estates.filter((e) => e.status !== "sold-out");
  const selectedEstate = availableEstates.find((e) => e.id === form.estateId);
  const plotSizes = selectedEstate?.plotSizes || [];
  const paymentPlans = selectedEstate?.paymentPlans || [];
  const propertyLocations = selectedEstate
    ? [selectedEstate.location, ...selectedEstate.features.filter((f) => f.toLowerCase().includes("block"))]
    : [];

  useEffect(() => {
    if (preselectedEstate) {
      const match = availableEstates.find((e) => e.id === preselectedEstate);
      if (match) {
        setForm((prev) => ({
          ...prev,
          estateId: match.id,
          propertyLocation: match.location,
        }));
      }
    }
  }, [preselectedEstate, availableEstates]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "estateId") {
        const estate = availableEstates.find((e) => e.id === value);
        next.propertyTemplate = "";
        next.plotSize = "";
        next.paymentPlan = "";
        next.propertyLocation = estate?.location || "";
      }
      if (name === "propertyTemplate") {
        next.plotSize = value;
      }
      return next;
    });
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    setUploadingId(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("ID upload failed");
      const data = await res.json();
      setIdFileUrl(data.url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload ID document");
      setIdFile(null);
    } finally {
      setUploadingId(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const estateName = selectedEstate?.name || form.estateId;
    const whatsappMessage = formatBuyMessage(form, estateName, idFileUrl, true);
    const waWindow = window.open("", "_blank");
    const buyDetails = {
      propertyDetail: {
        estate: estateName,
        propertyTemplate: form.propertyTemplate,
        units: Number(form.units),
        paymentPlan: form.paymentPlan,
        paymentPackage: form.paymentPackage,
        landPurpose: form.landPurpose,
        propertyLocation: form.propertyLocation,
        plotSize: form.plotSize,
        referralCode: form.referralCode || undefined,
      },
      applicantDetail: {
        title: form.title,
        firstName: form.firstName,
        lastName: form.lastName,
        otherName: form.otherName || undefined,
        gender: form.gender,
        maritalStatus: form.maritalStatus,
        birthDate: form.birthDate,
        nationality: form.nationality,
        motherMaidenName: form.motherMaidenName,
        occupation: form.occupation,
        phone: form.phone,
        email: form.email,
        meansOfIdentification: form.meansOfIdentification,
        meansOfIdentificationFile: idFileUrl || undefined,
        address: form.address || undefined,
      },
      nokDetail: {
        title: form.nokTitle,
        firstName: form.nokFirstName,
        lastName: form.nokLastName,
        otherName: form.nokOtherName || undefined,
        phone: form.nokPhone,
        email: form.nokEmail,
        relationship: form.nokRelationship,
      },
    };

    let dbSaved = false;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          estate: estateName,
          message: formatBuyMessage(form, estateName, idFileUrl),
          type: "buy-now",
          buyDetails,
        }),
      });
      dbSaved = res.ok;
    } catch {
      dbSaved = false;
    }

    const opened = navigateWhatsAppWindow(waWindow, whatsappMessage);
    if (!opened) {
      window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
    }

    setSavedToDb(dbSaved);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    const estateName = selectedEstate?.name || form.estateId;
    return (
      <div className={`${sectionClass} text-center animate-fade-in`}>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)] mb-3">
          Application Submitted!
        </h2>
        <p className="text-text-muted text-sm mb-4 max-w-md mx-auto">
          Thank you, {form.firstName}. WhatsApp should have opened with your application details — tap Send to confirm with our team.
          {savedToDb
            ? " A copy is also saved in our system."
            : " Send the WhatsApp message to complete your request."}
        </p>
        <div className="text-amber-800 bg-amber-50 border border-amber-200 text-sm p-4 rounded-xl mb-4 max-w-md mx-auto text-left">
          <p className="font-bold mb-2">Attach these on WhatsApp:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90">
            <li>{form.meansOfIdentification || "Valid ID"} (photo or PDF)</li>
            <li>Passport photograph (if available)</li>
            {!idFileUrl && <li>Your ID file — not uploaded on the form</li>}
            {idFileUrl && <li>ID uploaded — you may still attach a clearer copy</li>}
          </ul>
        </div>
        <a
          href={buildWhatsAppUrl(formatBuyMessage(form, estateName, idFileUrl, true))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
        >
          Open WhatsApp Again
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6">
        <h3 className="text-sm font-bold text-dark mb-2">Documents &amp; information required</h3>
        <ul className="text-sm text-text-muted space-y-1.5 list-disc list-inside">
          <li>Valid ID: {ID_TYPES.join(", ")}</li>
          <li>Passport photograph (recent)</li>
          <li>Proof of payment / deposit slip (when paying)</li>
          <li>Upload ID on this form if you can — you will also attach files on WhatsApp after submit</li>
          <li>
            <strong className="text-dark">Submit opens WhatsApp</strong> with your details pre-filled; tap Send to reach our team
          </li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">{error}</div>
      )}

      {/* Property Detail */}
      <section className={sectionClass}>
        <h2 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)] border-b border-border-light pb-3">
          Property Detail
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="estateId" className={labelClass}>Select Estate *</label>
            <select id="estateId" name="estateId" required value={form.estateId} onChange={handleChange} className={inputClass}>
              <option value="">Select Estate</option>
              {availableEstates.map((estate) => (
                <option key={estate.id} value={estate.id}>{estate.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="propertyTemplate" className={labelClass}>Property Template *</label>
            <select
              id="propertyTemplate"
              name="propertyTemplate"
              required
              value={form.propertyTemplate}
              onChange={handleChange}
              disabled={!form.estateId}
              className={`${inputClass} disabled:opacity-50`}
            >
              <option value="">Select Property Template</option>
              {plotSizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="units" className={labelClass}>Number of Units *</label>
            <select id="units" name="units" required value={form.units} onChange={handleChange} className={inputClass}>
              <option value="">Select Number of Units</option>
              {UNIT_OPTIONS.map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paymentPlan" className={labelClass}>Payment Plan *</label>
            <select
              id="paymentPlan"
              name="paymentPlan"
              required
              value={form.paymentPlan}
              onChange={handleChange}
              disabled={!form.estateId}
              className={`${inputClass} disabled:opacity-50`}
            >
              <option value="">Select Payment Plan</option>
              {paymentPlans.length > 0 ? (
                paymentPlans.map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} — {plan.duration}
                  </option>
                ))
              ) : (
                <>
                  <option value="Outright Payment">Outright Payment</option>
                  <option value="6 Months Installment">6 Months Installment</option>
                  <option value="12 Months Installment">12 Months Installment</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="paymentPackage" className={labelClass}>Payment Package *</label>
            <select id="paymentPackage" name="paymentPackage" required value={form.paymentPackage} onChange={handleChange} className={inputClass}>
              <option value="">Select Payment Package</option>
              {PAYMENT_PACKAGES.map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="landPurpose" className={labelClass}>Land Purpose *</label>
            <select id="landPurpose" name="landPurpose" required value={form.landPurpose} onChange={handleChange} className={inputClass}>
              <option value="">Select Land Purpose</option>
              {LAND_PURPOSES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="propertyLocation" className={labelClass}>Property Location *</label>
            <select
              id="propertyLocation"
              name="propertyLocation"
              required
              value={form.propertyLocation}
              onChange={handleChange}
              disabled={!form.estateId}
              className={`${inputClass} disabled:opacity-50`}
            >
              <option value="">Select Property Location</option>
              {(propertyLocations.length > 0 ? propertyLocations : [selectedEstate?.location]).filter(Boolean).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="plotSize" className={labelClass}>Plot Size (sqm) *</label>
            <select
              id="plotSize"
              name="plotSize"
              required
              value={form.plotSize}
              onChange={handleChange}
              disabled={!form.estateId}
              className={`${inputClass} disabled:opacity-50`}
            >
              <option value="">Select Plot Size</option>
              {plotSizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="referralCode" className={labelClass}>Referral Code</label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={form.referralCode}
              onChange={handleChange}
              placeholder="Referral Code"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Applicant Detail */}
      <section className={sectionClass}>
        <h2 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)] border-b border-border-light pb-3">
          Applicant Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <select id="title" name="title" required value={form.title} onChange={handleChange} className={inputClass}>
              <option value="">Select Title</option>
              {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="firstName" className={labelClass}>First Name *</label>
            <input type="text" id="firstName" name="firstName" required value={form.firstName} onChange={handleChange} placeholder="First Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last Name *</label>
            <input type="text" id="lastName" name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Last Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="otherName" className={labelClass}>Other Name</label>
            <input type="text" id="otherName" name="otherName" value={form.otherName} onChange={handleChange} placeholder="Other Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="gender" className={labelClass}>Gender *</label>
            <select id="gender" name="gender" required value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select Gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="maritalStatus" className={labelClass}>Marital Status *</label>
            <select id="maritalStatus" name="maritalStatus" required value={form.maritalStatus} onChange={handleChange} className={inputClass}>
              <option value="">Select Marital Status</option>
              {MARITAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="birthDate" className={labelClass}>Date of Birth *</label>
            <input type="date" id="birthDate" name="birthDate" required value={form.birthDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="nationality" className={labelClass}>Nationality *</label>
            <select id="nationality" name="nationality" required value={form.nationality} onChange={handleChange} className={inputClass}>
              <option value="">Select Nationality</option>
              {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="motherMaidenName" className={labelClass}>Mother Maiden Name *</label>
            <input type="text" id="motherMaidenName" name="motherMaidenName" required value={form.motherMaidenName} onChange={handleChange} placeholder="Mother Maiden Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="occupation" className={labelClass}>Occupation *</label>
            <input type="text" id="occupation" name="occupation" required value={form.occupation} onChange={handleChange} placeholder="Occupation" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number *</label>
            <input type="tel" id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="meansOfIdentification" className={labelClass}>Means of Identification *</label>
            <select id="meansOfIdentification" name="meansOfIdentification" required value={form.meansOfIdentification} onChange={handleChange} className={inputClass}>
              <option value="">Select Means of Identification</option>
              {ID_TYPES.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Upload ID Document</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleIdUpload}
              className={`${inputClass} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-xs`}
            />
            <p className="text-xs text-text-muted mt-1.5">
              JPG, PNG, or PDF. If upload fails, attach the file on WhatsApp after submitting.
            </p>
            {uploadingId && <p className="text-xs text-text-muted mt-1">Uploading...</p>}
            {idFile && !uploadingId && <p className="text-xs text-primary mt-1">{idFile.name}</p>}
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="address" className={labelClass}>Address</label>
            <input type="text" id="address" name="address" value={form.address} onChange={handleChange} placeholder="Residential Address" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Next of Kin */}
      <section className={sectionClass}>
        <h2 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)] border-b border-border-light pb-3">
          Next Of Kin Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nokTitle" className={labelClass}>Title *</label>
            <select id="nokTitle" name="nokTitle" required value={form.nokTitle} onChange={handleChange} className={inputClass}>
              <option value="">Select Title</option>
              {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="nokFirstName" className={labelClass}>First Name *</label>
            <input type="text" id="nokFirstName" name="nokFirstName" required value={form.nokFirstName} onChange={handleChange} placeholder="First Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nokLastName" className={labelClass}>Last Name *</label>
            <input type="text" id="nokLastName" name="nokLastName" required value={form.nokLastName} onChange={handleChange} placeholder="Last Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nokOtherName" className={labelClass}>Other Name</label>
            <input type="text" id="nokOtherName" name="nokOtherName" value={form.nokOtherName} onChange={handleChange} placeholder="Other Name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nokPhone" className={labelClass}>Phone Number *</label>
            <input type="tel" id="nokPhone" name="nokPhone" required value={form.nokPhone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nokEmail" className={labelClass}>Email *</label>
            <input type="email" id="nokEmail" name="nokEmail" required value={form.nokEmail} onChange={handleChange} placeholder="Email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nokRelationship" className={labelClass}>Relationship *</label>
            <select id="nokRelationship" name="nokRelationship" required value={form.nokRelationship} onChange={handleChange} className={inputClass}>
              <option value="">Select Relationship</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting || uploadingId}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl text-base transition-all disabled:opacity-60 shadow-lg shadow-primary/10"
      >
        {submitting ? "Opening WhatsApp..." : "Submit & Send via WhatsApp"}
      </button>
    </form>
  );
}
