// src/components/pages/TermsAndConditionsPage.tsx

import { Helmet } from "react-helmet-async";
import { FileText, Mail, ExternalLink } from "lucide-react"; // Added ExternalLink

const TermsAndConditionsPage = () => {
  const lastUpdated = "2021-01-10";
  const companyName = "Tradyl Private Limited";
  const serviceName = "desiqlo.com";
  const contactEmail = "hello@desi-closet.com";

  // Configuration for sticky elements based on assumed primary header height
  const primaryHeaderHeight = "5rem"; // e.g., for a h-20 header. Adjust this! (4rem for h-16, etc.)
  const tocStickyTopClass = `lg:top-[calc(${primaryHeaderHeight}+1rem)]`; // Sticks below header + 1rem gap
  const sectionScrollMarginTopClass = `scroll-mt-[calc(${primaryHeaderHeight}+1rem)]`; // Anchor scrolls to below header + 1rem gap

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <>
          <p>Welcome to {companyName} (“Company”, “we”, “our”, “us”)!</p>
          <p>These Terms of Service (“Terms”, “Terms of Service”) govern your use of our website located at <a href={`https://${serviceName}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">{serviceName} <ExternalLink className="h-3 w-3 ml-1" /></a> (together or individually “Service”) operated by {companyName}.</p>
          <p>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. You can review our Privacy Policy <a href="/privacy-policy" className="text-primary hover:underline">here</a>.</p>
          <p>Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound of them.</p>
          <p>If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a> so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.</p>
        </>
      ),
    },
    {
      id: "communications",
      title: "2. Communications",
      content: (
        <p>By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link provided in those emails or by emailing us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.</p>
      ),
    },
    {
        id: "purchases",
        title: "3. Purchases",
        content: (
            <>
                <p>If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.</p>
                <p>You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</p>
                <p>We may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.</p>
                <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.</p>
                <p>We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.</p>
            </>
        )
    },
    {
        id: "promotions",
        title: "4. Contests, Sweepstakes and Promotions",
        content: (
            <p>Any contests, sweepstakes or other promotions (collectively, “Promotions”) made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.</p>
        )
    },
    {
        id: "refunds",
        title: "5. Refunds",
        content: (
            <p>We issue refunds for contracts on a case-by-case basis and in consultation with all the service partners involved. {companyName.replace(" Private Limited","")} reserves the right to take the final decision on refunds in case of dispute. Please refer to our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a> for more detailed information.</p>
        )
    },
    {
        id: "content",
        title: "6. Content",
        content: (
            <>
                <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (“Content”). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.</p>
                <p>By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.</p>
                <p>You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.</p>
                <p>{companyName} has the right but not the obligation to monitor and edit all Content provided by users.</p>
                <p>In addition, Content found on or through this Service are the property of {companyName} or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</p>
            </>
        )
    },
    {
        id: "prohibited-uses",
        title: "7. Prohibited Uses",
        content: (
            <>
                <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
                <ol className="list-[lower-alpha] pl-6 space-y-2">
                    <li>In any way that violates any applicable national or international law or regulation.</li>
                    <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.</li>
                    <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                    <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
                </ol>
                <p className="mt-4">Additionally, you agree not to:</p>
                <ol className="list-[lower-alpha] pl-6 space-y-2">
                    <li>Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service.</li>
                    <li>Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.</li>
                    <li>Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.</li>
                    <li>Use any device, software, or routine that interferes with the proper working of Service.</li>
                    <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
                    <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.</li>
                    <li>Attack Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
                    <li>Take any action that may damage or falsify Company rating.</li>
                    <li>Otherwise attempt to interfere with the proper working of Service.</li>
                </ol>
            </>
        )
    },
    { 
      id: "analytics", 
      title: "8. Analytics", 
      content: <p>We may use third-party Service Providers to monitor and analyze the use of our Service. These providers may collect data as described in our Privacy Policy.</p> 
    },
    { 
      id: "no-use-by-minors", 
      title: "9. No Use By Minors", 
      content: <p>Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using Service, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service.</p> 
    },
    {
        id: "accounts",
        title: "10. Accounts",
        content: (
            <>
                <p>When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.</p>
                <p>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                <p>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.</p>
                <p>We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</p>
            </>
        )
    },
    {
        id: "intellectual-property",
        title: "11. Intellectual Property",
        content: (
            <p>Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of {companyName} and its licensors. Service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of {companyName}.</p>
        )
    },
    {
        id: "copyright-policy",
        title: "12. Copyright Policy",
        content: (
            <>
                <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.</p>
                <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>, with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “DMCA Notice and Procedure for Copyright Infringement Claims”.</p>
                <p>You may be held accountable for damages (including costs and attorneys’ fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.</p>
            </>
        )
    },
    {
        id: "dmca-notice",
        title: "13. DMCA Notice and Procedure for Copyright Infringement Claims",
        content: (
            <>
                <p>You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):</p>
                <ol className="list-[lower-alpha] pl-6 space-y-2">
                    <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright’s interest.</li>
                    <li>A description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.</li>
                    <li>Identification of the URL or other specific location on Service where the material that you claim is infringing is located.</li>
                    <li>Your address, telephone number, and email address.</li>
                    <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                    <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.</li>
                </ol>
                <p className="mt-4">You can contact our Copyright Agent via email at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.</p>
            </>
        )
    },
    {
        id: "error-reporting",
        title: "14. Error Reporting and Feedback",
        content: (
            <p>You may provide us either directly at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a> or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service (“Feedback”). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.</p>
        )
    },
    {
        id: "links-to-other-websites",
        title: "15. Links To Other Web Sites",
        content: (
            <>
                <p>Our Service may contain links to third party web sites or services that are not owned or controlled by {companyName}.</p>
                <p>{companyName} has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.</p>
                <p className="font-semibold uppercase mt-2">You acknowledge and agree that Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such third party web sites or services.</p>
                <p className="font-semibold mt-2">We strongly advise you to read the terms of service and privacy policies of any third party web sites or services that you visit.</p>
            </>
        )
    },
    {
        id: "disclaimer-of-warranty",
        title: "16. Disclaimer Of Warranty",
        content: (
            <>
                <p className="font-semibold uppercase">These services are provided by Company on an “as is” and “as available” basis. Company makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.</p>
                <p className="font-semibold uppercase">Neither Company nor any person associated with Company makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the services. Without limiting the foregoing, neither Company nor anyone associated with Company represents or warrants that the services, their content, or any services or items obtained through the services will be accurate, reliable, error-free, or uninterrupted, that defects will be corrected, that the services or the server that makes it available are free of viruses or other harmful components or that the services or any services or items obtained through the services will otherwise meet your needs or expectations.</p>
                <p className="font-semibold uppercase">Company hereby disclaims all warranties of any kind, whether express or implied, statutory, or otherwise, including but not limited to any warranties of merchantability, non-infringement, and fitness for particular purpose.</p>
                <p className="font-semibold uppercase">The foregoing does not affect any warranties which cannot be excluded or limited under applicable law.</p>
            </>
        )
    },
    {
        id: "limitation-of-liability",
        title: "17. Limitation Of Liability",
        content: (
            <p className="font-semibold uppercase">Except as prohibited by law, you will hold us and our officers, directors, employees, and agents harmless for any indirect, punitive, special, incidental, or consequential damage, however it arises (including attorneys’ fees and all related costs and expenses of litigation and arbitration, or at trial or on appeal, if any, whether or not litigation or arbitration is instituted), whether in an action of contract, negligence, or other tortious action, or arising out of or in connection with this agreement, including without limitation any claim for personal injury or property damage, arising from this agreement and any violation by you of any federal, state, or local laws, statutes, rules, or regulations, even if Company has been previously advised of the possibility of such damage. Except as prohibited by law, if there is liability found on the part of Company, it will be limited to the amount paid for the products and/or services, and under no circumstances will there be consequential or punitive damages. Some states do not allow the exclusion or limitation of punitive, incidental or consequential damages, so the prior limitation or exclusion may not apply to you.</p>
        )
    },
    {
        id: "termination",
        title: "18. Termination",
        content: (
            <>
                <p>We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.</p>
                <p>If you wish to terminate your account, you may simply discontinue using Service.</p>
                <p>All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>
            </>
        )
    },
    {
        id: "governing-law",
        title: "19. Governing Law",
        content: (
            <>
                <p>These Terms shall be governed and construed in accordance with the laws of India, which governing law applies to agreement without regard to its conflict of law provisions.</p>
                <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.</p>
            </>
        )
    },
    {
        id: "changes-to-service",
        title: "20. Changes To Service",
        content: (
            <p>We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.</p>
        )
    },
    {
        id: "amendments-to-terms",
        title: "21. Amendments To Terms",
        content: (
            <>
                <p>We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.</p>
                <p>Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.</p>
                <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Service.</p>
            </>
        )
    },
    {
        id: "waiver-and-severability",
        title: "22. Waiver And Severability",
        content: (
            <>
                <p>No waiver by Company of any term or condition set forth in Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under Terms shall not constitute a waiver of such right or provision.</p>
                <p>If any provision of Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of Terms will continue in full force and effect.</p>
            </>
        )
    },
    {
        id: "acknowledgement",
        title: "23. Acknowledgement",
        content: (
            <p className="font-semibold uppercase">By using Service or other services provided by us, you acknowledge that you have read these Terms of Service and agree to be bound by them.</p>
        )
    },
    {
        id: "contact-us-terms",
        title: "24. Contact Us",
        content: (
            <p>Please send your feedback, comments, requests for technical support by email: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium">{contactEmail}</a>.</p>
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

      {/* Final Contact CTA */}
      <section className="py-16 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-5" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold text-foreground mb-4">Questions or Concerns About These Terms?</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                We are here to help clarify any part of our Terms of Service. Please don't hesitate to reach out.
            </p>
            <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
                Contact Us: {contactEmail}
            </a>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;