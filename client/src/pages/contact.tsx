import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageCircle, Clock, Calendar, Download, Phone, MapPin, Users, ArrowRight, CheckCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      primary: "info@gireach.pk",
      secondary: "mentorship@gireach.pk",
      description: "Professional email support for all inquiries",
      color: "blue"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      primary: "+92 (21) 1234-5678",
      secondary: "Mon-Fri, 9 AM - 6 PM PKT",
      description: "Direct phone support during business hours",
      color: "green"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      primary: "+92 (300) 123-4567",
      secondary: "Quick responses available",
      description: "Instant messaging for urgent queries",
      color: "emerald"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office Location",
      primary: "Karachi, Pakistan",
      secondary: "By appointment only",
      description: "In-person consultations available",
      color: "purple"
    }
  ];

  const quickActions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Schedule Consultation",
      description: "Book a free 30-minute consultation",
      action: "Schedule Now"
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Download Resources",
      description: "Access our research templates and guides",
      action: "Download"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Join Community",
      description: "Connect with fellow researchers",
      action: "Join Now"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest("POST", "/api/contact", formData);
      
      toast({
        title: "Message Sent!",
        description: "We'll respond within 24-48 hours.",
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white" data-testid="contact-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="contact-title">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="contact-description">
              Ready to advance your research career? Our expert team is here to provide personalized guidance and support for your academic journey
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the communication method that works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-${method.color}-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-${method.color}-600 transition-colors duration-300`}>
                    <div className={`text-${method.color}-600 group-hover:text-white transition-colors duration-300`}>
                      {method.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-900 font-semibold mb-1">{method.primary}</p>
                  <p className="text-gray-600 text-sm mb-4">{method.secondary}</p>
                  <p className="text-gray-500 text-sm">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="bg-white border-0 shadow-xl" data-testid="contact-form">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="form-title">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24-48 hours.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiry Type</label>
                    <Select onValueChange={(value) => handleInputChange("inquiryType", value)} required>
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500" data-testid="select-inquiry-type">
                        <SelectValue placeholder="Select your inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mentorship Program" data-testid="option-mentorship">Mentorship Program</SelectItem>
                        <SelectItem value="Manuscript Support" data-testid="option-manuscript">Manuscript Support</SelectItem>
                        <SelectItem value="Group Projects" data-testid="option-projects">Group Research Projects</SelectItem>
                        <SelectItem value="Collaboration" data-testid="option-collaboration">Research Collaboration</SelectItem>
                        <SelectItem value="Consultation" data-testid="option-consultation">Free Consultation</SelectItem>
                        <SelectItem value="Other" data-testid="option-other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <Textarea
                      placeholder="Tell us about your research goals and how we can help..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="textarea-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="button-send-message"
                  >
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Quick Actions */}
            <div className="space-y-8">
              {/* Response Time */}
              <Card className="bg-blue-600 border-0 shadow-xl text-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Clock className="h-8 w-8 mr-3" />
                    <h3 className="text-2xl font-bold">Quick Response</h3>
                  </div>
                  <p className="text-blue-100 text-lg mb-4">
                    We respond to all inquiries within 24-48 hours during business days.
                  </p>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Professional support guaranteed</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white border-0 shadow-xl" data-testid="quick-actions">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6" data-testid="quick-actions-title">
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="text-blue-600">
                            {action.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                          {action.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM PKT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-semibold text-gray-900">10:00 AM - 2:00 PM PKT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-semibold text-gray-900">Closed</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        We serve researchers globally across all time zones
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Check out our comprehensive FAQ section or schedule a free consultation to discuss your specific research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              View FAQ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
