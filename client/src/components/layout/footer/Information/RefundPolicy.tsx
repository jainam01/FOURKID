// src/components/pages/RefundPolicyPage.tsx

import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  RotateCcw, // For Returns/Refunds
  XCircle, // For Cancellations
  CreditCard, // For Payment
  ShieldAlert, // For important notes/disputes
  HelpCircle, // For contact
  FileText // For Policy title
} from "lucide-react";

const RefundPolicyPage = () => {
  // --- UPDATE YOUR SPECIFIC BUSINESS TERMS HERE ---
  const companyName = "Fourkids";
  const contactEmail = "arihant.8758586464@gmail.com";
  const contactPhone = "+91 875858 6464";

  // Review and set your business-specific timeframes
  const cancellationWindow = "48 hours"; // eg., 24 or 48 hours
  const balancePaymentWindow = "7 days"; // Time to pay remaining amount after QC
  const returnClaimWindow = "7 days"; // Time to report defects after delivery
  const refundProcessingTime = "10-15 working days"; // After refund approval

  // Reasons a retailer can claim a refund for (usually for defects or errors)
  const refundClaimReasons = [
    "Significant quantity shortage in sealed package",
    "Major manufacturing defects (e.g., faulty stitching)",
    "Damaged goods upon arrival (with unboxing video)",
    "Incorrect style/assortment shipped",
    "Size mismatch from what was ordered",
    "Missing items from the order",
  ];

  // Most wholesale businesses have very strict return policies.
  // Often, returns are only for credit or replacement, not cash refunds.
  // This policy reflects returns for severe issues.
  const returnConditions = [
    "Items must be in their original, unused condition with all tags intact.",
    "Returns for unsold inventory or change of mind are not accepted.",
    "Items must be returned as a complete set if purchased as one.",
  ];

  return (
    <div className="refund-policy-page bg-background text-foreground">
       <Helmet>
        <title>Refund & Return Policy - {companyName}</title>
        <meta
          name="description"
          content={`Understand ${companyName}'s policies on payments, cancellations, refunds, and returns.`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Refund & Return Policy
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our commitment to a fair and transparent process for payments, cancellations, refunds, and returns.
          </p>
        </div>
      </section>

      {/* Main Policy Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-primary" /> Payment & Order Confirmation
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>All wholesale orders require an advance payment to begin processing. The order is considered confirmed only after this payment is successfully received.</p>
                <p>After procurement and final quality checks, our team will share the final invoice with you. This invoice will reflect the actual quantity of goods ready for dispatch, adjusted for any items that did not meet our quality standards or were unavailable.</p>
                <p>The final balance payment must be completed within <strong>{balancePaymentWindow}</strong> of receiving the final invoice. Dispatch will only occur after the full payment is cleared.</p>
                <p>All prices are exclusive of GST and shipping charges. These will be calculated and included in the final invoice.</p>
              </div>
            </div>
            <Separator />

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <XCircle className="h-6 w-6 mr-3 text-primary" /> Order Cancellation
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Order cancellation is permitted within <strong>{cancellationWindow}</strong> of placing the order and paying the advance. In this case, the advance amount will be refunded after deducting any processing fees.</p>
                <p>After the {cancellationWindow} window, orders cannot be canceled as they enter the production and procurement phase.</p>
                <p>If the final balance payment is not completed within the {balancePaymentWindow} window, the order will be automatically cancelled and the advance amount paid will be forfeited to cover procurement and holding costs.</p>
              </div>
            </div>
            <Separator />

            {/* Refund & Return Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RotateCcw className="h-6 w-6 mr-3 text-primary" /> Refund & Return Policy
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>We stand by the quality of our products. Claims for returns or refunds are accepted only for the following reasons, which must be reported within <strong>{returnClaimWindow}</strong> of receiving your shipment:</p>
                <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {refundClaimReasons.map(reason => <li key={reason}>{reason}</li>)}
                </ul>

                <h3 className="text-xl font-medium pt-4 !mb-2">How to File a Claim:</h3>
                <p>
                  To file a claim, you MUST provide a clear, unedited, and continuous unboxing video of the sealed package, showing the shipping label clearly. The video must clearly show the issue you are reporting.
                </p>
                <p>
                  Please email your claim with the unboxing video and detailed description to <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>. Claims without a valid unboxing video will not be entertained.
                </p>

                <h3 className="text-xl font-medium pt-4 !mb-2">Return Conditions:</h3>
                <ul className="list-disc pl-5">
                  {returnConditions.map(reason => <li key={reason}>{reason}</li>)}
                </ul>

                <h3 className="text-xl font-medium pt-4 !mb-2">Resolution Process:</h3>
                <p>
                  Upon verification of your claim, our team will offer a resolution, which may be a replacement of the defective item(s) in your next order, a store credit, or a partial/full refund to your original payment method. The resolution will be at the sole discretion of {companyName}.
                </p>
                <p>
                  Approved refunds will be processed within <strong>{refundProcessingTime}</strong>. The return shipping cost for approved claims will be coordinated by our team.
                </p>

                <Alert variant="destructive" className="mt-4">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Important Note on Product Variations</AlertTitle>
                  <AlertDescription>
                    As a wholesale business, minor variations in color, print, or texture are a normal part of the manufacturing process. Claims will not be accepted for such minor differences.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            <Separator />
            
            {/* Contact for Policy Inquiries */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <HelpCircle className="h-6 w-6 mr-3 text-primary" /> Questions About Our Policies?
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  We believe in building strong partnerships with our retailers. If you have any questions regarding our wholesale policies, please do not hesitate to contact us.
                </p>
                <p>
                  <strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>
                  <br/>
                  <strong>Phone/WhatsApp:</strong> <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="text-primary hover:underline">{contactPhone}</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicyPage;