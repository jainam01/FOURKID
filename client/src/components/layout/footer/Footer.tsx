import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

// The data structure remains the same, which is efficient.
const footerSections = [
  {
    title: "Customer Service",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Support", href: "/support" },
      { name: "Wholesale Program", href: "/wholesale-program" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Information",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Shipping Policy", href: "/shipping-policy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
];

// --- NEW SOCIAL ICONS COMPONENT (for cleaner code) ---
const SocialIcons = () => (
  <div className="flex space-x-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    </a>
  </div>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-slate-50 mt-16 border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        
        {/* --- Top Section: About and Contact --- */}
        {/* On mobile, this will stack. On desktop, it's a grid. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">About Fourkids</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Fourkids is a premium wholesale clothing business for the Indian market, 
              offering high-quality trendy designs at competitive prices.
            </p>
          </div>
          <div className="md:text-right">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Contact</h3>
            <address className="not-italic text-slate-600 dark:text-slate-400 text-sm">
              <p className="font-semibold">Fourkid's</p>
              <p>225, 2th floor, Karnvati platinum - 8</p>
              <p>Greekanta Ahmedabad - 380007</p>
              <p className="mt-2">
                <a href="mailto:arihant.8758586464@gmail.com" className="hover:text-primary break-all">
                  arihant.8758586464@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* --- Middle Section: The Accordion Links (Mobile) / Columns (Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              {/* This is the tappable card header for mobile */}
              <button
                className="w-full flex justify-between items-center text-left p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 md:bg-transparent md:p-0 md:border-none md:shadow-none"
                onClick={() => toggleSection(section.title)}
                aria-expanded={openSection === section.title}
              >
                <h3 className="font-bold text-slate-800 dark:text-slate-200 md:text-lg">
                  {section.title}
                </h3>
                <ChevronDown 
                  className={`h-5 w-5 text-slate-500 transition-transform duration-300 md:hidden ${openSection === section.title ? "rotate-180" : ""}`} 
                />
              </button>
              
              {/* The list of links */}
              <ul 
                className={`pl-4 space-y-3 mt-3 md:mt-4 md:pl-0 md:block ${openSection === section.title ? 'block' : 'hidden'}`}
              >
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* --- Bottom Section: Social Icons and Copyright --- */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <SocialIcons />
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
            © {currentYear} Fourkids. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;