// src/components/pages/PrivacyPolicyPage.tsx

import { Helmet } from "react-helmet-async";
import { ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react"; // Icons

const PrivacyPolicyPage = () => {
  const effectiveDate = "2023-05-01";
  const companyName = "Tradyl Private Limited";
  const serviceName = "desiqlo.com";
  const contactEmail = "hello@desi-closet.com";
  const contactPhone = "+919663710017"; // Ensure correct formatting if used in tel: link

  // Configuration for sticky elements (if you have a sticky header)
  // Adjust these values based on your primary header's height
  const primaryHeaderHeight = "5rem"; // Example: "4rem", "64px"
  const sectionScrollMarginTopClass = `scroll-mt-[calc(${primaryHeaderHeight}+1rem)]`;

  // Structure your policy into sections for easier mapping and potential navigation
  // This helps in breaking down the dense text.
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <>
          <p>Welcome to {serviceName}!</p>
          <p>{companyName} (“us”, “we”, or “our”) operates the website <a href={`https://${serviceName}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">{serviceName} <ExternalLink className="h-3 w-3 ml-1" /></a> (the "Service").</p>
          <p>Our Privacy Policy governs your visit to {serviceName}, and explains how we collect, safeguard and disclose information that results from your use of our Service.</p>
          <p>As a cross-border e-commerce entity, we understand the importance of privacy and are committed to protecting the personal information of our users. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information.</p>
        </>
      ),
    },
    {
      id: "collection-of-personal-information",
      title: "Collection of Personal Information",
      content: (
        <>
          <p>We collect personal information from you when you register for an account, make a purchase, or communicate with us through our website or other channels. This may include your name, email address, shipping and billing address, phone number, and payment information.</p>
          <p>Personally identifiable information may include, but is not limited to:</p>
          <ol className="list-[lower-alpha] pl-6 space-y-1">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, Country, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ol>
        </>
      ),
    },
    {
      id: "use-of-personal-information",
      title: "Use of Personal Information",
      content: (
        <p>We use your personal information to provide you with our services, process your orders, communicate with you about your orders, and respond to your inquiries. We may also use your personal information to send you marketing communications about our products and services, unless you opt out of receiving such communications (you can opt-out by following the unsubscribe link in our emails or by contacting us).</p>
      ),
    },
    {
      id: "disclosure-of-personal-information",
      title: "Disclosure of Personal Information",
      content: (
        <p>We may disclose your personal information to third-party service providers that assist us in providing our services, such as payment processors, shipping companies, and marketing agencies. We may also disclose your personal information if required by law or to protect our legal rights.</p>
      ),
    },
    {
      id: "protection-of-personal-information",
      title: "Protection of Personal Information",
      content: (
        <p>We take reasonable measures to protect your personal information from unauthorized access, disclosure, or destruction. We use secure servers and encryption technology to protect your personal information during transmission. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
      ),
    },
    {
      id: "transfer-of-data",
      title: "Transfer of Data",
      content: (
        <>
            <p>Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
            <p>If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there.</p>
            <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
            <p>{companyName} will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>
        </>
      ),
    },
    {
      id: "security-of-data",
      title: "Security of Data",
      content: (
        <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p>You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications from us at any time. To exercise these rights, please contact us using the contact information provided below.</p>
          <p>According to CalOPPA (California Online Privacy Protection Act) we agree to the following:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users can visit our site anonymously.</li>
            <li>Our Privacy Policy link includes the word “Privacy” and can easily be found on the homepage of our website.</li>
            <li>Users will be notified of any privacy policy changes on our Privacy Policy Page.</li>
            <li>Users are able to change their personal information by emailing us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.</li>
          </ul>
          <h3 className="!mt-4 !mb-2 text-lg font-semibold">Our Policy on “Do Not Track” Signals:</h3>
          <p>We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser mechanism is in place. Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked.</p>
          <p>You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.</p>
        </>
      ),
    },
    {
      id: "ccpa-rights",
      title: "Your Data Protection Rights under the California Consumer Privacy Act (CCPA)",
      content: (
        <>
          <p>If you are a California resident, you are entitled to learn what data we collect about you, ask to delete your data and not to sell (share) it. To exercise your data protection rights, you can make certain requests and ask us:</p>
          <ol className="list-[lower-alpha] pl-6 space-y-3">
            <li>
              What personal information we have about you. If you make this request, we will return to you:
              <ol className="list-[lower-roman] pl-6 mt-1 space-y-1">
                <li>The categories of personal information we have collected about you.</li>
                <li>The categories of sources from which we collect your personal information.</li>
                <li>The business or commercial purpose for collecting or selling your personal information.</li>
                <li>The categories of third parties with whom we share personal information.</li>
                <li>The specific pieces of personal information we have collected about you.</li>
                <li>A list of categories of personal information that we have sold, along with the category of any other company we sold it to. If we have not sold your personal information, we will inform you of that fact.</li>
                <li>A list of categories of personal information that we have disclosed for a business purpose, along with the category of any other company we shared it with.</li>
              </ol>
              <p className="mt-1 text-sm">Please note, you are entitled to ask us to provide you with this information up to two times in a rolling twelve-month period. When you make this request, the information provided may be limited to the personal information we collected about you in the previous 12 months.</p>
            </li>
            <li>To delete your personal information. If you make this request, we will delete the personal information we hold about you as of the date of your request from our records and direct any service providers to do the same. In some cases, deletion may be accomplished through de-identification of the information. If you choose to delete your personal information, you may not be able to use certain functions that require your personal information to operate.</li>
            <li>To stop selling your personal information. We don’t sell or rent your personal information to any third parties for any purpose. We do not sell your personal information for monetary consideration. However, under some circumstances, a transfer of personal information to a third party, or within our family of companies, without monetary consideration may be considered a “sale” under California law. You are the only owner of your Personal Data and can request disclosure or deletion at any time.
            <p className="mt-1">If you submit a request to stop selling your personal information, we will stop making such transfers.</p>
            </li>
          </ol>
          <p className="mt-3">Please note, if you ask us to delete or stop selling your data, it may impact your experience with us, and you may not be able to participate in certain programs or membership services which require the usage of your personal information to function. But in no circumstances, we will discriminate against you for exercising your rights.</p>
          <p className="mt-3">To exercise your California data protection rights described above, please send your request(s) by email: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.</p>
          <p className="mt-3 text-sm">Your data protection rights, described above, are covered by the CCPA, short for the California Consumer Privacy Act. To find out more, visit the official <a href="https://leginfo.legislature.ca.gov/faces/home.xhtml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">California Legislative Information website</a>. The CCPA took effect on 01/01/2020.</p>
        </>
      ),
    },
    {
        id: "service-providers",
        title: "Service Providers",
        content: (
            <>
            <p>We may employ third party companies and individuals to facilitate our Service (“Service Providers”), provide Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used.</p>
            <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
            </>
        )
    },
    {
        id: "analytics-privacy", // Differentiated from T&C analytics ID
        title: "Analytics",
        content: <p>We may use third-party Service Providers to monitor and analyze the use of our Service.</p>
    },
    {
        id: "ci-cd-tools",
        title: "CI/CD tools",
        content: <p>We may use third-party Service Providers to automate the development process of our Service.</p>
    },
    {
        id: "behavioral-remarketing",
        title: "Behavioral Remarketing",
        content: <p>We may use remarketing services to advertise on third party websites to you after you visited our Service. We and our third-party vendors use cookies to inform, optimize and serve ads based on your past visits to our Service.</p>
    },
    {
        id: "payments-privacy", // Differentiated
        title: "Payments",
        content: (
            <>
            <p>We may provide paid products and/or services within Service. In that case, we use third-party services for payment processing (e.g. payment processors).</p>
            <p>We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.</p>
            </>
        )
    },
    {
        id: "links-to-other-sites-privacy", // Differentiated
        title: "Links to Other Sites",
        content: (
            <>
            <p>Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
            <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
            <p className="text-sm mt-2">For example, the outlined privacy policy has been made using PolicyMaker.io, a free tool that helps create high-quality legal documents. PolicyMaker’s privacy policy generator is an easy-to-use tool for creating a privacy policy for blog, website, e-commerce store or mobile app.</p>
            </>
        )
    },
    {
        id: "childrens-privacy",
        title: "Children’s Privacy",
        content: (
            <>
            <p>Our Services are not intended for use by children under the age of 18 (“Child” or “Children”).</p>
            <p>We do not knowingly collect personally identifiable information from Children under 18. If you become aware that a Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers.</p>
            </>
        )
    },
    {
        id: "changes-to-this-privacy-policy",
        title: "Changes to This Privacy Policy",
        content: (
            <>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            <p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update “effective date” at the top of this Privacy Policy.</p>
            <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            {/* The original text had a duplicate "Changes to this Privacy Policy" section, I've merged them. */}
            </>
        )
    },
     {
      id: "use-of-information-app", // Specific section from later part of your text
      title: "Use of Information (App Specific)",
      content: (
        <>
          <p>We may use the information we collect from you (potentially through a mobile application if applicable) for various purposes, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Providing and improving the App:</strong> We may use your information to operate and maintain the App, to personalize your experience, and to improve the App's functionality and performance.</li>
            <li><strong>Processing orders and payments:</strong> We may use your information to process your orders and payments, to communicate with you about your orders, and to provide you with customer support.</li>
            <li><strong>Marketing and advertising:</strong> We may use your information to send you promotional materials about our products and services or those of our partners, subject to your consent where required by law.</li>
            <li><strong>Analytics and research:</strong> We may use your information to analyze usage trends, to conduct research and surveys, and to develop new products and services.</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing-of-information-app", // Specific section
      title: "Sharing of Information (App Specific)",
      content: (
        <>
          <p>We may share your information with third parties in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Service providers:</strong> We may share your information with third-party service providers who perform functions on our behalf, such as payment processing, and order fulfillment.</li>
            <li><strong>Business partners:</strong> We may share your information with our business partners for marketing and advertising purposes, subject to your consent where required by law.</li>
            <li><strong>Legal requirements:</strong> We may disclose your information in response to a subpoena, court order, or other legal process, or as otherwise required by law.</li>
            <li><strong>Business transfers:</strong> We may transfer your information to a third party in the event of a merger, acquisition, or other business transaction.</li>
          </ul>
        </>
      ),
    },
    {
      id: "security-of-information-app", // Specific section
      title: "Security of Information (App Specific)",
      content: (
        <p>We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no data transmission over the internet or storage system can be guaranteed to be 100% secure. Therefore, we cannot guarantee the security of your information.</p>
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

  // Filter out sections that might be specific to an "App" if not relevant for a general website policy
  // For this example, I'm including them but you might want to conditionally render them.
  const relevantSections = sections; 

  return (
    <div className="privacy-policy-page bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Privacy Policy - {companyName}</title>
        <meta name="description" content={`Our Privacy Policy for ${serviceName} explains how ${companyName} collects, safeguards, and discloses your information.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-muted/40 py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective date: {new Date(effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Main Content - Using a two-column layout for larger screens: TOC and Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Sticky Table of Contents (for larger screens) */}
            <aside className={`lg:w-1/3 xl:w-1/4 lg:sticky ${sectionScrollMarginTopClass.replace("scroll-mt", "top")} self-start hidden lg:block max-h-[calc(100vh-${primaryHeaderHeight}-4rem)] overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-sm`}>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Policy Sections</h3>
              <nav>
                <ul className="space-y-2.5">
                  {relevantSections.map((section) => (
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

            {/* Policy Content */}
            <main className="lg:w-2/3 xl:w-3/4">
              <div className="prose prose-slate dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none space-y-12">
                {relevantSections.map((section) => (
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

       {/* Final Contact CTA (Optional) */}
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
                    href={`tel:${contactPhone.replace(/\D/g, '')}`} // Remove non-digits for tel link
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