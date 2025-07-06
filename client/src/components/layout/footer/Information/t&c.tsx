// src/components/pages/TermsAndConditionsPage.tsx

import { Helmet } from "react-helmet-async";
import { FileText, Mail, ExternalLink } from "lucide-react";

const TermsAndConditionsPage = () => {
  // --- UPDATE YOUR DETAILS HERE ---
  const lastUpdated = "2025-07-06"; // Keep this date current
  const companyName = "Fourkids"; // Your official business name
  const serviceName = "fourkids.in"; // Your website domain
  const contactEmail = "arihant.8758586464@gmail.com";

  // Configuration for sticky elements
  const primaryHeaderHeight = "5rem";
  const tocStickyTopClass = `lg:top-[calc(${primaryHeaderHeight}+1rem)]`;
  const sectionScrollMarginTopClass = `scroll-mt-[calc(${primaryHeaderHeight}+1rem)]`;

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <>
          <p>Welcome to {companyName} (“Company”, “we”, “our”, “us”)! These Terms of Service (“Terms”) govern your use of our wholesale website located at <a href={`https://${serviceName}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">{serviceName} <ExternalLink className="h-3 w-3 ml-1" /></a> (the “Service”).</p>
          <p>Our Privacy Policy also governs your use of our Service and explains how we collect and safeguard information. You can review our Privacy Policy <a href="/privacy" className="text-primary hover:underline">here</a>.</p>
          <p>Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Agreements.</p>
          <p>If you do not agree with these Agreements, you may not use the Service. Please contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a> if you have any questions.</p>
        </>
      ),
    },
    {
      id: "communications",
      title: "2. Communications",
      content: (
        <p>By creating an account on our Service, you agree to subscribe to newsletters, marketing or promotional materials, and other information we may send regarding our wholesale offerings. You may opt out of receiving any, or all, of these communications by following the unsubscribe link or by contacting us.</p>
      ),
    },
    {
      id: "purchases",
      title: "3. Wholesale Purchases",
      content: (
        <>
          <p>If you wish to purchase any product through the Service (“Purchase”), you will be required to supply information relevant to your business and Purchase, including your billing address, shipping information, and payment details.</p>
          <p>You represent and warrant that: (i) you have the legal right to use any payment method(s) in connection with any Purchase; and (ii) the information you supply to us is true, correct, and complete.</p>
          <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product availability, errors in product description or price, or if fraud or an unauthorized transaction is suspected.</p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "4. Wholesale Accounts",
      content: (
        <>
            <p>When you create an account with us, you guarantee that you are above the age of 18 and that the information you provide is accurate, complete, and current. Inaccurate or incomplete information may result in the immediate termination of your account.</p>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            <p>We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</p>
        </>
      ),
    },
    {
      id: "refunds",
      title: "5. Refunds and Returns",
      content: (
          <p>Our refund and return process is designed for our wholesale partners. All claims are handled on a case-by-case basis as outlined in our detailed <a href="/refund-policy" className="text-primary hover:underline">Refund & Return Policy</a>. Please review it carefully.</p>
      )
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property",
      content: (
          <p>The Service and its original content (including all product images, designs, and text), features, and functionality are and will remain the exclusive property of {companyName} and its licensors. Our trademarks and branding may not be used in connection with any product or service without our prior written consent.</p>
      )
    },
    {
      id: "prohibited-uses",
      title: "7. Prohibited Uses",
      content: (
          <>
              <p>You may use the Service only for lawful wholesale purchasing purposes and in accordance with these Terms. You agree not to use the Service:</p>
              <ol className="list-[lower-alpha] pl-6 space-y-2">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>To impersonate or attempt to impersonate {companyName}, a {companyName} employee, or any other person or entity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the Service, or which, as determined by us, may harm our Company or our retail partners.</li>
                  <li>To use any robot, spider, or other automatic device to access the Service for any purpose, including monitoring or copying any of the material without our prior written consent.</li>
              </ol>
          </>
      )
    },
    { 
      id: "no-use-by-minors", 
      title: "8. No Use By Minors", 
      content: <p>Our Service is intended for access and use by business owners and retailers who are at least eighteen (18) years old. By using the Service, you warrant that you meet this age requirement. Our products are for children, but our Service is for adults. If you are not at least eighteen years old, you are prohibited from using this Service.</p> 
    },
    {
      id: "limitation-of-liability",
      title: "9. Limitation Of Liability",
      content: (
          <p className="font-semibold uppercase">Except as prohibited by law, you will hold us and our officers, directors, employees, and agents harmless for any indirect, special, incidental, or consequential damage. If there is liability found on the part of {companyName}, it will be limited to the amount paid for the products and/or services, and under no circumstances will there be consequential or punitive damages.</p>
      )
    },
    {
      id: "disclaimer-of-warranty",
      title: "10. Disclaimer Of Warranty",
      content: (
          <p className="font-semibold uppercase">The services and products are provided by {companyName} on an “as is” and “as available” basis. We make no representations or warranties of any kind, express or implied, as to the operation of our services, or the information, content or materials included. You expressly agree that your use of these services is at your sole risk.</p>
      )
    },
    {
      id: "governing-law",
      title: "11. Governing Law",
      content: (
          <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes will be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.</p>
      )
    },
    {
      id: "amendments-to-terms",
      title: "12. Amendments To Terms",
      content: (
          <p>We may amend these Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically. Your continued use of the Service following the posting of revised Terms means that you accept and agree to the changes.</p>
      )
    },
    {
      id: "acknowledgement",
      title: "13. Acknowledgement",
      content: (
          <p className="font-semibold uppercase">By using our service, you acknowledge that you have read these terms of service and agree to be bound by them.</p>
      )
    },
    {
      id: "contact-us-terms",
      title: "14. Contact Us",
      content: (
          <p>Please send your feedback, comments, or questions about these Terms by email to: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium">{contactEmail}</a>.</p>
      )
    }
  ];

  return (
    <div className="terms-page bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Terms of Service - {companyName}</title>
        <meta name="description" content={`Read the Terms of Service for using ${serviceName}, operated by ${companyName}.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-muted/40 py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Sticky Table of Contents */}
            <aside className={`lg:w-1/3 xl:w-1/4 lg:sticky ${tocStickyTopClass} self-start hidden lg:block max-h-[calc(100vh-${primaryHeaderHeight}-4rem)] overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-sm`}>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Table of Contents</h3>
              <nav>
                <ul className="space-y-2.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`} 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Terms Content */}
            <main className="lg:w-2/3 xl:w-3/4">
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
    </div>
  );
};

export default TermsAndConditionsPage;