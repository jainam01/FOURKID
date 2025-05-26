// src/components/pages/ShippingPolicyPage.tsx

import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button"; // If you need a CTA button
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For important notices
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, MapPin, PackageSearch, Globe, AlertTriangle } from "lucide-react";

const ShippingPolicyPage = () => {
  // Replace with your specific details
  const policyDetails = {
    processingTime: "1-2 business days",
    standardShippingTimeIndia: "3-7 business days",
    expressShippingTimeIndia: "1-3 business days (select metro cities)",
    freeShippingThresholdIndia: 5000, // Example: Free shipping on orders over ₹5000
    standardShippingRate: 100, // Example: Flat rate for standard shipping
    trackingLink: "/orders", // Link to user's order history page
    contactEmail: "shipping@fourkids.in",
    contactPhone: "+91-XXXX-XXX-XXX"
  };

  return (
    <div className="shipping-policy-page bg-background text-foreground">
      <Helmet>
        <title>Shipping Policy - FourKids</title>
        <meta name="description" content="Learn about FourKids' shipping policies, including processing times, delivery estimates, shipping rates, and tracking information for wholesale orders." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Truck className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Shipping Policy
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding how we get your FourKids orders to you, quickly and reliably.
          </p>
        </div>
      </section>

      {/* Main Policy Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">

            {/* Introduction */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p>
                At FourKids, we are committed to delivering your wholesale orders efficiently and transparently. This policy outlines our shipping procedures, delivery timelines, costs, and other related information to ensure a smooth experience for our valued partners.
              </p>
            </div>
            <Separator />

            {/* Order Processing Time */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-primary" /> Order Processing Time
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  All wholesale orders are processed within <strong>{policyDetails.processingTime}</strong> after receiving order confirmation and payment realization. Orders are not typically processed or shipped on weekends or public holidays.
                </p>
                <p>
                  During peak seasons or promotional periods, processing times may be slightly longer. We will notify you if there are significant delays in processing your order.
                </p>
              </div>
            </div>
            <Separator />

            {/* Shipping Methods & Delivery Times (India) */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-primary" /> Shipping within India
              </h2>
              <div className="prose max-w-none dark:prose-invert space-y-4">
                <p>We offer the following shipping options for deliveries within India:</p>
                <ul>
                  <li>
                    <strong>Standard Shipping:</strong> Estimated delivery within <strong>{policyDetails.standardShippingTimeIndia}</strong>.
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> Estimated delivery within <strong>{policyDetails.expressShippingTimeIndia}</strong> (available for select PIN codes, additional charges apply).
                  </li>
                </ul>
                <p>
                  Delivery times are estimates and commence from the date of shipping, rather than the date of order. Actual delivery times may vary due to carrier shipping practices, delivery location, method of delivery, and the items ordered.
                </p>
              </div>
            </div>
            <Separator />

            {/* Shipping Rates & Costs */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <PackageSearch className="h-6 w-6 mr-3 text-primary" /> Shipping Rates & Costs
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  Shipping charges for your order will be calculated and displayed at checkout.
                </p>
                <p>
                  We offer <strong>free standard shipping</strong> on all orders within India exceeding a total value of <strong>₹{policyDetails.freeShippingThresholdIndia.toLocaleString('en-IN')}</strong>.
                </p>
                <p>
                  For orders below this threshold, a standard shipping fee of ₹{policyDetails.standardShippingRate} may apply. Express shipping rates are calculated based on order weight and destination.
                </p>
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Note on Heavy/Bulky Items</AlertTitle>
                  <AlertDescription>
                    Additional shipping charges may apply for exceptionally large or heavy orders. We will contact you to confirm any additional charges before processing such orders.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            <Separator />

            {/* Shipment Tracking */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <Truck className="h-6 w-6 mr-3 text-primary" /> Shipment Tracking
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  Once your order has shipped, you will receive a shipment confirmation email containing your tracking number(s). The tracking number will be active within 24 hours.
                </p>
                <p>
                  You can track your order status through your account dashboard on our website at <a href={policyDetails.trackingLink} className="text-primary hover:underline">My Orders</a> or directly on the carrier's website.
                </p>
              </div>
            </div>
            <Separator />
            
            {/* International Shipping (Conditional) */}
            {true && ( // Set this to true if you offer international shipping
              <div>
                <h2 className="text-2xl font-semibold mb-3 flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-primary" /> International Shipping
                </h2>
                <div className="prose max-w-none dark:prose-invert">
                  <p>
                    Yes, we ship to select international destinations. International shipping costs are calculated based on the destination, weight, and dimensions of your order.
                  </p>
                  <p>
                    <strong>Customs, Duties, and Taxes:</strong> All international orders may be subject to import duties, taxes, and brokerage fees levied by the destination country. These charges are the responsibility of the recipient. FourKids is not responsible for these charges, and they are not included in the item price or shipping cost. Please check with your country's customs office to determine what these additional costs will be prior to placing your order.
                  </p>
                  <p>
                    International delivery times vary significantly by destination.
                  </p>
                </div>
              </div>
            )}
            <Separator />

            {/* Damaged or Lost Packages */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-destructive" /> Damaged or Lost Packages
              </h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  FourKids is not liable for any products damaged or lost during shipping once they have been handed over to the carrier. If you received your order damaged, please contact the shipment carrier directly to file a claim.
                </p>
                <p>
                  Please save all packaging materials and damaged goods before filing a claim. We recommend taking photographs of the damaged package and items as evidence.
                </p>
                <p>
                  While we are not directly responsible for carrier-related issues, please also inform us at <a href={`mailto:${policyDetails.contactEmail}`} className="text-primary hover:underline">{policyDetails.contactEmail}</a>, and we will do our best to assist you in the claim process.
                </p>
              </div>
            </div>
            <Separator />

            {/* Policy Updates */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Policy Updates</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  FourKids reserves the right to update this Shipping Policy at any time. Any changes will be effective immediately upon posting the revised policy on our website. We encourage you to periodically review this page for the latest information on our shipping practices.
                </p>
              </div>
            </div>
            <Separator />

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">Questions About Shipping?</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  If you have any questions or concerns regarding our Shipping Policy or your order's shipment, please contact us:
                </p>
                <ul>
                  <li><strong>Email:</strong> <a href={`mailto:${policyDetails.contactEmail}`} className="text-primary hover:underline">{policyDetails.contactEmail}</a></li>
                  <li><strong>Phone:</strong> <a href={`tel:${policyDetails.contactPhone.replace(/\s|-/g, "")}`} className="text-primary hover:underline">{policyDetails.contactPhone}</a></li>
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