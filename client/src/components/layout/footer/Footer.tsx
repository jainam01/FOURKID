import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, Mail, MessageSquareText, Facebook, InstagramIcon, Youtube, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Data for Link Columns (Easy to Edit) ---
const footerLinkSections = [
  {
    title: "Support",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Shipping Policy", href: "/shipping-policy" },
      { name: "Terms Of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Info",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Wholesale Program", href: "/wholesale-program" },
      { name: "FAQ", href: "/faq" },
    ],
  },
];

// --- SVG Component for WhatsApp (as it's not in Lucide) ---
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

// --- Simple Payment Icon Components ---
const PaymentIcons = () => (
    <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
      {/* Replace with your actual payment SVGs or images */}
      <div className="bg-white border border-gray-300 rounded-md px-2 py-1"><img src="https://js.wpenjoy.com/wp-content/uploads/2021/03/visa-logo-gray.png" alt="Visa" className="h-4"/></div>
      <div className="bg-white border border-gray-300 rounded-md px-2 py-1"><img src="https://js.wpenjoy.com/wp-content/uploads/2021/03/mastercard-logo-gray.png" alt="Mastercard" className="h-4"/></div>
      <div className="bg-white border border-gray-300 rounded-md px-2 py-1"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-4"/></div>
      <div className="bg-white border border-gray-300 rounded-md px-2 py-1"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4"/></div>
      <div className="bg-white border border-gray-300 rounded-md px-2 py-1"><img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Bitcoin.svg" alt="Bitcoin" className="h-4"/></div>
    </div>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to subscribe.");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setNewsletterEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#fbfaf8] text-slate-800 border-t border-slate-200 mt-16">
      <div className="container mx-auto px-4 pt-16 pb-8">
        
        {/* --- Top Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Fourkids</h2> 
            {/* <p className="text-sm text-slate-600">Also Available on <a href="#" className="font-bold">amazon.com</a></p> */}
            <address className="not-italic text-sm text-slate-600 space-y-2">
                <p><span className="font-bold">Address:</span> 225, 2nd floor, Karnvati platinum - 8, Greekanta Ahmedabad - 380007</p>
            </address>
             <div className="space-y-2 text-sm">
                <a href="tel:+918758586464" className="flex items-center gap-2 text-slate-600 hover:text-primary">
                    <MessageSquareText size={16} /> <span>Text: 8758586464</span>
                </a>
                <a href="mailto:arihant.8758586464@gmail.com" className="flex items-center gap-2 text-slate-600 hover:text-primary">
                    <Mail size={16} /> <span>arihant.8758586464@gmail.com</span>
                </a>
             </div>
          </div>
          
          {/* Columns 2 & 3: Link Lists */}
          {footerLinkSections.map((section) => (
            <div key={section.title} className="border-b border-slate-200 pb-4 md:border-none md:pb-0">
              <button
                className="w-full flex justify-between items-center text-left md:pointer-events-none"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="font-bold text-lg mb-4">{section.title}</h3>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 md:hidden ${openSection === section.title ? "rotate-180" : ""}`} />
              </button>
              <ul className={`space-y-3 md:block ${openSection === section.title ? 'block' : 'hidden'}`}>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Follow Us & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-700 hover:text-primary"><Facebook /></a>
                <a href="#" className="text-slate-700 hover:text-primary"><InstagramIcon /></a>
                {/* <a href="#" className="text-slate-700 hover:text-primary"><Youtube /></a> */}
                <a
                  href="https://wa.me/918758586464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-primary"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Newsletter Sign Up</h3>
              <p className="text-sm text-slate-600 mb-4">Receive our latest updates about our products and promotions.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="enter your email address" 
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-white border border-slate-400 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="bg-black text-white font-bold text-sm px-6 py-2 rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  SUBMIT <Send size={14}/>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* --- Recognitions Section (Optional but Recommended for Trust) --- */}
        {/* <div className="border-t border-slate-200 pt-10 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-4">We have been a part of</h4>
              <div className="flex justify-center md:justify-start items-center gap-4 flex-wrap">
               
                <img src="https://www.gstatic.com/s/gweb/common/storage/images/icons/material/product/gfs/v2/gfs_48dp.png" alt="Google for Startups" className="h-10"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/United_Nations_Trade_and_Development_logo.svg/320px-United_Nations_Trade_and_Development_logo.svg.png" alt="UN Trade" className="h-10"/>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-4">Recognized by Govt of India</h4>
              <div className="flex justify-center md:justify-start items-center gap-4 flex-wrap">
               
                <img src="https://msme.gov.in/sites/default/files/logo-msme.png" alt="MSME India" className="h-10"/>
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Startup_India_logo.svg/320px-Startup_India_logo.svg.png" alt="Startup India" className="h-10"/>
              </div>
            </div>
          </div>
        </div> */}

        {/* --- Bottom Bar: Copyright & Payment Methods --- */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 text-center">
            © {currentYear} Fourkids. All rights reserved.
          </p>
          {/* <PaymentIcons /> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;