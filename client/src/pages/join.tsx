import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, UserCheck, Users, Heart, Star, ChartLine, CloudUpload, Video, BarChart3, CheckCircle, ArrowRight, Award, Target, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Join() {
  const { toast } = useToast();
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    role: "",
    rating: 5,
    content: "",
  });

  const [joinData, setJoinData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    institution: "",
    experience: "",
    motivation: "",
  });

  const [selectedRole, setSelectedRole] = useState("");
  const [rating, setRating] = useState(5);

  const membershipBenefits = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Expert Mentorship",
      description: "One-on-one guidance from experienced researchers and clinicians"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Publication Support",
      description: "End-to-end manuscript assistance with clear co-authorship policies"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Research Collaboration",
      description: "Join ongoing projects and connect with international researchers"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Career Development",
      description: "Personalized career guidance and professional networking opportunities"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Learning",
      description: "Access resources and sessions at your own pace and schedule"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Network",
      description: "Connect with researchers from leading institutions worldwide"
    }
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest("POST", "/api/feedback", { ...feedbackData, rating });
      
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback.",
      });
      
      setFeedbackData({
        name: "",
        email: "",
        role: "",
        rating: 5,
        content: "",
      });
      setRating(5);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest("POST", "/api/join", { ...joinData, role: selectedRole });
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      setJoinData({
        name: "",
        email: "",
        phone: "",
        role: "",
        institution: "",
        experience: "",
        motivation: "",
      });
      setSelectedRole("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const roles = [
    {
      id: "mentee",
      title: "Research Mentee",
      description: "Join our comprehensive mentorship program and accelerate your research career with expert guidance",
      icon: GraduationCap,
      buttonText: "Apply as Mentee",
      color: "blue",
      price: "PKR 25,000",
      duration: "12 weeks",
      features: [
        "Weekly 1-on-1 mentorship sessions",
        "Research methodology training",
        "Statistical analysis guidance",
        "Publication strategy development",
        "Career guidance and networking"
      ]
    },
    {
      id: "consultant",
      title: "Expert Consultant",
      description: "Share your expertise and mentor the next generation of researchers in your field",
      icon: UserCheck,
      buttonText: "Become Consultant",
      color: "green",
      price: "Revenue Share",
      duration: "Flexible",
      features: [
        "Flexible mentoring schedule",
        "Revenue sharing model",
        "Professional recognition",
        "Access to research network",
        "Continuing education credits"
      ]
    },
    {
      id: "collaborator",
      title: "Research Collaborator",
      description: "Join ongoing research projects and co-author publications with international teams",
      icon: Users,
      buttonText: "Join as Collaborator",
      color: "purple",
      price: "PKR 10,000",
      duration: "6-12 months",
      features: [
        "Multi-center collaboration",
        "Co-authorship opportunities",
        "Access to research databases",
        "International networking",
        "Publication support"
      ]
    },
    {
      id: "volunteer",
      title: "Community Volunteer",
      description: "Support our mission through various volunteer opportunities and community outreach",
      icon: Heart,
      buttonText: "Volunteer With Us",
      color: "orange",
      price: "Free",
      duration: "Ongoing",
      features: [
        "Community outreach programs",
        "Event organization support",
        "Content creation assistance",
        "Peer mentoring opportunities",
        "Recognition and certificates"
      ]
    }
  ];

  const dashboardFeatures = [
    {
      title: "Private Dashboard",
      description: "Personalized workspace with progress tracking and resources",
      icon: BarChart3
    },
    {
      title: "Assignment Upload",
      description: "Secure submission system for research assignments and drafts",
      icon: CloudUpload
    },
    {
      title: "Session Replays",
      description: "Access to recorded mentorship sessions and webinars",
      icon: Video
    },
    {
      title: "Progress Tracking",
      description: "Integration with Google, Notion, and LMS platforms",
      icon: ChartLine
    }
  ];

  const testimonials = [
    {
      name: "Dr. Aisha Patel",
      role: "Medical Student, AIIMS",
      content: "The mentorship program at GI REACH completely transformed my approach to research. Within 6 months, I published my first paper in a high-impact journal.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    },
    {
      name: "Dr. Rahman Ali",
      role: "Research Fellow, Mayo Clinic",
      content: "The manuscript support service is exceptional. The team guided me through every step of the publication process with clear, transparent policies.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    },
    {
      name: "Dr. Zoya Khan",
      role: "Resident, Johns Hopkins",
      content: "The collaborative research opportunities have been incredible. I've worked on 3 meta-analyses and learned advanced statistical methods.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1594824475933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="join-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="join-title">
              Join Our Research Community
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="join-description">
              Become part of Pakistan's premier medical research community and accelerate your academic career with expert guidance, collaborative opportunities, and comprehensive support
            </p>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join GI REACH?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock exclusive benefits and accelerate your research career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to get involved and contribute to research excellence
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8" data-testid="join-options">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card key={role.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`role-${role.id}`}>
                  <CardContent className="p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-${role.color}-100 rounded-xl flex items-center justify-center`}>
                        <div className={`text-${role.color}-600`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold text-${role.color}-600`}>{role.price}</div>
                        <div className="text-sm text-gray-500">{role.duration}</div>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid={`role-title-${role.id}`}>
                      {role.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed" data-testid={`role-description-${role.id}`}>
                      {role.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className={`w-full bg-${role.color}-600 hover:bg-${role.color}-700 text-white py-3 rounded-lg font-semibold transition-all duration-300`}
                          onClick={() => setSelectedRole(role.id)}
                          data-testid={`button-${role.id}`}
                        >
                          {role.buttonText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg" data-testid={`dialog-${role.id}`}>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-gray-900" data-testid={`dialog-title-${role.id}`}>
                            Apply as {role.title}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleJoinSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                              <Input
                                placeholder="Enter your full name"
                                value={joinData.name}
                                onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
                                required
                                className="bg-gray-50 border-gray-200"
                                data-testid="join-input-name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                value={joinData.email}
                                onChange={(e) => setJoinData({ ...joinData, email: e.target.value })}
                                required
                                className="bg-gray-50 border-gray-200"
                                data-testid="join-input-email"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <Input
                              type="tel"
                              placeholder="Enter your phone number"
                              value={joinData.phone}
                              onChange={(e) => setJoinData({ ...joinData, phone: e.target.value })}
                              className="bg-gray-50 border-gray-200"
                              data-testid="join-input-phone"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Institution/University</label>
                            <Input
                              placeholder="Enter your institution"
                              value={joinData.institution}
                              onChange={(e) => setJoinData({ ...joinData, institution: e.target.value })}
                              className="bg-gray-50 border-gray-200"
                              data-testid="join-input-institution"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Relevant Experience</label>
                            <Textarea
                              placeholder="Describe your relevant experience and background"
                              rows={3}
                              value={joinData.experience}
                              onChange={(e) => setJoinData({ ...joinData, experience: e.target.value })}
                              className="bg-gray-50 border-gray-200"
                              data-testid="join-textarea-experience"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivation</label>
                            <Textarea
                              placeholder="Why do you want to join GI REACH? What are your research goals?"
                              rows={4}
                              value={joinData.motivation}
                              onChange={(e) => setJoinData({ ...joinData, motivation: e.target.value })}
                              required
                              className="bg-gray-50 border-gray-200"
                              data-testid="join-textarea-motivation"
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className={`w-full bg-${role.color}-600 hover:bg-${role.color}-700 text-white py-3 rounded-lg font-semibold transition-all duration-300`}
                            data-testid="join-submit-button"
                          >
                            Submit Application
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Member Dashboard Preview */}
      <section className="py-20 bg-white" data-testid="dashboard-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="dashboard-title">
              Member Dashboard Preview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="dashboard-description">
              Exclusive features and tools available to our registered members
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboardFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`dashboard-feature-${index}`}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                      <div className="text-purple-600 group-hover:text-white transition-colors duration-300">
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3" data-testid={`feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed" data-testid={`feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50" data-testid="testimonials-feedback">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="testimonials-title">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="testimonials-subtitle">
              Real experiences from our mentees and collaborators who have advanced their research careers
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid={`testimonial-${index}`}>
                <CardContent className="p-8">
                  <div className="flex text-yellow-400 mb-6" data-testid={`testimonial-stars-${index}`}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 text-lg leading-relaxed mb-6" data-testid={`testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                      data-testid={`testimonial-image-${index}`}
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-lg" data-testid={`testimonial-name-${index}`}>
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600" data-testid={`testimonial-role-${index}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feedback Form */}
          <Card className="max-w-3xl mx-auto bg-white border-0 shadow-xl" data-testid="feedback-form">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4" data-testid="feedback-form-title">
                  Share Your Experience
                </h3>
                <p className="text-gray-600 text-lg">
                  Help others by sharing your journey with GI REACH
                </p>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                      required
                      className="bg-gray-50 border-gray-200"
                      data-testid="feedback-input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                      required
                      className="bg-gray-50 border-gray-200"
                      data-testid="feedback-input-email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Role</label>
                  <Select onValueChange={(value) => setFeedbackData({ ...feedbackData, role: value })} required>
                    <SelectTrigger className="bg-gray-50 border-gray-200" data-testid="feedback-select-role">
                      <SelectValue placeholder="Select your role with GI REACH" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current Mentee" data-testid="feedback-role-current">Current Mentee</SelectItem>
                      <SelectItem value="Former Mentee" data-testid="feedback-role-former">Former Mentee</SelectItem>
                      <SelectItem value="Collaborator" data-testid="feedback-role-collaborator">Research Collaborator</SelectItem>
                      <SelectItem value="Consultant" data-testid="feedback-role-consultant">Expert Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1" data-testid="rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-8 h-8 cursor-pointer transition-colors ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                          onClick={() => setRating(i + 1)}
                          data-testid={`rating-star-${i}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 ml-4">{rating} out of 5 stars</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Experience</label>
                  <Textarea
                    placeholder="Share your experience with GI REACH - how has it helped your research career?"
                    rows={6}
                    value={feedbackData.content}
                    onChange={(e) => setFeedbackData({ ...feedbackData, content: e.target.value })}
                    required
                    className="bg-gray-50 border-gray-200"
                    data-testid="feedback-textarea-content"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="feedback-submit-button"
                >
                  Submit Feedback
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Research Career?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of researchers who have accelerated their careers through our comprehensive programs and collaborative research opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
