import { useRef, useState } from "react";
import Button from "./Button";
import BookingSummary from "./BookingSummary";
import CheckoutSection from "./CheckoutSection";
import FormField, { inputClassName } from "./FormField";
import PaymentPanel from "./PaymentPanel";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const initialForm = {
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1 234 567 890",
  country: "United States",
  driverName: "John Doe",
  licenseCountry: "United States",
  driverAge: "35",
  licenseNumber: "DL-12345678",
  cardName: "John Doe",
  cardNumber: "0000 0000 0000 0000",
  expiryDate: "MM/YY",
  cvv: "123",
  saveCard: false,
  sameAsTraveler: true,
  terms: false,
};

export default function CarCheckout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const summaryRef = useRef(null);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.driverName || !form.licenseNumber) {
      setError("Please complete the traveler and driver information.");
      return;
    }
    if (!form.terms) {
      setError("Please accept the Terms of Service and Rental Policy to continue.");
      return;
    }
    setError("");
    setIsConfirmed(true);
  };

  const handleBack = () => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div id="top" className="min-h-screen w-full bg-[#FDFBF7] font-sans text-gray-900 antialiased">
      <SiteHeader />
      {isConfirmed ? <Confirmation /> : (
        <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
          <p className="mb-2 text-xs text-gray-500">Home &gt; Car Rental &gt; Booking &gt; <span className="font-medium text-gray-900">Checkout</span></p>
          <h1 className="mb-6 font-serif text-3xl font-bold text-gray-900">Checkout</h1>
          <CheckoutStepper />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <TravelerSection form={form} onChange={handleChange} />
              <DriverSection form={form} onChange={handleChange} />
              <PaymentPanel paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} form={form} onChange={handleChange} />
              <BillingSection form={form} onChange={handleChange} />
              <label className="flex cursor-pointer items-start gap-2.5 px-1 text-xs leading-relaxed text-gray-600">
                <input type="checkbox" checked={form.terms} onChange={handleChange("terms")} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-0" />
                <span>I agree to the <a href="#terms" className="text-black underline">Terms of Service</a>, <a href="#privacy" className="text-black underline">Privacy Policy</a>, and <a href="#rental-policy" className="text-black underline">Rental Policy</a>.</span>
              </label>
              {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            </div>
            <div ref={summaryRef}><BookingSummary onConfirm={handleSubmit} onBack={handleBack} /></div>
          </form>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}

function TravelerSection({ form, onChange }) {
  return <CheckoutSection title="Traveler Information" icon="♙"><div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"><FormField label="Full Name" id="fullName"><input id="fullName" value={form.fullName} onChange={onChange("fullName")} className={inputClassName} autoComplete="name" /></FormField><FormField label="Email" id="email"><input id="email" type="email" value={form.email} onChange={onChange("email")} className={inputClassName} autoComplete="email" /></FormField><FormField label="Phone" id="phone"><input id="phone" value={form.phone} onChange={onChange("phone")} className={inputClassName} autoComplete="tel" /></FormField><FormField label="Country" id="country"><select id="country" value={form.country} onChange={onChange("country")} className={inputClassName}><option>United States</option><option>Thailand</option></select></FormField></div></CheckoutSection>;
}

function DriverSection({ form, onChange }) {
  return <CheckoutSection title="Driver Information" icon="▱"><div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"><FormField label="Driver Full Name" id="driverName"><input id="driverName" value={form.driverName} onChange={onChange("driverName")} className={inputClassName} /></FormField><FormField label="License Country" id="licenseCountry"><select id="licenseCountry" value={form.licenseCountry} onChange={onChange("licenseCountry")} className={inputClassName}><option>United States</option><option>Thailand</option></select></FormField><FormField label="Driver Age" id="driverAge"><input id="driverAge" type="number" value={form.driverAge} onChange={onChange("driverAge")} className={inputClassName} min="18" /></FormField><FormField label="License Number" id="licenseNumber"><input id="licenseNumber" value={form.licenseNumber} onChange={onChange("licenseNumber")} className={inputClassName} /></FormField></div></CheckoutSection>;
}

function BillingSection({ form, onChange }) {
  return <CheckoutSection title="Billing Address" icon="▤" className="flex items-center justify-between p-6"><label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"><input type="checkbox" checked={form.sameAsTraveler} onChange={onChange("sameAsTraveler")} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0" />Same as traveler</label></CheckoutSection>;
}

function CheckoutStepper() {
  return <div className="mb-8 flex flex-wrap items-center gap-6 text-xs font-medium text-gray-600"><Step label="Selection" done /><Step label="Details" done /><Step label="Checkout" active /></div>;
}

function Step({ label, done, active }) {
  return <span className={`flex items-center gap-2 ${active ? "font-bold text-black" : ""}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${active ? "border-black bg-black text-white" : "border-gray-400 text-gray-600"}`}>{done ? "✓" : "●"}</span>{label}</span>;
}

function Confirmation() {
  return <main className="mx-auto max-w-2xl px-6 py-24 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3CB68] text-2xl">✓</div><h1 className="font-serif text-3xl font-bold">Booking Confirmed</h1><p className="mt-3 text-gray-600">Your Toyota Fortuner booking has been confirmed. This is a demo checkout.</p><Button variant="primary" className="mt-8 rounded px-6 py-3 text-sm" onClick={() => window.location.reload()}>Return to Checkout</Button></main>;
}
