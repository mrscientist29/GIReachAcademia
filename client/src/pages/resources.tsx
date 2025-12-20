import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play, HelpCircle, BookOpen, FileText, Video, Users, Calendar, ArrowRight, ExternalLink, Star } from "lucide-react";

export default function Resources() {
  const resourceCategories = [
    {
      id: 1,
      title: "Research Templates",
      description: "Professional templates to streamline your research process",
      icon: <FileText className="h-8 w-8" />,
      color: "blue",
      count: 12,
      resources: [
        { name: "Research Protocol Template", type: "PDF", size: "2.5 MB", downloads: 1250 },
        { name: "Statistical Analysis Guide", type: "PDF", size: "3.2 MB", downloads: 980 },
        { name: "Manuscript Checklist", type: "PDF", size: "1.8 MB", downloads: 1450 },
        { name: "Literature Review Template", type: "DOCX", size: "1.2 MB", downloads: 890 }
      ]
    },
    {
      id: 2,
      title: "Video Tutorials",
      description: "Step-by-step video guides for research methodologies",
      icon: <Video className="h-8 w-8" />,
      color: "green",
      count: 25,
      resources: [
        { name: "Research Methodology Basics", type: "Video", duration: "45 min", views: 2340 },
        { name: "Advanced Statistics in SPSS", type: "Video", duration: "60 min", views: 1890 },
        { name: "Publication Ethics & Guidelines", type: "Video", duration: "30 min", views: 1560 },
        { name: "Meta-Analysis Techniques", type: "Video", duration: "75 min", views: 1120 }
      ]
    },
    {
      id: 3,
      title: "Webinar Recordings",
      description: "Recorded sessions from our expert-led webinars",
      icon: <Users className="h-8 w-8" />,
      color: "purple",
      count: 18,
      resources: [
        { name: "Writing High-Impact Papers", type: "Webinar", duration: "90 min", date: "Dec 2024" },
        { name: "Grant Writing Workshop", type: "Webinar", duration: "120 min", date: "Nov 2024" },
        { name: "Career Development in Research", type: "Webinar", duration: "60 min", date: "Oct 2024" },
        { name: "International Collaboration", type: "Webinar", duration: "75 min", date: "Sep 2024" }
      ]
    }
  ];

  const faqs = [
    {
      question: "How long is the mentorship program?",
      answer: "Our standard mentorship program runs for 12 weeks with weekly one-on-one sessions. We also offer extended 6-month programs for advanced researchers."
    },
    {
      question: "What are the co-author policies?",
      answer: "We follow ICMJE recommendations for authorship. All contributors are recognized fairly based on their intellectual contribution to the research."
    },
    {
      question: "How do I join group projects?",
      answer: "Applications for group projects open quarterly. You can apply through our Join page, and we match you with projects based on your expertise and interests."
    },
    {
      question: "Are the resources free to access?",
      answer: "Basic resources are free for all registered members. Premium content and advanced templates require a membership subscription."
    },
    {
      question: "How do I get publication support?",
      answer: "Our manuscript support service includes comprehensive review, statistical analysis, and journal selection guidance. Contact us for personalized assistance."
    },
    {
      question: "What statistical software do you support?",
      answer: "We provide guidance for SPSS, R, Stata, and Python. Our tutorials cover both basic and advanced statistical analyses."
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Writing Your First Research Paper: A Complete Guide",
      description: "A comprehensive step-by-step guide for beginners on structuring, writing, and submitting impactful research papers to peer-reviewed journals.",
      author: "Dr. Sarah Ahmed",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Writing",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "Meta-Analysis Best Practices and Common Pitfalls",
      description: "Essential methodologies, statistical techniques, and quality assessment criteria for conducting high-quality systematic reviews and meta-analyses.",
      author: "Dr. Hassan Ali",
      date: "December 10, 2024",
      readTime: "12 min read",
      category: "Methodology",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "Building Academic Networks in the Digital Age",
      description: "Proven strategies for creating meaningful professional relationships, collaborating internationally, and advancing your research career through networking.",
      author: "Dr. Fatima Malik",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Career",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="resources-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="resources-title">
              Research Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="resources-description">
              Comprehensive tools, templates, and educational materials to accelerate your research journey and enhance your academic success
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Resource Library</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our comprehensive collection of research tools and educational materials
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {resourceCategories.map((category) => (
              <Card key={category.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid={`category-${category.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                      <div className={`text-${category.color}-600`}>
                        {category.icon}
                      </div>
                    </div>
                    <Badge className={`bg-${category.color}-100 text-${category.color}-800`}>
                      {category.count} items
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {category.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{resource.name}</div>
                          <div className="text-xs text-gray-500">
                            {resource.type} • {resource.size || resource.duration || resource.date}
                            {resource.downloads && ` • ${resource.downloads} downloads`}
                            {resource.views && ` • ${resource.views} views`}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className={`text-${category.color}-600 hover:text-${category.color}-700`}>
                          {category.id === 1 ? <Download className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700 text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                    View All Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="faqs">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="faqs-title">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our programs and resources
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid={`faq-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3" data-testid={`faq-question-${index}`}>
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed" data-testid={`faq-answer-${index}`}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="blog-section">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="blog-title">
              Latest Research Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert guidance and insights from our research community
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`blog-post-${post.id}`}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200" data-testid={`blog-post-title-${post.id}`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed" data-testid={`blog-post-description-${post.id}`}>
                      {post.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-4">
                        <span>{post.author}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 group-hover:translate-x-1 transition-transform duration-200">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Need Personalized Support?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Our expert team is ready to provide personalized guidance for your specific research needs and academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Get Expert Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
              Browse All Resources
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
