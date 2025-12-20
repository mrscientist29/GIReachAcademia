import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { webinarStore, type Webinar, type WebinarRegistration, type CustomQuestion } from "@/lib/webinar-store";
import { 
  Calendar,
  Clock,
  Users,
  Video,
  User,
  MapPin,
  CheckCircle,
  ArrowRight,
  X
} from "lucide-react";

export default function Webinars() {
  const { toast } = useToast();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    experience: "",
    interests: "",
    customQuestionAnswers: {} as { [questionId: string]: string }
  });

  useEffect(() => {
    loadWebinars();
  }, []);

  const loadWebinars = () => {
    const publishedWebinars = webinarStore.getPublishedWebinars();
    setWebinars(publishedWebinars);
  };

  const handleRegister = async (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setShowRegistration(true);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWebinar) return;

    try {
      const registrationId = webinarStore.registerForWebinar({
        webinarId: selectedWebinar.id,
        ...registrationData
      });

      toast({
        title: "Registration Successful!",
        description: `You have been registered for "${selectedWebinar.title}". Check your email for confirmation details.`,
      });

      // Reset form and close modal
      setRegistrationData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        experience: "",
        interests: "",
        customQuestionAnswers: {}
      });
      setShowRegistration(false);
      setSelectedWebinar(null);
      
      // Reload webinars to update attendee count
      loadWebinars();
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isWebinarFull = (webinar: Webinar) => {
    return webinar.currentAttendees >= webinar.maxAttendees;
  };

  const isWebinarPast = (webinar: Webinar) => {
    const webinarDateTime = new Date(`${webinar.date}T${webinar.time}`);
    return webinarDateTime < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Medical Research <span className="text-blue-600">Webinars</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our expert-led webinars to advance your knowledge in gastroenterology, 
              research methodologies, and clinical practices. Learn from leading professionals 
              and connect with peers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Webinars</h2>
            <p className="text-xl text-gray-600">
              Register now for our upcoming educational sessions
            </p>
          </div>

          {webinars.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Webinars Available</h3>
              <p className="text-gray-600">
                Check back soon for upcoming webinar announcements.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {webinars.map((webinar) => (
                <Card key={webinar.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {webinar.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={webinar.image} 
                        alt={webinar.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        {webinar.category}
                      </Badge>
                      {isWebinarFull(webinar) && (
                        <Badge className="bg-red-100 text-red-800">
                          Full
                        </Badge>
                      )}
                      {isWebinarPast(webinar) && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Past Event
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {webinar.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {webinar.description}
                    </p>

                    {/* Webinar Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span>{formatDate(webinar.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-3 text-blue-600" />
                        <span>{formatTime(webinar.time)} {webinar.timezone} ({webinar.duration} minutes)</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-3 text-blue-600" />
                        <span>{webinar.currentAttendees}/{webinar.maxAttendees} registered</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        <span>{webinar.speaker.name} - {webinar.speaker.title}</span>
                      </div>
                    </div>

                    {/* Speaker Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-4">
                        {webinar.speaker.image && (
                          <img 
                            src={webinar.speaker.image} 
                            alt={webinar.speaker.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{webinar.speaker.name}</h4>
                          <p className="text-sm text-gray-600">{webinar.speaker.title}</p>
                        </div>
                      </div>
                      {webinar.speaker.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                          {webinar.speaker.bio}
                        </p>
                      )}
                    </div>

                    {/* Registration Button */}
                    <Button 
                      onClick={() => handleRegister(webinar)}
                      disabled={isWebinarFull(webinar) || isWebinarPast(webinar)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      {isWebinarPast(webinar) ? (
                        "Event Completed"
                      ) : isWebinarFull(webinar) ? (
                        "Registration Full"
                      ) : (
                        <>
                          Register Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Register for Webinar
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowRegistration(false);
                    setSelectedWebinar(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 mt-2">{selectedWebinar.title}</p>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={registrationData.organization}
                    onChange={(e) => setRegistrationData({...registrationData, organization: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position/Title *</Label>
                  <Input
                    id="position"
                    value={registrationData.position}
                    onChange={(e) => setRegistrationData({...registrationData, position: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              {selectedWebinar.includeExperienceField && (
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select
                    value={registrationData.experience}
                    onValueChange={(value) => setRegistrationData({...registrationData, experience: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="15+">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedWebinar.customQuestions?.map((question, index) => (
                <div key={question.id}>
                  <Label htmlFor={`customQuestion-${question.id}`}>
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Textarea
                    id={`customQuestion-${question.id}`}
                    value={registrationData.customQuestionAnswers[question.id] || ""}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      customQuestionAnswers: {
                        ...registrationData.customQuestionAnswers,
                        [question.id]: e.target.value
                      }
                    })}
                    placeholder="Please provide your answer..."
                    rows={3}
                    className="mt-2"
                    required={question.required}
                  />
                </div>
              ))}

              <div>
                <Label htmlFor="interests">Areas of Interest</Label>
                <Textarea
                  id="interests"
                  value={registrationData.interests}
                  onChange={(e) => setRegistrationData({...registrationData, interests: e.target.value})}
                  placeholder="Tell us about your specific interests in this webinar topic..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Registration Benefits</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Access to live webinar session</li>
                  <li>• Q&A session with the speaker</li>
                  <li>• Recording access for 30 days</li>
                  <li>• Downloadable resources and materials</li>
                  <li>• Certificate of attendance</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegistration(false);
                    setSelectedWebinar(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Complete Registration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}