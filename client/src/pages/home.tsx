import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, FileText, Video, Star, Users, BookOpen, Award, ArrowRight, CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Testimonial } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const handleQuickInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest("POST", "/api/contact", {
        ...formData,
        phone: "",
        inquiryType: "General Inquiry",
      });
      
      toast({
        title: "Inquiry Sent!",
        description: "We'll respond within 24-48 hours.",
      });
      
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative hero-pattern py-24 lg:py-32 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                🏆 Pakistan's Leading Research Community
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight" data-testid="hero-title">
                Advancing Medical Research Through
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Excellence</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl" data-testid="hero-description">
                Join Pakistan's premier research community dedicated to advancing gastroenterology and medical sciences through collaborative research, mentorship, and academic excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/join">
                  <Button 
                    size="xl"
                    className="group"
                    data-testid="button-join-now"
                  >
                    Join Our Community
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button 
                    variant="outline"
                    size="xl"
                    className="group"
                    data-testid="button-explore-programs"
                  >
                    Explore Programs
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative glass rounded-3xl p-8 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center group">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">500+</div>
                    <div className="text-gray-600 font-medium">Research Papers</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">200+</div>
                    <div className="text-gray-600 font-medium">Active Researchers</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">50+</div>
                    <div className="text-gray-600 font-medium">Institutions</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">95%</div>
                    <div className="text-gray-600 font-medium">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                🌟 Excellence in Research
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Leading Medical Research in 
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Pakistan</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                GI REACH is Pakistan's premier gastroenterology research organization, dedicated to advancing medical knowledge through collaborative research, education, and clinical excellence.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Evidence-based Research</h4>
                    <p className="text-gray-600">Rigorous methodologies ensuring reliable and impactful results</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Collaboration</h4>
                    <p className="text-gray-600">International partnerships expanding research horizons</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Publication Excellence</h4>
                    <p className="text-gray-600">Comprehensive support for peer-reviewed publications</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expert Mentorship</h4>
                    <p className="text-gray-600">Guidance from leading medical professionals and researchers</p>
                  </div>
                </div>
              </div>
              <Link href="/about">
                <Button size="lg" className="group">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Medical Research" 
                  className="rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                />
                <div className="absolute -bottom-8 -left-8 glass rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-4">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">Excellence Award</div>
                      <div className="text-gray-600">Research Innovation 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              🚀 Comprehensive Support
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive support for researchers at every stage of their academic journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="card-gradient group animate-slide-up" data-testid="service-mentorship">
              <div className="p-10">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Research Mentorship</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  One-on-one guidance from experienced researchers to accelerate your academic growth and research methodology skills.
                </p>
                <Link href="/programs">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 group">
                    Learn More 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="card-gradient group animate-slide-up" data-testid="service-manuscript" style={{ animationDelay: '0.1s' }}>
              <div className="p-10">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Publication Support</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  End-to-end manuscript preparation, peer review, and publication guidance with transparent co-authorship policies.
                </p>
                <Link href="/contact">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700 p-0 group">
                    Get Started 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="card-gradient group animate-slide-up" data-testid="service-education" style={{ animationDelay: '0.2s' }}>
              <div className="p-10">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Educational Programs</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Workshops, webinars, and training sessions on research methodologies, statistical analysis, and academic writing.
                </p>
                <Link href="/resources">
                  <Button variant="ghost" className="text-purple-600 hover:text-purple-700 p-0 group">
                    Explore 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 gradient-primary relative overflow-hidden" data-testid="stats-section">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              📊 Our Impact
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Making a Difference</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Making a difference in medical research across Pakistan and beyond
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center group animate-scale-in">
              <div className="glass rounded-2xl p-8 backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-blue-100 text-lg font-medium">Published Papers</div>
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="glass rounded-2xl p-8 backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">200+</div>
                <div className="text-blue-100 text-lg font-medium">Active Researchers</div>
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="glass rounded-2xl p-8 backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">50+</div>
                <div className="text-blue-100 text-lg font-medium">Partner Institutions</div>
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="glass rounded-2xl p-8 backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">15+</div>
                <div className="text-blue-100 text-lg font-medium">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                💬 Let's Connect
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">Get in Touch</h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Ready to advance your research career? Contact us to learn more about our programs and how we can support your academic journey.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Phone</div>
                    <div className="text-gray-600 text-lg">+92 (21) 1234-5678</div>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Email</div>
                    <div className="text-gray-600 text-lg">info@gireach.pk</div>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Address</div>
                    <div className="text-gray-600 text-lg">Karachi, Pakistan</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative glass rounded-3xl p-10 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
                <form onSubmit={handleQuickInquiry} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="bg-white/80 border-gray-200 focus-ring rounded-xl h-12"
                      data-testid="input-first-name"
                    />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="bg-white/80 border-gray-200 focus-ring rounded-xl h-12"
                      data-testid="input-last-name"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/80 border-gray-200 focus-ring rounded-xl h-12"
                    data-testid="input-email"
                  />
                  <Textarea
                    placeholder="Your Message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-white/80 border-gray-200 focus-ring rounded-xl resize-none"
                    data-testid="textarea-message"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full group"
                    data-testid="button-send-inquiry"
                  >
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
              ⭐ Success Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from researchers who have advanced their careers through our programs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={testimonial.id} className="card-gradient group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`testimonial-${testimonial.id}`}>
                <div className="p-8">
                  <div className="flex text-yellow-400 mb-6" data-testid={`testimonial-rating-${testimonial.id}`}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current hover:scale-110 transition-transform" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg font-medium" data-testid={`testimonial-content-${testimonial.id}`}>
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={testimonial.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-2xl mr-4 object-cover shadow-lg group-hover:scale-110 transition-transform"
                        data-testid={`testimonial-image-${testimonial.id}`}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1" data-testid={`testimonial-name-${testimonial.id}`}>
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 font-medium" data-testid={`testimonial-role-${testimonial.id}`}>
                        {testimonial.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.institution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
