import React, { useState, useEffect } from "react";

export default function Contact() {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Accordion active state for FAQs
  const [activeFaq, setActiveFaq] = useState(null);

  // Live Clinic Open/Closed indicator state
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [currentDayStr, setCurrentDayStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  useEffect(() => {
    const updateClinicStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const timeDecimal = hour + minutes / 60;

      // Let's assume clinic hours are Mon-Sat: 9:00 AM - 6:00 PM (9.0 to 18.0 decimal)
      // Closed on Sundays
      const isWeekdayOrSat = day >= 1 && day <= 6;
      const isWithinHours = timeDecimal >= 9.0 && timeDecimal < 18.0;

      setIsOpenNow(isWeekdayOrSat && isWithinHours);
      
      // Formatting time and day for display
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      setCurrentDayStr(days[day]);
      
      let formattedHour = hour % 12 || 12;
      let ampm = hour >= 12 ? "PM" : "AM";
      let formattedMin = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTimeStr(`${formattedHour}:${formattedMin} ${ampm}`);
    };

    updateClinicStatus();
    const interval = setInterval(updateClinicStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    
    // Simulate API request to server
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setSubject("General Support");
    setMessage("");
    setIsSuccess(false);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // FAQ Data list
  const faqs = [
    {
      question: "How do I schedule an appointment with a specialist?",
      answer: "You can schedule appointments directly from your dashboard after logging into your Medicare account. Alternatively, you can call our patient support line at (555) 234-5678 to match with verified specialists nearby."
    },
    {
      question: "What health insurance plans do you accept?",
      answer: "We partner with a wide variety of national and regional providers, including Blue Cross, Aetna, Cigna, UnitedHealthcare, and Medicare Advantage plans. Please enter your provider details during signup or check our verified provider list."
    },
    {
      question: "Are virtual / telemedicine consultations available?",
      answer: "Yes, many of our affiliated providers offer digital visits. When searching for providers in the portal, you can filter specifically for 'Telehealth Available' to schedule virtual consultations from the comfort of your home."
    },
    {
      question: "How do I request a prescription refill or medical records?",
      answer: "Secure digital requests can be sent directly to your registered care team from your portal. Navigate to the records section inside your dashboard or contact our administrative team at support@medicare.com for expedited physical copies."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-500/10 via-slate-50 to-slate-50 px-6 py-20 sm:px-10 text-center">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
        
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
            </span>
            Support Hub
          </span>
          
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Let&apos;s start a <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">conversation</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl mx-auto">
            Have questions about finding a doctor, scheduling virtual care, or managing your Medicare portal account? Our support team is here to assist you.
          </p>
        </div>
      </section>

      {/* 2. LIVE CLINIC HOURS & QUICK INFO CARDS */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 -mt-6">
        {/* Live Clinic Hours Pulse Header */}
        <div className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 transition hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Clinic Availability</h3>
              <p className="text-sm text-slate-500">Local time: {currentTimeStr || "--:--"} • {currentDayStr || "---"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-inner ${
              isOpenNow 
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/10" 
                : "bg-rose-50 text-rose-700 ring-1 ring-rose-500/10"
            }`}>
              <span className={`h-2.5 w-2.5 rounded-full ${isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {isOpenNow ? "Open Now" : "Closed"}
            </span>
            <span className="text-sm text-slate-600 font-medium">9:00 AM - 6:00 PM (Mon - Sat)</span>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">Emergency Hotline</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Urgent health navigation support or portal login inquiries.</p>
            <p className="mt-4 font-semibold text-sky-600 transition group-hover:text-sky-700">
              <a href="tel:+15552345678" className="focus:outline-none focus:underline">+1 (555) 234-5678</a>
            </p>
            <p className="mt-1 text-xs text-slate-400">Toll-free 24/7 support line</p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">General Inquiries</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">For administrative support, partnership queries, or feedback.</p>
            <p className="mt-4 font-semibold text-indigo-600 transition group-hover:text-indigo-700">
              <a href="mailto:support@medicare.com" className="focus:outline-none focus:underline">support@medicare.com</a>
            </p>
            <p className="mt-1 text-xs text-slate-400">Average response: &lt; 12 hours</p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">Main Headquarters</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Stop by our flagship administrative office or medical lobby.</p>
            <p className="mt-4 font-semibold text-emerald-600 transition group-hover:text-emerald-700">
              <span className="cursor-pointer">100 Wellness Way, Suite 400</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">San Francisco, CA 94107</p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FORM & FAQS GRID */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* A. Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:border-slate-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-sky-500 to-indigo-600" />
            
            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Send us a secure message</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Your transmission is protected with bank-grade transport layer encryption.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Full Name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-50"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Email Address</span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="john@example.com"
                        required
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-50"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Subject</span>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.8rem_auto] bg-[position:right_1.25rem_center] bg-no-repeat pr-10"
                    >
                      <option value="General Support">General Support</option>
                      <option value="Appointment Booking">Appointment Booking</option>
                      <option value="Billing &amp; Payments">Billing &amp; Payments</option>
                      <option value="Provider Partnerships">Provider Partnerships</option>
                      <option value="Technical Feedback">Technical Feedback</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Message</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your health query, feedback or portal issue here..."
                      rows="5"
                      required
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-50 resize-y min-h-[120px]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-85 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Encrypting &amp; Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Secure Message
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Panel State */
              <div className="py-12 px-4 text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner scale-100 animate-[bounce_0.8s_ease-in-out_1]">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="mt-8 text-3xl font-extrabold text-slate-900 tracking-tight">Message Received!</h3>
                <p className="mt-4 text-base text-slate-600 max-w-md mx-auto leading-7">
                  Thank you, <strong className="text-slate-900 font-semibold">{name}</strong>! Your inquiry about <span className="text-sky-600 font-medium">{subject}</span> has been securely transmitted. 
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  A receipt confirmation and follow-up was dispatched to <strong className="text-slate-800">{email}</strong>.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
                  >
                    Send another query
                  </button>
                  <a 
                    href="/" 
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Return to home
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* B. Right Column: FAQs Accordion */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Self Help</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="mt-2 text-sm text-slate-500">
                Skip the ticket queue by looking through our direct patient support resources.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                      isOpen ? "border-sky-300 shadow-md shadow-sky-50/50" : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-800 transition hover:text-slate-900 focus:outline-none"
                    >
                      <span className="text-base leading-6 pr-2">{faq.question}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                        isOpen ? "bg-sky-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                      }`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    
                    {/* Animated Accordion Body */}
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[300px] opacity-100 border-t border-slate-100" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="px-6 py-5 text-sm leading-6 text-slate-600 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-xl">
              <h4 className="font-semibold text-lg">Need Immediate Help?</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                If you are experiencing a medical emergency, please dial <strong className="text-white">911</strong> or go to your nearest emergency room immediately.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CLINIC HOURS & MODERN SIMULATED MAP */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100 overflow-hidden grid gap-8 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visit Us</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Headquarters &amp; Lobby Hours</h2>
              <p className="mt-2 text-sm text-slate-500">
                Drop in or send physical documents to our corporate campus.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Monday - Friday</span>
                <span className="text-sm font-semibold text-slate-950">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-600">Saturday</span>
                <span className="text-sm font-semibold text-slate-950">9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-medium text-slate-400">Sunday</span>
                <span className="text-sm font-semibold text-slate-400">Closed for Lobby Visits</span>
              </div>
            </div>

            <div className="rounded-2xl bg-sky-50/50 p-4 border border-sky-100 flex items-start gap-3">
              <svg className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-sky-700 leading-relaxed">
                Parking validation is available for patients at the Wellness Way parking garage structure adjacent to Lobby A.
              </p>
            </div>
          </div>

          {/* Premium Vector Styled Map UI */}
          <div className="lg:col-span-7 h-[300px] w-full rounded-2xl border border-slate-100 bg-slate-950 relative overflow-hidden group">
            {/* Grid & Map aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f6_0.5px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
            
            {/* Stylized vector roads */}
            <div className="absolute top-[20%] left-0 w-full h-10 bg-slate-900/50 border-y border-slate-800/30 transform -rotate-6" />
            <div className="absolute top-[60%] left-0 w-full h-14 bg-slate-900/50 border-y border-slate-800/30 transform rotate-3" />
            <div className="absolute top-0 left-[45%] w-16 h-full bg-slate-900/50 border-x border-slate-800/30 transform rotate-12" />
            
            {/* Stylized building blocks */}
            <div className="absolute top-[10%] left-[10%] w-[25%] h-[20%] rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
              Bay Medical
            </div>
            <div className="absolute top-[45%] left-[65%] w-[30%] h-[30%] rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
              Wellness Parking
            </div>
            <div className="absolute top-[75%] left-[20%] w-[20%] h-[15%] rounded bg-slate-900/80 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
              Office Plaza
            </div>

            {/* Glowing active location pointer */}
            <div className="absolute top-[48%] left-[43%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* Tooltip */}
              <div className="bg-white text-slate-950 font-bold text-[11px] px-3 py-1 rounded-md shadow-lg border border-slate-200 mb-2 whitespace-nowrap animate-bounce flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-600" />
                MEDICARE HQ
              </div>
              {/* Glow Ring */}
              <div className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60"></span>
                <span className="relative flex h-3.5 w-3.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 border border-white"></span>
              </div>
            </div>

            {/* Map Interaction Overlay (mock) */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-400 flex items-center gap-2">
              <svg className="h-3 w-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Simulated Location Services Active
            </div>
            
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="absolute bottom-4 right-4 bg-sky-600 hover:bg-sky-700 transition px-3 py-1.5 rounded-lg text-[10px] text-white font-bold flex items-center gap-1"
            >
              Google Maps
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}
