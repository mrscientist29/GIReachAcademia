import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, FileText, Video, Star, Users, BookOpen, Award, ArrowRight, CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Testimonial } from "@shared/schema";
import { contentStore, type PageContent, type ContentSection } from "@/lib/content-store";

// Helper function to convert Tailwind gradient classes to CSS gradients
const getGradientColors = (gradientClass: string): string => {
  const gradientMap: Record<string, string> = {
    'from-blue-50 to-indigo-100': '#eff6ff, #e0e7ff',
    'from-green-50 to-emerald-100': '#f0fdf4, #dcfce7',
    'from-purple-50 to-pink-100': '#faf5ff, #fce7f3',
    'from-orange-50 to-red-100': '#fff7ed, #fee2e2',
    'from-indigo-50 to-purple-100': '#eef2ff, #e9d5ff',
    'from-green-50 to-teal-100': '#f0fdf4, #ccfbf1',
    'from-blue-50 to-cyan-100': '#eff6ff, #cffafe',
  };
  
  return gradientMap[gradientClass] || '#eff6ff, #e0e7ff';
};

// Icon mapping for services
const iconMap = {
  GraduationCap,
  FileText,
  BookOpen,
  Users,
  Award,
  Star
};

export default function HomeDynamic() {
  const { toast } = useToast();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Load dynamic content
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('HomeDynamic: Loading content...');
        
        // Try async first
        const content = await contentStore.getPageContent('home');
        console.log('HomeDynamic: Loaded content:', content);
        
        if (content && content.sections) {
          setPageContent(content);
        } else {
          console.warn('HomeDynamic: Content missing sections, trying sync method');
          const fallbackContent = contentStore.getPageContentSync('home');
          setPageContent(fallbackContent);
        }
      } catch (error) {
        console.error('HomeDynamic: Error loading content:', error);
        // Fallback to sync method
        const fallbackContent = contentStore.getPageContentSync('home');
        console.log('HomeDynamic: Fallback content:', fallbackContent);
        setPageContent(fallbackContent);
      }
    };
    
    loadContent();

    // Listen for content updates
    const handleContentUpdate = (e: CustomEvent) => {
      if (e.detail.pageId === 'home') {
        console.log('HomeDynamic: Content updated via event');
        setPageContent(e.detail.content);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

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

  if (!pageContent) {
    return <div>Loading...</div>;
  }

  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20 lg:py-32'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="hero-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-gradient-to-r from-blue-50 to-indigo-100')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 
                    className={`${section.styles?.fontSize || 'text-4xl lg:text-6xl'} font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6 leading-tight`}
                    data-testid="hero-title"
                  >
                    {section.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="hero-description">
                    {section.content}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/join">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid="button-join-now"
                      >
                        Join Our Community
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/programs">
                      <Button 
                        variant="outline"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                        data-testid="button-explore-programs"
                      >
                        Explore Programs
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  {section.imageUrl && (
                    <img 
                      src={section.imageUrl} 
                      alt={section.title}
                      className="rounded-2xl shadow-2xl w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="about-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-white')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className={`text-4xl font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6`}>
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {section.content}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">Evidence-based research methodologies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">International collaboration network</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">Peer-reviewed publication support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">Mentorship from leading experts</span>
                    </div>
                  </div>
                  <Link href="/about">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                      Learn More About Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="relative">
                  {section.imageUrl && (
                    <img 
                      src={section.imageUrl} 
                      alt={section.title}
                      className="rounded-2xl shadow-2xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="services-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-gray-50')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-bold ${section.styles?.textColor || 'text-gray-900'} mb-4`}>
                  {section.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {section.content}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {section.data?.services?.map((service: any) => {
                  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || FileText;
                  return (
                    <Card key={service.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-${service.color}-600 transition-colors duration-300`}>
                          <IconComponent className={`h-8 w-8 text-${service.color}-600 group-hover:text-white transition-colors duration-300`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'stats':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="stats-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-blue-600')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-bold ${section.styles?.textColor || 'text-white'} mb-4`}>
                  {section.title}
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  {section.content}
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                {section.data?.stats?.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-100 text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="contact-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-white')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16">
                <div>
                  <h2 className={`text-4xl font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6`}>
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {section.content}
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Phone</div>
                        <div className="text-gray-600">{section.data?.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Email</div>
                        <div className="text-gray-600">{section.data?.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Address</div>
                        <div className="text-gray-600">{section.data?.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleQuickInquiry} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="bg-white border-gray-200"
                      />
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white border-gray-200"
                    />
                    <Textarea
                      placeholder="Your Message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-white border-gray-200"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-black text-white p-2 rounded text-xs">
          Content: {pageContent ? `${pageContent.sections?.length || 0} sections` : 'Loading...'}
          <button 
            onClick={() => {
              console.log('Current pageContent:', pageContent);
              const syncContent = contentStore.getPageContentSync('home');
              console.log('Sync content:', syncContent);
            }}
            className="ml-2 bg-blue-600 px-2 py-1 rounded"
          >
            Debug
          </button>
        </div>
      )}
      
      {pageContent?.sections?.map(renderSection) || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
            <p className="text-sm text-gray-500 mt-2">
              {pageContent ? 'Content loaded but no sections' : 'Fetching from database...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Testimonials - Static for now */}
      <section className="py-20 bg-gray-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from researchers who have advanced their careers through our programs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex text-yellow-400 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">
                        {testimonial.role}, {testimonial.institution}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}