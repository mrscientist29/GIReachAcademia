import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { GraduationCap, FileText, Users, Calendar, Clock, CheckCircle, ArrowRight, Award, BookOpen, Target } from "lucide-react";

export default function Programs() {
  const programs = [
    {
      id: 1,
      title: "Research Mentorship Program",
      description: "One-on-one guidance from experienced researchers to accelerate your academic growth",
      duration: "12 weeks",
      format: "Weekly 1-hour sessions",
      price: "PKR 25,000",
      features: [
        "Personal research mentor assignment",
        "Research methodology training",
        "Statistical analysis guidance",
        "Publication strategy development",
        "Career guidance and networking"
      ],
      icon: <GraduationCap className="h-8 w-8" />,
      color: "blue",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: 2,
      title: "Manuscript Support Service",
      description: "End-to-end publishing guidance with clear co-author policies and editorial assistance",
      duration: "4-8 weeks",
      format: "Project-based support",
      price: "PKR 15,000",
      features: [
        "Comprehensive manuscript review",
        "Statistical analysis support",
        "Journal selection guidance",
        "Peer review preparation",
        "Clear co-authorship policies"
      ],
      icon: <FileText className="h-8 w-8" />,
      color: "green",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: 3,
      title: "Group Research Projects",
      description: "Collaborative research opportunities in meta-analysis and systematic reviews",
      duration: "6-12 months",
      format: "Team collaboration",
      price: "PKR 10,000",
      features: [
        "Multi-center collaboration",
        "Systematic review methodology",
        "Meta-analysis training",
        "Publication opportunities",
        "Networking with peers"
      ],
      icon: <Users className="h-8 w-8" />,
      color: "purple",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const currentProjects = [
    {
      id: 1,
      title: "Cardiovascular Risk in Diabetes Patients",
      type: "Meta-analysis",
      participants: 8,
      status: "Active",
      deadline: "March 2025"
    },
    {
      id: 2,
      title: "Cancer Screening Efficacy in South Asia",
      type: "Systematic Review",
      participants: 12,
      status: "Recruiting",
      deadline: "April 2025"
    },
    {
      id: 3,
      title: "Antibiotic Resistance Patterns in ICU",
      type: "Original Research",
      participants: 6,
      status: "Active",
      deadline: "May 2025"
    }
  ];

  const upcomingProjects = [
    {
      id: 1,
      title: "Mental Health in Healthcare Workers Post-COVID",
      startDate: "March 2025",
      type: "Cross-sectional Study"
    },
    {
      id: 2,
      title: "Telemedicine Effectiveness in Rural Areas",
      startDate: "April 2025",
      type: "Systematic Review"
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="programs-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="programs-title">
              Research Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="programs-description">
              Comprehensive academic support programs designed to accelerate your research career and enhance your publication success
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the program that best fits your research goals and career stage
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group" data-testid={`program-${program.id}`}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-${program.color}-600 rounded-xl flex items-center justify-center`}>
                      <div className="text-white">
                        {program.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{program.format}</span>
                      </div>
                      <div className="flex items-center text-sm font-semibold text-blue-600">
                        <Target className="h-4 w-4 mr-2" />
                        <span>{program.price}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-8">
                      {program.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/join">
                      <Button className={`w-full bg-${program.color}-600 hover:bg-${program.color}-700 text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Research Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join ongoing collaborative research projects and contribute to meaningful scientific discoveries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="current-projects">
            {currentProjects.map((project) => (
              <Card key={project.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid={`current-project-${project.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {project.status}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{project.participants}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3" data-testid={`current-project-title-${project.id}`}>
                    {project.title}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{project.type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>
                  
                  <Link href="/join">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      Join Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get early access to new research projects and secure your spot in cutting-edge studies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8" data-testid="upcoming-projects">
            {upcomingProjects.map((project) => (
              <Card key={project.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid={`upcoming-project-${project.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-orange-100 text-orange-800">
                      Coming Soon
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{project.startDate}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3" data-testid={`upcoming-project-title-${project.id}`}>
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{project.type}</span>
                  </div>
                  
                  <Link href="/join">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                      Express Interest
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Advance Your Research Career?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of researchers who have accelerated their careers through our comprehensive programs and collaborative research opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
