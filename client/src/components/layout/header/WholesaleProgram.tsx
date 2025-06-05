import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // For FAQs
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // For FAQs
import { 
  Truck, 
  Users, 
  BarChart, 
  ClipboardCheck, // Changed from ClipboardList
  Mail, 
  Phone,
  Sparkles // For Benefits
} from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const WholesaleProgram = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    console.log('Form submission started');

    // Get form data
    const formData = new FormData(event.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      businessEmail: formData.get('businessEmail'),
      companyName: formData.get('companyName'),
      gstNumber: formData.get('gstNumber'),
      productTypes: formData.get('productTypes'),
      catalogFile: formData.get('catalogFile')
    };

    console.log('Submitting data:', data);

    try {
      console.log('Sending request to:', 'http://localhost:3001/api/wholesale-application');
      const response = await fetch('http://localhost:3001/api/wholesale-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);

      toast({
        title: "Application submitted successfully",
        description: "We'll review your application and get back to you soon.",
      });

      // Reset form using the form reference
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { title: "Premium Quality Products", description: "Offer your customers high-quality, trendy kidswear that stands out.", icon: Sparkles },
    { title: "Competitive Wholesale Pricing", description: "Access attractive pricing structures designed to boost your profit margins.", icon: BarChart },
    { title: "Reliable Supply & Fast Shipping", description: "Count on consistent stock availability and efficient order fulfillment.", icon: Truck },
    { title: "Dedicated Partner Support", description: "Our team is committed to helping your wholesale business succeed with us.", icon: Users },
  ];

  const howItWorksSteps = [
    { step: 1, title: "Submit Your Application", description: "Fill out our online wholesale registration form with your business details." },
    { step: 2, title: "Verification Process", description: "Our team will review your application, GST, and Business PAN details." },
    { step: 3, title: "Account Activation", description: "Upon approval, your wholesale account will be activated, granting you access to our portal." },
    { step: 4, title: "Place Orders & Grow", description: "Browse our catalog, place your wholesale orders, and delight your customers!" },
  ];

  const eligibilityCriteria = [
    "Must be a registered business entity with a valid GSTIN.",
    "Primary business should be in retail, e-commerce, or distribution of apparel/children's products.",
    "Ability to meet minimum order quantities (MOQs) as specified.",
    "Commitment to FourKids brand values and quality standards.",
    "Agreement to our wholesale terms and conditions.",
  ];

  const faqs = [
    { q: "What are the minimum order requirements?", a: "Minimum order quantities (MOQs) vary by product category. Detailed MOQ information will be available in our wholesale portal upon account approval." },
    { q: "What payment methods are accepted for wholesale orders?", a: "We accept bank transfers, and major credit/debit cards. Specific payment terms will be outlined in your wholesale agreement." },
    { q: "How long does shipping take for wholesale orders?", a: "Standard shipping within India typically takes 5-7 business days. Expedited options may be available." },
    { q: "Do you offer exclusivity for certain regions or products?", a: "Regional or product exclusivity may be considered for established partners based on volume and commitment. Please discuss this with your account manager." },
  ];

  return (
    <div className="wholesale-program-page bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/80 to-primary py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Partner with FourKids Wholesale
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10">
            Elevate your retail business with our premium collection of kidswear. Join our network of successful wholesale partners today.
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" asChild>
            <a href="#registration-form">Apply for Wholesale Account</a>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Advantages of Partnering with Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <benefit.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Simple Steps to Get Started
          </h2>
          <div className="max-w-4xl mx-auto">
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((item) => (
                <li key={item.step} className="flex flex-col items-center text-center">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">Eligibility Criteria</CardTitle>
                <CardDescription className="mt-2">
                  Ensure your business meets these requirements to join our wholesale program.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-none space-y-4">
                  {eligibilityCriteria.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <ClipboardCheck className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">Wholesale Account Application</CardTitle>
                <CardDescription className="mt-2">
                  Complete the form below to apply. We'll get back to you soon!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input id="fullName" name="fullName" type="text" placeholder="Your Full Name" required />
                  </div>
                  <div>
                    <label htmlFor="businessEmail" className="block text-sm font-medium mb-1">Business Email</label>
                    <Input id="businessEmail" name="businessEmail" type="email" placeholder="you@company.com" required />
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                    <Input id="companyName" name="companyName" type="text" placeholder="Your Company Pvt. Ltd." required />
                  </div>
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium mb-1">GST Number</label>
                    <Input id="gstNumber" name="gstNumber" type="text" placeholder="Your GSTIN" required />
                  </div>
                  <div>
                    <label htmlFor="productTypes" className="block text-sm font-medium mb-1">Primary Product Categories You Deal In</label>
                    <Textarea id="productTypes" name="productTypes" placeholder="e.g., Frocks, T-shirts, Ethnic Wear, Newborn Sets" rows={3} required />
                  </div>
                  <div>
                    <label htmlFor="catalogFile" className="block text-sm font-medium mb-1">Company Website or Product Catalog Link (Optional)</label>
                    <Input id="catalogFile" name="catalogFile" type="url" placeholder="https://yourcompany.com/catalog" />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg text-left hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action / Contact Info Section */}
      <section className="bg-primary py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Have More Questions?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Our dedicated wholesale support team is ready to assist you. Reach out to us for any inquiries.
          </p>
          <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-center md:items-center md:space-x-6">
             <a 
                href="mailto:wholesale@fourkids.in" 
                className="inline-flex items-center justify-center gap-2 text-primary-foreground/90 hover:text-white transition-colors text-lg"
              >
                <Mail className="h-5 w-5" />
                wholesale@fourkids.in
            </a>
            <span className="hidden md:inline text-primary-foreground/50">|</span>
            <a 
                href="tel:+910000000000" // Replace with your actual phone number
                className="inline-flex items-center justify-center gap-2 text-primary-foreground/90 hover:text-white transition-colors text-lg"
              >
                <Phone className="h-5 w-5" />
                +91-XXXX-XXX-XXX 
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WholesaleProgram;