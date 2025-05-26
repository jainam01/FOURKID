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
  // Your specific details (replace placeholders)
  const companyName = "DesiQlo";
  const contactEmail = "hello@desi-closet.com";
  const refundProcessingTime = "18-25 working days"; // For unavailable products
  const generalRefundProcessingTime = "30 days"; // After approval
  const cancellationWindow = "24 hours";
  const balancePaymentWindow = "30 days";
  const returnWindow = "25 days";
  const refundClaimWindow = "15 days";
  const disputeResponseTime = "48 working hours";

  const refundClaimReasons = [
    "Quantity shortage",
    "Quantity issues",
    "Counterfeit goods",
    "Materials not as described",
    "Color not as described (excluding minor differences)",
    "Used items",
    "Brand problem or imitation not as described",
    "Missing item",
    "Missing parts",
    "Damaged goods",
    "Size mismatch",
    "Style mismatch",
    "Undelivered items",
    "Seized by Customs",
    "Package was empty",
  ];

  const returnClaimReasons = [
    "Missing item",
    "Missing parts",
    "Damaged goods",
    "Style mismatch",
  ];

  return (
    <div className="refund-policy-page bg-background text-foreground">
      <Helmet>
        <title>Refund & Return Policy - {companyName}</title>
        <meta name="description" content={`Understand ${companyName}'s policies on payments, cancellations, refunds, and returns for your orders.`} />
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
                <CreditCard className="h-6 w-6 mr-3 text-primary" /> Payment Terms & Order Adjustments
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Orders are considered confirmed once payment is successfully processed.</p>
                <p>Orders with a total value exceeding $50 USD are eligible for free shipping. Orders below $50 USD will incur a shipping charge of $14.90 USD.</p>
                <p>We ensure that all products in your order meet quality standards. {companyName} will calculate and share the final order value after removing any products that fail quality checks or are unavailable.</p>
                <p>If any products become unavailable post-confirmation, {companyName} will issue a refund for those items within <strong>{refundProcessingTime}</strong> from the date of order delivery.</p>
                <p>The {companyName} team can share the exact price quotation for products and delivery (Air, Sea, Road) charges. All other charges, i.e., customs duty and taxes, are determined by the destination country’s local tax authorities and therefore need to be paid by the customers at the time of delivery.</p>
              </div>
            </div>
            <Separator />

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <XCircle className="h-6 w-6 mr-3 text-primary" /> Cancellation Policy
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Cancellation is allowed within <strong>{cancellationWindow}</strong> of order confirmation. In such cases, the amount paid will be refunded.</p>
                <p>After {cancellationWindow} and up to the point of dispatch, orders cannot be canceled as products are typically already in production or dispatch stages with suppliers.</p>
                <p>The final balance payment (if any) must be completed within <strong>{balancePaymentWindow}</strong> of the request for the balance amount. If not paid within this period, the order will be considered cancelled, and any advance amount paid will not be refundable.</p>
              </div>
            </div>
            <Separator />

            {/* Refund Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RotateCcw className="h-6 w-6 mr-3 text-primary" /> Refund Policy
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Customers can claim a refund for the amount paid towards their order in the following situations:</p>
                <ul className="list-disc pl-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {refundClaimReasons.map(reason => <li key={reason}>{reason}</li>)}
                </ul>

                <h3 className="text-xl font-medium pt-4 !mb-2">How to Claim a Refund:</h3>
                <p>
                  To claim a refund, please send an email to <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>, clearly mentioning the reason for the refund claim along with supporting evidence (pictures and videos of the issue).
                </p>

                <h3 className="text-xl font-medium pt-4 !mb-2">Refund Status and Processing:</h3>
                <p>
                  All approved refunds will be credited to your original payment method or account within <strong>{generalRefundProcessingTime}</strong> of refund approval. You will receive communication regarding the refund status via email from our official ID: {contactEmail}.
                </p>
                <Alert variant="destructive" className="mt-4">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Important Note on Color Differences</AlertTitle>
                  <AlertDescription>
                    No refunds will be processed for minor color differences between the product images on our website/listings and the actual products delivered. Colors can vary due to different lighting conditions and screen display settings.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            <Separator />

            {/* Return Policy */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RotateCcw className="h-6 w-6 mr-3 text-primary" /> Return Policy
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Items purchased on {companyName}.com are eligible for return if you are not satisfied with them, with the following exceptions:</p>
                <ul className="list-disc pl-5">
                  <li>Clothing items that have been worn, washed, or damaged after delivery.</li>
                  {/* Add any other non-returnable item categories here */}
                </ul>
                <p>Customers can claim for the return of products purchased in their order in the following situations:</p>
                <ul className="list-disc pl-5">
                  {returnClaimReasons.map(reason => <li key={reason}>{reason}</li>)}
                </ul>
                <h3 className="text-xl font-medium pt-4 !mb-2">How to Initiate a Return:</h3>
                <p>
                  To initiate a return, please write to us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>, detailing the reason for the return and providing necessary evidence.
                </p>
                <p>
                  The return shipping cost must be borne by the customer.
                </p>
                <p>
                  If an item is eligible for return and subsequent refund, you may return it within the return window of <strong>{returnWindow}</strong> from the day the order was delivered to your address.
                </p>
              </div>
            </div>
            <Separator />
            
            {/* Dispute Resolution & General Claim Timeframe */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ShieldAlert className="h-6 w-6 mr-3 text-primary" /> Dispute Resolution & Claim Deadlines
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>
                  The {companyName} team responds to every dispute query (refund or return claim) within <strong>{disputeResponseTime}</strong>.
                </p>
                <p>
                  <strong>Important:</strong> All refund claims must be made within <strong>{refundClaimWindow}</strong> of order delivery. We do not accept any refund claims beyond this period.
                </p>
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
                  If you have any questions or require clarification regarding our Payment, Cancellation, Refund, or Return Policies, please do not hesitate to contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.
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