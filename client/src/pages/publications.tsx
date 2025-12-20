import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, BookOpen, ExternalLink, Calendar, Users, Star, TrendingUp } from "lucide-react";
import type { Publication } from "@shared/schema";

export default function Publications() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: publications = [] } = useQuery<Publication[]>({
    queryKey: ["/api/publications", selectedType !== "all" ? `?type=${selectedType}` : ""],
  });

  const publicationTypes = [
    { value: "all", label: "All Publications", count: publications.length },
    { value: "Research Paper", label: "Research Papers", count: publications.filter(p => p.type === "Research Paper").length },
    { value: "Meta-Analysis", label: "Meta-Analysis", count: publications.filter(p => p.type === "Meta-Analysis").length },
    { value: "Poster", label: "Posters", count: publications.filter(p => p.type === "Poster").length },
  ];

  const topPerformers = [
    {
      id: 1,
      name: "Dr. Sarah Ahmed",
      role: "Senior Researcher",
      publications: 15,
      firstAuthor: 8,
      hIndex: 12,
      citations: 245,
      award: "Research Excellence Award 2024",
      icon: Trophy,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
    },
    {
      id: 2,
      name: "Ahmad Khan",
      role: "Research Fellow",
      publications: 12,
      firstAuthor: 6,
      hIndex: 9,
      citations: 189,
      award: "Outstanding Researcher 2024",
      icon: Medal,
      iconColor: "text-gray-500",
      bgColor: "bg-gray-50",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
    },
    {
      id: 3,
      name: "Dr. Fatima Malik",
      role: "Junior Researcher",
      publications: 8,
      firstAuthor: 5,
      hIndex: 6,
      citations: 134,
      award: "Rising Star Award 2024",
      icon: Award,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1594824475933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
    }
  ];

  const stats = [
    { label: "Total Publications", value: "500+", icon: BookOpen, color: "blue" },
    { label: "Impact Factor Range", value: "2.5-15.8", icon: TrendingUp, color: "green" },
    { label: "Active Researchers", value: "200+", icon: Users, color: "purple" },
    { label: "Average Citations", value: "25", icon: Star, color: "orange" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Research Paper":
        return "bg-blue-100 text-blue-800";
      case "Meta-Analysis":
        return "bg-green-100 text-green-800";
      case "Poster":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="publications-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="publications-title">
              Publications & Research Impact
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" data-testid="publications-description">
              Showcasing our community's research excellence and contributions to medical literature
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center" data-testid="publication-filters">
            <div className="inline-flex rounded-xl bg-white p-2 shadow-lg">
              {publicationTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "ghost"}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedType === type.value 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  data-testid={`filter-${type.value}`}
                >
                  {type.label}
                  <Badge className="ml-2 bg-gray-100 text-gray-600">
                    {type.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="publications-grid">
            {publications.map((publication) => (
              <Card key={publication.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`publication-${publication.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getTypeColor(publication.type)} data-testid={`publication-type-${publication.id}`}>
                      {publication.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span data-testid={`publication-year-${publication.id}`}>{publication.year}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200" data-testid={`publication-title-${publication.id}`}>
                    {publication.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 font-medium" data-testid={`publication-journal-${publication.id}`}>
                      {publication.journal}
                    </p>
                    {publication.impactFactor && (
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>Impact Factor: {publication.impactFactor}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4" data-testid={`publication-authors-${publication.id}`}>
                    <strong>Authors:</strong> {publication.authors}
                  </p>
                  
                  {publication.doi && (
                    <Button variant="outline" size="sm" className="w-full group-hover:border-blue-600 group-hover:text-blue-600 transition-colors duration-200">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Publication
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="leaderboard">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="leaderboard-title">
              Top Research Contributors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognizing our most productive and impactful researchers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {topPerformers.map((performer, index) => {
              const IconComponent = performer.icon;
              return (
                <Card key={performer.id} className={`bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${index === 0 ? 'ring-2 ring-yellow-200' : ''}`} data-testid={`performer-${performer.id}`}>
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <img 
                        src={performer.image} 
                        alt={performer.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                      />
                      <div className={`absolute -top-2 -right-2 w-12 h-12 ${performer.bgColor} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`h-6 w-6 ${performer.iconColor}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2" data-testid={`performer-name-${performer.id}`}>
                      {performer.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4">{performer.role}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{performer.publications}</div>
                        <div className="text-sm text-gray-600">Publications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{performer.firstAuthor}</div>
                        <div className="text-sm text-gray-600">First Author</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{performer.hIndex}</div>
                        <div className="text-sm text-gray-600">H-Index</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{performer.citations}</div>
                        <div className="text-sm text-gray-600">Citations</div>
                      </div>
                    </div>
                    
                    <div className={`${performer.bgColor} rounded-lg p-3`}>
                      <div className="flex items-center justify-center">
                        <Star className={`h-4 w-4 mr-2 ${performer.iconColor}`} />
                        <span className="text-sm font-semibold text-gray-800" data-testid={`performer-award-${performer.id}`}>
                          {performer.award}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Publish Your Research?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join our community of successful researchers and get the support you need to publish in high-impact journals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Get Publication Support
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
              View All Publications
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
