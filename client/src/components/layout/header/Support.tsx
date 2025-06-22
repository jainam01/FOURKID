import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  ShoppingBag, // New icon for the order box
  Mail, 
  Phone, 
  HelpCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter'; // Import Link for the button

const Support = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Support request submitted",
          description: "We'll get back to you as soon as possible.",
        });
        setName('');
        setEmail('');
        setMessage('');
        setSubject('');
      } else {
        throw new Error(data.message || 'Failed to submit support request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit support request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    { question: "How do I track my order?", answer: "You can track your order by logging into your account and visiting the 'Order History' section. Alternatively, use the tracking number provided in your shipping confirmation email." },
    { question: "What is your return policy?", answer: "We offer a 30-day return policy. Items must be unworn, unwashed, and with all original tags attached. Please visit our Return Portal to initiate a return." },
    { question: "How do I find the right size for my child?", answer: "We provide a comprehensive size guide for each product category. You can find it on product pages or in the 'Size Guide' section of our website. Measure your child and compare to our charts for the best fit." },
    { question: "Do you offer wholesale pricing?", answer: "Yes, we offer wholesale pricing for qualified retailers. Please contact our wholesale department at wholesale@fourkids.com for more information." },
    { question: "How can I cancel my order?", answer: "If your order hasn't shipped yet, you can cancel it by contacting our customer service team. Once an order has shipped, you'll need to wait for it to arrive and then follow our return process." }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
        <p className="text-gray-600 mb-8">We're here to help with any questions or concerns you may have.</p>
        
        {/* --- NEW "TRACK ORDER" BOX --- */}
        <div className="border rounded-lg p-4 flex justify-between items-center mb-12 shadow-sm">
            <div className="flex items-center">
                <div className="mr-4 text-gray-400">
                    <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 uppercase tracking-wide">Track, Cancel, Return/Exchange</h3>
                    <p className="text-sm text-gray-500">Manage your purchases</p>
                </div>
            </div>
            <Button asChild variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50 hover:text-teal-600">
              <Link href="/orders">Orders</Link>
            </Button>
        </div>


        {/* --- UPDATED SUPPORT OPTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Email Support */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mb-4 bg-primary/10 inline-flex p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4 text-sm">Send us an email and we'll respond within 24 hours</p>
            <a href="mailto:support@fourkids.com" className="text-primary text-sm font-medium">support@fourkids.com</a>
          </div>

          {/* Phone Support */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mb-4 bg-primary/10 inline-flex p-3 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4 text-sm">Call us directly for immediate assistance</p>
            <a href="tel:1-800-555-KIDS" className="text-primary text-sm font-medium">1-800-555-KIDS</a>
          </div>
        </div>

        {/* --- REST OF THE PAGE REMAINS THE SAME --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="XYZ@example.com" required className="w-full" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Order #12345" required className="w-full" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" required className="w-full min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">
                    Can't find what you're looking for? Browse our <a href="/faq" className="text-primary font-medium">full FAQ section</a> or contact our support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;