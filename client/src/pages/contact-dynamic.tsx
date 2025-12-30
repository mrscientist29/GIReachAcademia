import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from "lucide-react";
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

export default function ContactDynamic() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Load dynamic content with enhanced error handling
  useEffect(() => {
    let mounted = true;
    
    const loadContent = async () => {
      try {
        console.log('ContactDynamic: Loading content...');
        
        // Always try async first for fresh data
        const content = await contentStore.getPageContent('contact');
        console.log('ContactDynamic: Loaded content:', content);
        
        if (mounted) {
          if (content && content.sections && content.sections.length > 0) {
            setPageContent(content);
            console.log(`ContactDynamic: Successfully loaded ${content.sections.length} sections`);
          } else {
            console.warn('ContactDynamic: Content missing sections, trying sync method');
            const fallbackContent = contentStore.getPageContentSync('contact');
            if (fallbackContent && fallbackContent.sections) {
              setPageContent(fallbackContent);
              console.log(`ContactDynamic: Used fallback content with ${fallbackContent.sections.length} sections`);
            } else {
              console.error('ContactDynamic: No valid content found');
            }
          }
        }
      } catch (error) {
        console.error('ContactDynamic: Error loading content:', error);
        if (mounted) {
          const fallbackContent = contentStore.getPageContentSync('contact');
          console.log('ContactDynamic: Fallback content:', fallbackContent);
          if (fallbackContent) {
            setPageContent(fallbackContent);
          }
        }
      }
    };

    loadContent();

    // Listen for content updates with better error handling
    const handleContentUpdate = (e: CustomEvent) => {
      if (e.detail.pageId === 'contact' && mounted) {
        console.log('ContactDynamic: Content updated via event', e.detail.content);
        setPageContent(e.detail.content);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    
    return () => {
      mounted = false;
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', formData);
    // You can add actual form submission logic here
  };

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
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-gradient-to-r from-orange-50 to-red-100')}`}></div>
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
                    <a href="#contact-form">
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid="button-contact-us"
                      >
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </a>
                  </div>
                </div>
                {section.imageUrl && (
                  <div className="relative">
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                      data-testid="hero-image"
                    />
                  </div>
                )}
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
              <div className="text-center mb-16">
                <h2 className={`${section.styles?.fontSize || 'text-4xl'} font-bold ${section.styles?.textColor || 'text-gray-900'} mb-4`}>
                  {section.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {section.content}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h3>
                  <div className="space-y-6">
                    {section.data?.phone && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900">Phone</p>
                          <p className="text-gray-600">{section.data.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {section.data?.email && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900">Email</p>
                          <p className="text-gray-600">{section.data.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {section.data?.address && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900">Address</p>
                          <p className="text-gray-600">{section.data.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {section.data?.hours && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900">Hours</p>
                          <p className="text-gray-600">{section.data.hours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <Card className="bg-white shadow-lg border-0">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-6" id="contact-form">Send us a Message</h3>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="mt-2"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="mt-2"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                            placeholder="What is this regarding?"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            className="mt-2"
                            placeholder="Tell us more about your inquiry..."
                          />
                        </div>
                        
                        <Button 
                          type="submit"
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                        >
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
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
            data-testid="text-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-gray-50')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className={`${section.styles?.fontSize || 'text-4xl'} font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6`}>
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
                {section.imageUrl && (
                  <div className="relative">
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="contact-page">
      {pageContent.sections.map(renderSection)}
    </div>
  );
}