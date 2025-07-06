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
    const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={(node) => {
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
AnimatedSection.displayName = "AnimatedSection";


const WholesaleProgram = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    { title: "Variety of Styles", description: " Explore a diverse catalog of children's clothing, from trendy outfits to timeless classics, catering to all tastes.", icon: Users },
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
    // { q: "What are the minimum order requirements?", a: "MOQs vary by product. Detailed information is available in our wholesale portal upon account approval." },
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

      {/* === UPDATED HERO SECTION START === */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative text-center rounded-2xl shadow-xl overflow-hidden">

            {/* Background Image Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://res.cloudinary.com/dtpinwr0h/image/upload/v1751564384/ChatGPT_Image_Jul_3_2025_11_09_03_PM_kuyb9r.png')" }}
              aria-hidden="true"
            ></div>

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>

            {/* Content Layer with Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative py-20 md:py-28 lg:py-32 px-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">Partner with FourKids</h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">Elevate your retail business with our premium collection of kidswear. Join our network of successful partners today.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="px-10 py-6 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-2xl" asChild>
                  <a href="#registration-form">Apply Now</a>
                </Button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
      {/* === UPDATED HERO SECTION END === */}

      <AnimatedSection className="pt-4 md:pt-4 pb-20 md:pb-24">
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
          <AnimatedSection><div className="rounded-xl bg-gray-200 aspect-video shadow-lg bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/dtpinwr0h/image/upload/v1751806963/62918071-210a-4f72-aaa1-27b409c7b4e7_ouzes2.png')" }}></div></AnimatedSection>
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
                    <div><label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label><Input id="fullName" name="fullName" placeholder="Enter your name" required /></div>
                    <div><label htmlFor="businessEmail" className="block text-sm font-medium mb-1">Business Email</label><Input id="businessEmail" name="businessEmail" type="email" placeholder="Enter your gmail" required /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label><Input id="companyName" name="companyName" placeholder="Enter your company name" required /></div>
                    <div><label htmlFor="gstNumber" className="block text-sm font-medium mb-1">GST Number</label><Input id="gstNumber" name="gstNumber" placeholder="Enter your GST number" required /></div>
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
        <div className="container mx-auto px-4"><h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Have More Questions?</h2><p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Our dedicated wholesale support team is ready to assist you.</p><div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a href="mailto:arihant.8758586464@gmail.com" className="inline-flex items-center justify-center gap-2 text-slate-100 hover:text-white transition-colors text-lg"><Mail className="h-5 w-5" />wholesale@fourkids.in</a>
          <a href="tel:+918758586464" className="inline-flex items-center justify-center gap-2 text-slate-100 hover:text-white transition-colors text-lg"><Phone className="h-5 w-5" />+91 8758586464</a></div></div>
      </section>
    </div>
  );
};

export default WholesaleProgram;