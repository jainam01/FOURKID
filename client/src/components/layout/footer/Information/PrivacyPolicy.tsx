// src/components/pages/PrivacyPolicyPage.tsx

import { Helmet } from "react-helmet-async";
import { ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";

const PrivacyPolicyPage = () => {
  const effectiveDate = "2025-07-06";
  const companyName = "Fourkids";
  const serviceName = "fourkids.in";
  const contactEmail = "arihant.8758586464@gmail.com";
  const contactPhone = "+91 875858 6464";

  const primaryHeaderHeight = "5rem";
  const sectionScrollMarginTopClass = `scroll-mt-[calc(${primaryHeaderHeight}+1rem)]`;

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <>
          <p>Welcome to {serviceName}!</p>
          <p>{companyName} (“we”, “our”, or “us”) operates the website <a href={`https://${serviceName}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">{serviceName} <ExternalLink className="h-3 w-3 ml-1" /></a> (the "Service").</p>
          <p>This Privacy Policy governs your visit to {serviceName}, and explains how we collect, use, and protect the information you provide while using our wholesale platform.</p>
          <p>At {companyName}, we specialize in kids’ fashion for retailers and take privacy seriously. Whether you're browsing our catalog, placing an order, or signing up for restock alerts — your data is handled with care and transparency.</p>
        </>
      ),
    },
    {
      id: "collection-of-personal-information",
      title: "Collection of Personal Information",
      content: (
        <>
          <p>We collect personal information when you register, place an order, or contact us. This includes details such as your name, phone number, business details, shipping address, and payment information.</p>
          <ol className="list-[lower-alpha] pl-6 space-y-1">
            <li>Email address</li>
            <li>Business name and contact person</li>
            <li>Phone number</li>
            <li>Billing and shipping address</li>
            <li>GST number (if applicable)</li>
            <li>Cookies and usage data</li>
          </ol>
        </>
      ),
    },
    {
      id: "use-of-personal-information",
      title: "Use of Personal Information",
      content: (
        <p>We use your information to process wholesale orders, respond to inquiries, improve our website, and send product updates or promotional offers. You may opt out at any time.</p>
      ),
    },
    {
      id: "disclosure-of-personal-information",
      title: "Disclosure of Personal Information",
      content: (
        <p>We share your information only with trusted service providers for order fulfillment, delivery, and payment processing. We do not sell your data to third parties.</p>
      ),
    },
    {
      id: "protection-of-personal-information",
      title: "Protection of Personal Information",
      content: (
        <p>We implement secure technology and practices to protect your personal information from unauthorized access, alteration, or loss. However, no system is 100% secure.</p>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p>You may access, update, or delete your data by contacting us at the email below. You may also opt out of promotional emails anytime using the unsubscribe link.</p>
        </>
      ),
    },
    {
      id: "contact-us-privacy",
      title: "Contact Us",
      content: (
        <p>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:
          <br />Email: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium">{contactEmail}</a>
          <br />Phone / WhatsApp: <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="text-primary hover:underline font-medium">{contactPhone}</a>
        </p>
      ),
    }
  ];

  return (
    <div className="privacy-policy-page bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Privacy Policy - {companyName}</title>
        <meta name="description" content={`Privacy Policy for ${serviceName} explaining how ${companyName} collects and safeguards your data.`} />
      </Helmet>

      <section className="bg-muted/40 py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Effective date: {new Date(effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Smaller TOC Sidebar */}
            <aside className={`lg:w-1/3 xl:w-1/4 lg:sticky ${sectionScrollMarginTopClass.replace("scroll-mt", "top")} self-start hidden lg:block max-h-[calc(100vh-${primaryHeaderHeight}-4rem)] overflow-y-auto rounded-xl border border-border bg-card p-8 shadow-md`}>
              <h3 className="text-2xl font-extrabold mb-8 text-foreground tracking-wide">Policy Sections</h3>
              <nav>
                <ul className="space-y-4">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-base font-medium text-muted-foreground hover:text-primary hover:underline transition-colors duration-200"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>



            <main className="lg:w-3/4 xl:w-4/5">
              <div className="prose prose-slate dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none space-y-12">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className={sectionScrollMarginTopClass}>
                    <h2 className="!text-2xl lg:!text-3xl !font-semibold !mb-6 !text-foreground border-b border-border pb-3">
                      {section.title}
                    </h2>
                    <div className="text-foreground/80 space-y-4 leading-relaxed">{section.content}</div>
                  </section>
                ))}
              </div>
            </main>

          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-5" strokeWidth={1.5} />
          <h3 className="text-2xl font-semibold text-foreground mb-4">Questions About This Policy?</h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            If you have any questions or concerns regarding our Privacy Policy or your data, please reach out.
          </p>
          <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-6">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <Mail className="mr-2 h-5 w-5" /> Email: {contactEmail}
            </a>
            <a
              href={`tel:${contactPhone.replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md shadow-sm text-primary bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <Phone className="mr-2 h-5 w-5" /> Call/WhatsApp: {contactPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;