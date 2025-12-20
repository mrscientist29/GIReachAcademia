import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Users, BookOpen, Target, Eye, Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Umar Farooque",
      role: "Founder & Director",
      specialization: "Gastroenterology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      id: 2,
      name: "Dr. Ayesha Rahman",
      role: "Research Director",
      specialization: "Clinical Research",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      id: 3,
      name: "Dr. Hassan Ali",
      role: "Education Coordinator",
      specialization: "Medical Education",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      id: 4,
      name: "Dr. Zara Khan",
      role: "Publications Manager",
      specialization: "Academic Writing",
      image: "https://images.unsplash.com/photo-1594824475933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence",
      description: "Committed to the highest standards in research and education"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaboration",
      description: "Building bridges between researchers, institutions, and communities"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Integrity",
      description: "Upholding ethical standards in all our research endeavors"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Innovation",
      description: "Pioneering new approaches to medical research and education"
    }
  ];

  const achievements = [
    { number: "500+", label: "Published Papers", color: "text-blue-600" },
    { number: "200+", label: "Active Researchers", color: "text-green-600" },
    { number: "50+", label: "Partner Institutions", color: "text-purple-600" },
    { number: "15+", label: "Years of Excellence", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="about-title">
              About GI REACH
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="about-description">
              Pakistan's premier gastroenterology research organization, dedicated to advancing medical knowledge through collaborative research, education, and clinical excellence since 2009.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16" data-testid="mission-vision">
            <Card className="bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900" data-testid="mission-title">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed" data-testid="mission-content">
                  To empower the next generation of medical researchers through comprehensive mentorship, cutting-edge educational resources, and collaborative research opportunities that drive meaningful advancement in gastroenterology and related medical sciences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900" data-testid="vision-title">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed" data-testid="vision-content">
                  To become the leading platform for medical research excellence in South Asia, fostering a global community of scholars who contribute to evidence-based medicine and innovative healthcare solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-0 shadow-2xl" data-testid="founder-message">
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <img 
                    src={teamMembers[0].image} 
                    alt="Dr. Umar Farooque" 
                    className="w-full max-w-md rounded-2xl shadow-lg mx-auto"
                    data-testid="founder-image"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-xl p-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-4 text-gray-900" data-testid="founder-welcome-title">
                    Message from Our Founder
                  </h3>
                  <p className="text-blue-600 font-semibold mb-6 text-lg" data-testid="founder-title">
                    Dr. Umar Farooque - Founder & Director
                  </p>
                  <blockquote className="text-gray-600 text-lg leading-relaxed mb-8" data-testid="founder-message-content">
                    "Research excellence begins with the right guidance and support. At GI REACH, we believe every aspiring researcher deserves access to world-class mentorship and resources. Our mission is to bridge the gap between academic potential and research achievement, creating pathways for the next generation of medical scientists to make meaningful contributions to global health."
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">15+ Years of Research Excellence</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our research and educational initiatives
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-testid="team-section">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="team-title">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="team-description">
              Leading experts in medical research, education, and clinical practice
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`team-member-${member.id}`}>
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-32 h-32 rounded-2xl mx-auto object-cover shadow-lg"
                      data-testid={`team-member-image-${member.id}`}
                    />
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2" data-testid={`team-member-name-${member.id}`}>
                    {member.name}
                  </h4>
                  <p className="text-blue-600 font-semibold mb-2" data-testid={`team-member-role-${member.id}`}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm" data-testid={`team-member-specialization-${member.id}`}>
                    {member.specialization}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="achievements-section">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" data-testid="achievements-title">Our Impact</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Measurable results from our commitment to research excellence
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center" data-testid={`achievement-${index}`}>
                <div className="text-5xl font-bold text-white mb-2" data-testid={`achievement-number-${index}`}>
                  {achievement.number}
                </div>
                <p className="text-blue-100 text-lg" data-testid={`achievement-label-${index}`}>
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Become part of Pakistan's leading medical research community and advance your career with expert guidance and collaborative opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
