"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { submitToSheet } from "../lib/submitToSheet";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().optional(),
  enquiryType: z.enum(["retail", "corporate", "wholesale"], {
    message: "Please select an enquiry type",
  }),
  quantity: z.string().optional(),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      enquiryType: "retail",
    },
  });

  // Pre-fill from URL hash params (e.g., #enquiry?type=prestige)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=")) {
      const typeParam = hash.split("type=")[1]?.split("&")[0];
      if (typeParam === "elegance" || typeParam === "prestige" || typeParam === "royal") {
        setValue("enquiryType", "corporate");
      }
    }
  }, [setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitError(null);
    try {
      await submitToSheet(data as unknown as Record<string, string>);
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <section id="enquiry" className="bg-primary-green py-24 px-6 md:px-12">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold mb-4">
            Thank You!
          </h2>
          <p className="font-body text-lg text-cream/70">
            Your enquiry has been received. Our team will get back to you within
            24 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="bg-primary-green py-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-gold/80 mb-3">
              Get In Touch
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold text-white mb-4">
              Let&apos;s Talk
              <br />
              Foxnuts
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />
            <p className="font-body text-base text-cream/60 leading-relaxed mb-8">
              Whether you&apos;re looking for retail quantities, corporate
              gifting solutions, or bulk wholesale orders — we&apos;d love to
              hear from you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Send size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-body text-sm text-cream/50">Email</p>
                  <p className="font-body text-base text-cream">
                    sales.dealsinfoxnut@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                Full Name <span className="text-gold">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Your full name"
                className={`w-full px-4 py-3 bg-white/[0.06] border rounded-lg font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors ${
                  errors.name ? "border-red-400" : "border-gold/20"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 font-body">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email + Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                  Email <span className="text-gold">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 bg-white/[0.06] border rounded-lg font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors ${
                    errors.email ? "border-red-400" : "border-gold/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 font-body">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                  Phone <span className="text-gold">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 bg-white/[0.06] border rounded-lg font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors ${
                    errors.phone ? "border-red-400" : "border-gold/20"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1 font-body">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                City
              </label>
              <input
                {...register("city")}
                type="text"
                placeholder="Your city"
                className="w-full px-4 py-3 bg-white/[0.06] border border-gold/20 rounded-lg font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>

            {/* Enquiry Type + Quantity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                  Enquiry Type <span className="text-gold">*</span>
                </label>
                <select
                  {...register("enquiryType")}
                  className={`w-full px-4 py-3 bg-white/[0.06] border rounded-lg font-body text-sm text-cream focus:outline-none focus:border-gold/60 transition-colors appearance-none ${
                    errors.enquiryType ? "border-red-400" : "border-gold/20"
                  }`}
                >
                  <option value="retail" className="bg-dark-green">
                    Retail
                  </option>
                  <option value="corporate" className="bg-dark-green">
                    Corporate Gift
                  </option>
                  <option value="wholesale" className="bg-dark-green">
                    Bulk Wholesale
                  </option>
                </select>
                {errors.enquiryType && (
                  <p className="text-xs text-red-400 mt-1 font-body">
                    {errors.enquiryType.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                  Quantity (approx)
                </label>
                <select
                  {...register("quantity")}
                  className="w-full px-4 py-3 bg-white/[0.06] border border-gold/20 rounded-lg font-body text-sm text-cream focus:outline-none focus:border-gold/60 transition-colors appearance-none"
                >
                  <option value="" className="bg-dark-green">
                    Select quantity
                  </option>
                  <option value="<10kg" className="bg-dark-green">
                    Less than 10kg
                  </option>
                  <option value="10-50kg" className="bg-dark-green">
                    10 – 50 kg
                  </option>
                  <option value="50kg+" className="bg-dark-green">
                    50 kg+
                  </option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-body font-semibold text-cream/80 mb-1.5">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Tell us more about your requirement..."
                className={`w-full px-4 py-3 bg-white/[0.06] border rounded-lg font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors resize-none ${
                  errors.message ? "border-red-400" : "border-gold/20"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-1 font-body">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Error toast */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-4 py-3 text-sm font-body text-red-400">
                {submitError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 text-sm font-body font-semibold uppercase tracking-[0.12em] px-8 py-3.5 bg-gold text-dark-green rounded-[4px] hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
