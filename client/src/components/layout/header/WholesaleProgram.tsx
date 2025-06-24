import { useState, useRef, useEffect, forwardRef, ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Truck, Users, BarChart, ClipboardCheck, Mail, Phone, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";


const AnimatedSection = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className }, ref) => {
    const controls = useAnimation();
    // This internal ref is for the useInView hook itself.
    const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    return (
      <motion.div
        // 3. Assign the forwarded ref to the motion.div so the parent can reference it.
        ref={(node) => {
          // This function handles both refs.
          inViewRef(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);
// Add a display name for better debugging in React DevTools
AnimatedSection.displayName = "AnimatedSection";
  

const WholesaleProgram = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Animation controls for the timeline
  const timelineControls = useAnimation();
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.25 });

  useEffect(() => {
    if (timelineInView) {
        timelineControls.start("visible");
    }
  }, [timelineControls, timelineInView]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/wholesale-application', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        toast({ title: "Application Submitted!", description: "We'll review your application and be in touch soon." });
        formRef.current?.reset();
    } catch (error) {
        toast({ title: "Submission Error", description: "Could not submit your application. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const benefits = [
    { title: "Premium Quality Products", description: "Offer your customers high-quality, trendy kidswear that stands out.", icon: Sparkles },
    { title: "Competitive Wholesale Pricing", description: "Access attractive pricing structures designed to boost your profit margins.", icon: BarChart },
    { title: "Reliable Supply Chain", description: "Count on consistent stock availability and efficient order fulfillment.", icon: Truck },
    { title: "Dedicated Partner Support", description: "Our team is committed to helping your wholesale business succeed with us.", icon: Users },
  ];

  const howItWorksSteps = [
    { step: 1, title: "Submit Application", description: "Fill out our online form with your business details." },
    { step: 2, title: "Verification", description: "Our team will review your application and business documents." },
    { step: 3, title: "Account Activation", description: "Upon approval, your wholesale account will be activated." },
    { step: 4, title: "Place Orders", description: "Browse our catalog and place your first wholesale order." },
  ];

  const eligibilityCriteria = [
    "Must be a registered business with a valid GSTIN.",
    "Primary business in retail or e-commerce of apparel products.",
    "Ability to meet minimum order quantities (MOQs).",
    "Commitment to FourKids brand values and quality standards.",
  ];

  const faqs = [
    { q: "What are the minimum order requirements?", a: "MOQs vary by product. Detailed information is available in our wholesale portal upon account approval." },
    { q: "What payment methods are accepted?", a: "We accept bank transfers and major credit/debit cards. Payment terms are outlined in the wholesale agreement." },
    { q: "How long does shipping take?", a: "Standard shipping within India typically takes 5-7 business days." },
    { q: "Do you offer regional exclusivity?", a: "Exclusivity may be considered for established partners based on volume. Please discuss this with your account manager." },
  ];

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  const timelineCSS = `
    @media (min-width: 768px) {
      .timeline-item:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(50%);
        width: 100%;
        height: 2px;
        background-image: linear-gradient(to right, #4F46E5 50%, #D1D5DB 50%);
        background-size: 200% 100%;
        background-position: 100%;
        transition: background-position 0.8s ease-out;
        z-index: -1;
      }
      .timeline-in-view .timeline-item:not(:last-child)::after {
        background-position: 0%;
      }
    }
  `;

  return (
    <div className="wholesale-program-page bg-slate-50 text-slate-800">
      <Helmet>
        <title>Wholesale Program - FourKids</title>
        <style>{timelineCSS}</style>
      </Helmet>
      
      <section className="relative bg-gradient-to-r from-primary to-indigo-600 py-28 md:py-40 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Partner with FourKids</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">Elevate your retail business with our premium collection of kidswear. Join our network of successful partners today.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="px-10 py-6 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-2xl" asChild>
              <a href="#registration-form">Apply Now</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <AnimatedSection className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The <span className="text-primary">Fourkids</span> Advantage</h2>
          <p className="text-center text-lg text-slate-600 mb-16 max-w-2xl mx-auto">Why partnering with us is a smart move for your business.</p>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div variants={itemVariants} key={index}>
                <Card className="text-center h-full bg-white shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-primary/20 hover:border-t-primary">
                  <CardHeader><div className="mx-auto flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary"><benefit.icon className="w-8 h-8" strokeWidth={1.5} /></div><CardTitle className="text-xl">{benefit.title}</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-slate-600">{benefit.description}</p></CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <div ref={timelineRef} className={cn("bg-white py-20 md:py-24", timelineInView ? "timeline-in-view" : "")}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Simple Steps to Get Started</h2>
          <div className="relative max-w-5xl mx-auto">
            <motion.ol variants={containerVariants} initial="hidden" animate={timelineControls} className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
              {howItWorksSteps.map((item) => (
                <motion.li variants={itemVariants} key={item.step} className="flex flex-col items-center text-center relative timeline-item">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-lg">{item.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>

      <div className="py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Who Can Apply?</h2>
                <p className="text-lg text-slate-600 mb-8">We welcome partners who are passionate about quality and style. Here are the basic requirements:</p>
                <ul className="space-y-4">
                  {eligibilityCriteria.map((item, index) => (<li key={index} className="flex items-start text-lg"><ClipboardCheck className="h-6 w-6 mr-3 text-green-500 flex-shrink-0 mt-1" /><span>{item}</span></li>))}
                </ul>
            </AnimatedSection>
            <AnimatedSection><div className="rounded-xl bg-gray-200 aspect-video shadow-lg bg-cover bg-center" style={{backgroundImage: "url('https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4a28-622f-930f-e279236ef149/raw?se=2025-06-24T13%3A35%3A33Z&sp=r&sv=2024-08-04&sr=b&scid=da91776f-c3b4-522c-bc91-6ab14cc4d558&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-23T21%3A28%3A16Z&ske=2025-06-24T21%3A28%3A16Z&sks=b&skv=2024-08-04&sig=3kAlRefXKDWDpDwpt5UPaumsbGVUAfnDFc9/8PlHl50%3D')"}}></div></AnimatedSection>
        </div>
      </div>
      
      <section id="registration-form" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Join?</h2>
            <p className="text-lg text-slate-600 mt-4 mb-12">Complete the application below. We review submissions within 2 business days.</p>
          </AnimatedSection>
          <AnimatedSection className="max-w-3xl mx-auto">
            <Card className="shadow-2xl border-t-4 border-primary">
              <CardHeader><CardTitle className="text-2xl">Wholesale Account Application</CardTitle></CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label><Input id="fullName" name="fullName" required /></div>
                    <div><label htmlFor="businessEmail" className="block text-sm font-medium mb-1">Business Email</label><Input id="businessEmail" name="businessEmail" type="email" required /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label><Input id="companyName" name="companyName" required /></div>
                    <div><label htmlFor="gstNumber" className="block text-sm font-medium mb-1">GST Number</label><Input id="gstNumber" name="gstNumber" required /></div>
                  </div>
                  <div><label htmlFor="productTypes" className="block text-sm font-medium mb-1">Primary Product Categories</label><Textarea id="productTypes" name="productTypes" placeholder="e.g., Frocks, T-shirts" rows={3} required /></div>
                  <div><label htmlFor="catalogFile" className="block text-sm font-medium mb-1">Website or Catalog Link (Optional)</label><Input id="catalogFile" name="catalogFile" type="url" /></div>
                  <Button type="submit" size="lg" className="w-full font-bold text-lg" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Application"}</Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <AnimatedSection className="py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto"><Accordion type="single" collapsible className="w-full bg-white p-2 rounded-lg shadow-lg border">{faqs.map((faq, index) => (<AccordionItem value={`item-${index + 1}`} key={index} className="border-b last:border-b-0"><AccordionTrigger className="text-lg text-left hover:no-underline p-6">{faq.q}</AccordionTrigger><AccordionContent className="px-6 pb-6 text-slate-600">{faq.a}</AccordionContent></AccordionItem>))}</Accordion></div>
        </div>
      </AnimatedSection>

      <section className="bg-slate-900 py-20 text-center">
        <div className="container mx-auto px-4"><h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Have More Questions?</h2><p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Our dedicated wholesale support team is ready to assist you.</p><div className="flex flex-col sm:flex-row justify-center items-center gap-6"><a href="mailto:wholesale@fourkids.in" className="inline-flex items-center justify-center gap-2 text-slate-100 hover:text-white transition-colors text-lg"><Mail className="h-5 w-5" />wholesale@fourkids.in</a><a href="tel:+910000000000" className="inline-flex items-center justify-center gap-2 text-slate-100 hover:text-white transition-colors text-lg"><Phone className="h-5 w-5" />+91-XXXX-XXX-XXX</a></div></div>
      </section>
    </div>
  );
};

export default WholesaleProgram;