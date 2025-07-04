import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Award, HeartHandshake, Globe, Recycle, Users
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter'; 

// A reusable animation component for sections
const AnimatedSection = ({ children, className, ref, ...props }: { children: React.ReactNode, className?: string, ref?: React.Ref<HTMLDivElement> }) => {
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
          if (node) {
            inViewRef(node);
            if (typeof ref === 'function') ref(node);
          }
        }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
};

const AboutUs = () => {
  const team = [
    { name: "Manish Kothari", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", bio: "With 15+ years in children's fashion, Sarah founded FourKids to create durable, stylish clothing for kids." },
    { name: "Hitesh Kothari", role: "Design Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", bio: "Michael brings his experience from top fashion houses to create comfortable, functional designs." },
    { name: "Rahul Kothari", role: "Head of Production", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", bio: "Priya ensures all FourKids products meet our high standards for quality and ethical manufacturing." },
    { name: "James Wilson", role: "Sustainability Officer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", bio: "James leads our initiatives to reduce environmental impact through sustainable practices." }
  ];

  const values = [
    { icon: Award, title: "Unmatched Quality", description: "We use premium materials and rigorous quality control to ensure our clothes withstand active play." },
    { icon: HeartHandshake, title: "Ethical Production", description: "Our garments are made in facilities that ensure fair wages and safe working conditions." },
    { icon: Globe, title: "Global Inspiration", description: "We draw inspiration from cultures around the world to bring you unique, stylish designs." },
    { icon: Recycle, title: "Sustainability", description: "From organic fabrics to recycled packaging, we're committed to minimizing our environmental footprint." }
  ];
  
  const timeline = [
      { year: "2015", title: "The Spark", description: "FourKids is founded with a small collection of everyday essentials for children aged 5-15." },
      { year: "2018", title: "Digital & Physical Growth", description: "We open our first flagship store and launch our online platform, reaching families nationwide." },
      { year: "2020", title: "A Greener Step", description: "FourKids introduces our sustainable line, featuring organic cotton and recycled materials." },
      { year: "2023", title: "Future Forward", description: "We proudly announce that 100% of our packaging is now plastic-free and fully recyclable." }
  ]

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="about-us-page bg-slate-50 text-slate-800">
      <Helmet><title>About Us - FourKids</title></Helmet>
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Our Story</h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  FourKids was born from a simple idea: that children's clothing should be as durable and imaginative as they are. Founded in 2015, we set out to create high-quality, ethically-made apparel that kids love to wear and parents can trust.
                </p>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  From a small collection of everyday essentials, we've grown into a brand beloved by families, committed to style, sustainability, and the simple joy of childhood.
                </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=1887&auto=format&fit=crop" alt="Happy children playing" className="w-full h-full object-cover"/>
            </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <AnimatedSection className="py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Core Values</h2>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div variants={itemVariants} key={index}>
                <Card className="text-center h-full bg-white shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border-b-4 border-b-primary/20 hover:border-b-primary">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary"><value.icon className="w-8 h-8" strokeWidth={1.5} /></div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-sm text-slate-600">{value.description}</p></CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Centered Card Timeline with Reduced Gap */}
      <AnimatedSection className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Our Journey So Far</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-200 transform -translate-x-1/2"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-center"
                >
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-md"></div>
                  <div className={cn("w-[calc(50%-2.5rem)] p-6 bg-white rounded-lg shadow-xl border", index % 2 === 0 ? "mr-auto" : "ml-auto")}>
                    <p className="font-bold text-primary text-lg mb-1">{item.year}</p>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Team Section */}
      <AnimatedSection className="py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" // <-- THE FIX IS HERE
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {team.slice(0, 3).map((member, index) => (
              <motion.div variants={itemVariants} key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="h-64 overflow-hidden"><img src={`${member.image}`} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Join Us CTA */}
      {/* <section className="bg-white py-20">
        <AnimatedSection className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Family</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto mb-8">
              We're always looking for passionate individuals to join our mission. Check out our current openings and help us create a better future for children's fashion.
            </p>
            <Button size="lg" className="font-bold" asChild>
              <Link href="/careers">View Careers</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section> */}
    </div>
  );
};

export default AboutUs;