import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, we would send this to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Exclusive discounts and promotions",
    "New collection announcements",
    "Seasonal style guides",
    "Special birthday offers for your child"
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-primary/10 to-transparent w-1/2"></div>
          <div className="absolute left-10 top-10 w-20 h-20 bg-primary/10 rounded-full"></div>
          <div className="absolute right-20 bottom-10 w-32 h-32 bg-primary/10 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 md:p-12 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Mail className="h-4 w-4" />
                Newsletter
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Stay updated with the latest trends, exclusive offers, and new arrivals for your children.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-xl mb-4">Join Our Community</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Get 10% off your first order when you sign up for our newsletter.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-200 rounded-lg focus-visible:ring-primary"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="flex space-x-1">
                        <div className="loading-dot w-2 h-2 bg-white rounded-full"></div>
                        <div className="loading-dot w-2 h-2 bg-white rounded-full"></div>
                        <div className="loading-dot w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="text-gray-400 text-xs text-center mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
