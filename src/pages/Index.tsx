
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, TrendingUp, Smartphone, MapPin, Star, CheckCircle, Zap, Globe, Award, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const onboardingSlides = [
    {
      title: "Welcome to TrueGrow",
      description: "Your smart business platform for agriculture and local trade",
      icon: <Smartphone className="w-16 h-16 text-green-600" />,
      features: ["Smart Billing", "Inventory Management", "Secure Payments"],
      gradient: "from-green-400 via-emerald-500 to-teal-600"
    },
    {
      title: "Build Trust, Prevent Fraud",
      description: "Shared defaulter protection and community scorecard system",
      icon: <Shield className="w-16 h-16 text-blue-600" />,
      features: ["Fraud Protection", "Trust Scores", "Community Network"],
      gradient: "from-blue-400 via-indigo-500 to-purple-600"
    },
    {
      title: "Connect & Grow Together",
      description: "Join the digital revolution in Jammu and Kashmir's local trade",
      icon: <Users className="w-16 h-16 text-orange-600" />,
      features: ["Local Network", "Business Growth", "Community Support"],
      gradient: "from-orange-400 via-red-500 to-pink-600"
    }
  ];

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Smart Analytics",
      description: "Track sales, inventory, and customer insights with powerful analytics",
      color: "green"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Fraud Prevention",
      description: "Shared defaulter list protects all businesses in the network",
      color: "blue"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community Network",
      description: "Connect with local businesses and customers across J&K",
      color: "purple"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Trust Scorecard",
      description: "Build reputation and unlock rewards with our scoring system",
      color: "yellow"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Businesses", icon: <Globe className="w-6 h-6" /> },
    { number: "10K+", label: "Transactions", icon: <Zap className="w-6 h-6" /> },
    { number: "98%", label: "Trust Score", icon: <Award className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <CheckCircle className="w-6 h-6" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + onboardingSlides.length) % onboardingSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Modern Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">TG</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">TrueGrow</span>
                <div className="text-xs text-gray-500 font-medium">Digital Kashmir</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">About</a>
              <a href="#community" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Community</a>
            </div>
            <Button 
              onClick={() => navigate('/role-selection')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100/80 backdrop-blur-sm text-green-800 border-green-200/50 px-4 py-2 text-sm font-medium">
              <MapPin className="w-4 h-4 mr-2" />
              Proudly serving Jammu & Kashmir
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Digitize Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-pulse">
                Local Business
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary platform for pesticide, fertilizer, and agricultural supply businesses. 
              <span className="font-semibold text-green-600">Manage billing, inventory, payments</span> and build unshakeable trust in your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={() => navigate('/role-selection')}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-600/30 text-green-600 hover:bg-green-50 px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:border-green-600"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                    <div className="flex items-center justify-center mb-3 text-green-600">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Onboarding Slides */}
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/60 backdrop-blur-lg border-white/20 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${onboardingSlides[currentSlide].gradient} opacity-10`}></div>
                  
                  <div className="relative z-10 text-center p-8">
                    <div className="flex justify-center mb-6 transform transition-all duration-500 hover:scale-110">
                      {onboardingSlides[currentSlide].icon}
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {onboardingSlides[currentSlide].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                      {onboardingSlides[currentSlide].description}
                    </p>
                    
                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                      {onboardingSlides[currentSlide].features.map((feature, index) => (
                        <Badge key={index} className="bg-white/80 backdrop-blur-sm text-gray-700 border-white/30 px-4 py-2 font-medium">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/40 backdrop-blur-sm p-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {onboardingSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-12 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-green-600 shadow-lg' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={prevSlide} size="sm" className="hover:bg-white/50">
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Grow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From intelligent billing to community building, TrueGrow provides comprehensive tools 
              to digitize and scale your agricultural business in the digital age.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <CardHeader className="text-center relative z-10">
                  <div className={`flex justify-center mb-6 p-4 rounded-2xl bg-${feature.color}-50 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-center text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
            Ready to Transform
            <br />
            <span className="text-green-200">Your Business?</span>
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the growing network of trusted businesses across Jammu & Kashmir. 
            Start your digital transformation journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => navigate('/role-selection')}
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-50 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">TG</span>
            </div>
            <div>
              <span className="text-3xl font-bold">TrueGrow</span>
              <div className="text-sm text-gray-400">Digital Kashmir Initiative</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            Digitizing local trade across the beautiful valleys of Jammu & Kashmir
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Support</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-500">
              © 2024 TrueGrow. Building trust, one transaction at a time. 🌱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
