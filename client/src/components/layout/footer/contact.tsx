

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replace with your actual contact details
  const contactDetails = {
    email: "arihant.8758586464@gmail.com", // <<--- YOUR SUPPORT EMAIL
    phone: "+91 8758586464",    // <<--- YOUR SUPPORT PHONE NUMBER
    address: "225, 2nd floor, Karnvati platinum - 8, Greekanta Ahmedabad - 380007", // <<--- YOUR ADDRESS (Optional)
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // Basic frontend validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields in the contact form.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
        toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }


    try {
      // Replace with your actual API endpoint for form submission
      const response = await fetch('/api/submit-contact-form', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you shortly.",
        });
        (event.target as HTMLFormElement).reset();
      } else {
        toast({
          title: "Submission Error",
          description: result.message || "Could not send your message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Network Error",
        description: "Could not send your message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page bg-background text-foreground">
      <Helmet>
        <title>Contact Us - FourKids</title>
        <meta name="description" content="Get in touch with FourKids. We're here to help with your inquiries about our wholesale children's clothing and services." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Get In Touch
          </h1>
          <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </p>
        </div>
      </section>

      {/* Main Content Area: Contact Info & Form */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Contact Information Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-6">
                  Reach out to us directly through any of the channels below, or use the contact form.
                </p>
                <div className="space-y-6">
                  <a 
                    href={`mailto:${contactDetails.email}`}
                    className="flex items-start p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <Mail className="h-6 w-6 mr-4 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-medium text-foreground">Email Us</h3>
                      <p className="text-muted-foreground group-hover:text-primary transition-colors">{contactDetails.email}</p>
                    </div>
                  </a>
                  <a 
                    href={`tel:${contactDetails.phone.replace(/\s|-/g, "")}`} // Format for tel link
                    className="flex items-start p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <Phone className="h-6 w-6 mr-4 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-medium text-foreground">Call Us</h3>
                      <p className="text-muted-foreground group-hover:text-primary transition-colors">{contactDetails.phone}</p>
                    </div>
                  </a>
                  {contactDetails.address && (
                    <div className="flex items-start p-4 rounded-lg hover:bg-muted/50 transition-colors group"> {/* Not a link unless you link to maps */}
                      <MapPin className="h-6 w-6 mr-4 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="font-medium text-foreground">Our Office</h3>
                        <p className="text-muted-foreground">{contactDetails.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Hours (Optional) */}
              <div className="pt-6 border-t border-border">
                 <h3 className="text-xl font-medium mb-3 text-foreground">Business Hours</h3>
                 <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
                 <p className="text-muted-foreground">Saturday: 10:00 AM - 6:00 PM (IST)</p>
                 <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form Section */}
            <div>
              <Card className="shadow-xl border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-semibold">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name <span className="text-destructive">*</span></label>
                      <Input id="name" name="name" type="text" placeholder="Enter your name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email Address <span className="text-destructive">*</span></label>
                      <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">Subject <span className="text-destructive">*</span></label>
                      <Input id="subject" name="subject" type="text" placeholder="e.g., Wholesale Inquiry, Support Request" required />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Your Message <span className="text-destructive">*</span></label>
                      <Textarea id="message" name="message" placeholder="Hi there, I'd like to ask about..." rows={5} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full font-semibold" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) - Replace with your actual map embed or image */}
      {contactDetails.address && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Find Us Here</h2>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-border shadow-lg">
              {/* Replace with your Google Maps embed iframe or an image of a map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229.49209377376627!2d72.58432385476715!3d23.028416461208128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e844f451ccb19%3A0xbe85292cb92f097e!2sPlatinum%20Karnavati%20K9!5e0!3m2!1sen!2sin!4v1751804308535!5m2!1sen!2sin" // <<--- REPLACE THIS SRC
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
              ></iframe>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};




export default ContactUs;