// src/components/pages/FAQPage.tsx
// (Or wherever you place your page components)

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define your FAQ data
// In a real app, this might come from a CMS or a JSON file
const faqData = [
  {
    category: "General", // Optional: for future categorization
    question: "What is FourKids Wholesale?",
    answer: "FourKids Wholesale is the B2B platform for FourKids, offering our unique and high-quality children's apparel to retailers and businesses at wholesale prices. We aim to partner with businesses to bring stylish and comfortable kidswear to a wider audience."
  },
  {
    category: "Account & Registration",
    question: "How do I register for a wholesale account?",
    answer: "You can register for a wholesale account by visiting our 'Wholesale Program' page and filling out the application form. Our team will review your application and get in touch with you regarding the next steps."
  },
  {
    category: "Account & Registration",
    question: "What documents are required for wholesale registration?",
    answer: "Typically, we require your business registration details, GSTIN (for Indian businesses), and a Business PAN card. Specific requirements will be detailed during the application process."
  },
  {
    category: "Ordering & Products",
    question: "What is the minimum order quantity (MOQ)?",
    answer: "MOQs vary depending on the product and category. Once your wholesale account is approved, you will have access to our full catalog with detailed information on MOQs for each item."
  },
  {
    category: "Ordering & Products",
    question: "Can I get samples before placing a bulk order?",
    answer: "We understand the need for quality assessment. Please discuss sample requests with your account manager after your wholesale account is activated. Policies for samples may vary."
  },
  {
    category: "Ordering & Products",
    question: "What types of products do you offer for wholesale?",
    answer: "We offer a wide range of children's apparel, including everyday wear, festive outfits, seasonal collections, and accessories for ages 0-14 years. Our catalog is regularly updated with new designs."
  },
  {
    category: "Shipping & Delivery",
    question: "How long does wholesale order shipping take?",
    answer: "Standard shipping within India typically takes 5-7 business days after order processing. Processing times for bulk orders may vary. We also offer expedited shipping options upon request."
  },
  {
    category: "Shipping & Delivery",
    question: "Do you ship internationally?",
    answer: "Yes, we do offer international shipping for wholesale orders. Shipping costs and delivery times will vary based on the destination and order size. Please contact our wholesale team for a quote."
  },
  {
    category: "Payments & Returns",
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods for wholesale orders, including bank transfers (NEFT/RTGS/IMPS), and major credit/debit cards. Specific payment terms will be outlined in your wholesale agreement."
  },
  {
    category: "Payments & Returns",
    question: "What is your return policy for wholesale orders?",
    answer: "Our return policy for wholesale orders covers defective or damaged goods upon arrival. Please inspect your shipment carefully and report any issues within 48 hours of delivery. For detailed information, refer to our wholesale terms and conditions or contact your account manager."
  }
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-page bg-background text-foreground">
      <Helmet>
        <title>{`Frequently Asked Questions - FourKids`}</title>
        <meta name="description" content="Find answers to common questions about the FourKids wholesale program, ordering, shipping, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We've got answers! If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 h-12 text-base border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Accordion for FAQs */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem 
                    value={`item-${index + 1}`} 
                    key={index} 
                    className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card"
                  >
                    <AccordionTrigger className="text-md md:text-lg text-left hover:no-underline px-6 py-4 font-medium text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground px-6 pb-6 pt-0 text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No questions match your search.</p>
                <p className="text-sm text-muted-foreground mt-2">Try a different keyword or browse all questions by clearing the search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

       {/* Still need help? CTA Section */}
       <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our support team is happy to assist you with any further questions you may have.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;