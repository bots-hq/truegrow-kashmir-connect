
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, TrendingUp, Smartphone, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const onboardingSlides = [
    {
      title: "Welcome to TrueGrow",
      description: "Your smart business platform for agriculture and local trade",
      icon: <Smartphone className="w-16 h-16 text-green-600" />,
      features: ["Smart Billing", "Inventory Management", "Secure Payments"]
    },
    {
      title: "Build Trust, Prevent Fraud",
      description: "Shared defaulter protection and community scorecard system",
      icon: <Shield className="w-16 h-16 text-green-600" />,
      features: ["Fraud Protection", "Trust Scores", "Community Network"]
    },
    {
      title: "Connect & Grow Together",
      description: "Join the digital revolution in Jammu and Kashmir's local trade",
      icon: <Users className="w-16 h-16 text-green-600" />,
      features: ["Local Network", "Business Growth", "Community Support"]
    }
  ];

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Smart Analytics",
      description: "Track sales, inventory, and customer insights with powerful analytics"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Fraud Prevention",
      description: "Shared defaulter list protects all businesses in the network"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community Network",
      description: "Connect with local businesses and customers across J&K"
    },
    {
      icon: <Star className="w-8 h-8 text-green-600" />,
      title: "Trust Scorecard",
      description: "Build reputation and unlock rewards with our scoring system"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + onboardingSlides.length) % onboardingSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <span className="text-xl font-bold text-gray-800">TrueGrow</span>
          </div>
          <Button 
            onClick={() => navigate('/role-selection')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
            <MapPin className="w-3 h-3 mr-1" />
            Proudly serving Jammu & Kashmir
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Digitize Your
            <span className="text-green-600 block">Local Business</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Smart platform for pesticide, fertilizer, and agricultural supply businesses. 
            Manage billing, inventory, payments, and build trust in your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => navigate('/role-selection')}
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Onboarding Slides */}
          <Card className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm border-green-100">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {onboardingSlides[currentSlide].icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {onboardingSlides[currentSlide].title}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {onboardingSlides[currentSlide].description}
                </p>
                
                <div className="flex justify-center gap-4 mb-6">
                  {onboardingSlides[currentSlide].features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-center gap-2 mb-4">
                  {onboardingSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={prevSlide} size="sm">
                    Previous
                  </Button>
                  <Button onClick={nextSlide} size="sm" className="bg-green-600 hover:bg-green-700">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From billing to community building, TrueGrow provides all the tools 
              to digitize and scale your agricultural business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join the growing network of trusted businesses across Jammu & Kashmir
          </p>
          <Button 
            onClick={() => navigate('/role-selection')}
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <span className="text-xl font-bold">TrueGrow</span>
          </div>
          <p className="text-gray-400 mb-4">
            Digitizing local trade across Jammu & Kashmir
          </p>
          <p className="text-sm text-gray-500">
            © 2024 TrueGrow. Building trust, one transaction at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
