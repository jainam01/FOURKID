// src/components/pages/ShippingPolicyPage.tsx

import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, MapPin, PackageSearch, Globe, AlertTriangle, Video } from "lucide-react";

const ShippingPolicyPage = () => {
  // --- UPDATE WITH YOUR SPECIFIC BUSINESS DETAILS ---
  const policyDetails = {
    companyName: "Fourkids",
    contactEmail: "arihant.8758586464@gmail.com",
    contactPhone: "+91 875858 6464",
    orderProcessingTime: "3-5 business days", // Time from final payment to dispatch
    deliveryTimeIndia: "4-10 business days", // Standard estimate for bulk cargo
    trackingLink: "/account/orders", // Link to user's order history page
    internationalShipping: true, // Set to true if you ship internationally
  };

  return (
    <div className="shipping-policy-page bg-background text-foreground">
      <Helmet>
        <title>Wholesale Shipping Policy - {policyDetails.companyName}</title>
        <meta name="description" content={`Learn about ${policyDetails.companyName}'s shipping policies for wholesale orders, including processing, delivery estimates, rates, and tracking.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Truck className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Wholesale Shipping Policy
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our process for getting your wholesale orders to you, reliably and efficiently.
          </p>
        </div>
      </section>

      {/* Main Policy Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p>At {policyDetails.companyName}, we are dedicated to ensuring a transparent and efficient shipping process for our retail partners. This policy outlines our procedures for order processing, shipping costs, and delivery for bulk wholesale orders.</p>
            </div>
            <Separator />

            {/* Order Processing Time */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-primary" /> Order Processing & Dispatch
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Wholesale orders are dispatched within <strong>{policyDetails.orderProcessingTime}</strong> after the final payment has been received and confirmed.</p>
                <p>Our process is as follows: Order Confirmation → Advance Payment → Procurement & Quality Check → Final Invoice (including shipping & GST) → Final Payment → Dispatch.</p>
                <p>Please note that orders are not processed or shipped on weekends or public holidays. During peak seasons, dispatch times may extend slightly, and we will communicate any significant delays.</p>
              </div>
            </div>
            <Separator />

            {/* Shipping within India */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-primary" /> Shipping within India
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-4">
                <p>We partner with trusted national carriers to deliver your orders across India. The estimated delivery timeline is typically <strong>{policyDetails.deliveryTimeIndia}</strong> from the date of dispatch.</p>
                <p>Delivery times are estimates and can vary based on your location, carrier delays, and unforeseen circumstances. We appreciate your patience with bulk consignments.</p>
              </div>
            </div>
            <Separator />

            {/* Shipping Rates & Costs */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <PackageSearch className="h-6 w-6 mr-3 text-primary" /> Shipping Rates & Costs
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>Shipping charges are not fixed and are calculated based on the final **volumetric weight** and dimensions of your packed order, as well as the delivery destination.</p>
                <p>The final shipping cost, along with applicable GST, will be included in your final invoice before dispatch. We strive to provide the most economical and reliable shipping rates available.</p>
                <p>Retailers who wish to arrange their own shipping or use their preferred transport service may contact us to coordinate a pickup from our warehouse.</p>
              </div>
            </div>
            <Separator />

            {/* Shipment Tracking */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <Truck className="h-6 w-6 mr-3 text-primary" /> Shipment Tracking
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>Once your order is dispatched, you will receive a shipment confirmation via Email or WhatsApp containing the tracking number (AWB) and carrier details. The tracking information typically becomes active within 24 hours.</p>
                <p>You can track your order through your account dashboard on our website or directly on the carrier's portal.</p>
              </div>
            </div>
            <Separator />
            
            {/* International Shipping */}
            {policyDetails.internationalShipping && (
              <div>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-primary" /> International Shipping
                </h2>
                <div className="prose max-w-none dark:prose-invert space-y-3">
                  <p>We offer international shipping for our wholesale partners. Costs are calculated based on the destination country, and the weight and volume of the shipment. We can provide quotes for both Air and Sea freight.</p>
                  <p><strong>Important:</strong> All customs duties, import taxes, brokerage fees, and any other charges levied by the destination country are the **sole responsibility of the recipient (the retailer)**. These charges are not included in our invoice.</p>
                </div>
              </div>
            )}
            <Separator />

            {/* Damaged or Lost Packages */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-destructive" /> Damaged, Lost, or Missing Items
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-3">
                <p>{policyDetails.companyName} is not liable for products that are damaged or lost by the carrier after they have left our facility. Liability is transferred to the shipping carrier upon dispatch.</p>
                <Alert variant="destructive" className="mt-4">
                  <Video className="h-4 w-4" />
                  <AlertTitle>Unboxing Video Required for Claims</AlertTitle>
                  <AlertDescription>
                    To file any claim for damaged goods or missing items, you **MUST** provide a clear, unedited, and continuous unboxing video of the sealed package. The video must clearly show the shipping label and the condition of the items as they are being opened. Claims without a valid unboxing video will not be entertained.
                  </AlertDescription>
                </Alert>
                <p>If you receive a damaged shipment, please contact the carrier to file a claim. Please also notify us at <a href={`mailto:${policyDetails.contactEmail}`} className="text-primary hover:underline">{policyDetails.contactEmail}</a>, and we will provide you with the necessary documentation to support your claim with the carrier.</p>
              </div>
            </div>
            <Separator />

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Questions About Shipping?</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>For any inquiries regarding our shipping procedures or your order's shipment, please contact us:</p>
                <ul>
                  <li><strong>Email:</strong> <a href={`mailto:${policyDetails.contactEmail}`} className="text-primary hover:underline">{policyDetails.contactEmail}</a></li>
                  <li><strong>Phone/WhatsApp:</strong> <a href={`tel:${policyDetails.contactPhone.replace(/\s|-/g, "")}`} className="text-primary hover:underline">{policyDetails.contactPhone}</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicyPage;