
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Shield, Users, TrendingUp, Smartphone, MapPin, Star, CheckCircle, 
  Zap, Globe, Award, Play, Quote, ChevronRight, Target, Lightbulb, 
  BarChart3, ShoppingCart, CreditCard, Package, MessageCircle, Clock,
  Sparkles, Leaf, Mountain, Heart, LogIn, UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Smart Analytics Dashboard",
      description: "Real-time insights into sales patterns, inventory levels, and customer behavior with AI-powered recommendations",
      color: "green",
      highlight: "AI-Powered"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Advanced Fraud Prevention",
      description: "Community-driven defaulter database with credit scoring and risk assessment for every transaction",
      color: "blue",
      highlight: "99.8% Secure"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Local Business Network",
      description: "Connect with verified businesses across Kashmir, share resources, and grow together as a community",
      color: "purple",
      highlight: "500+ Partners"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: "Trust Scorecard System",
      description: "Build your reputation through transparent ratings, unlock exclusive rewards and premium features",
      color: "yellow",
      highlight: "Verified Trust"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Quick Setup",
      description: "Register your business in under 3 minutes with our guided onboarding process",
      icon: <Target className="w-12 h-12 text-green-600" />,
      color: "green"
    },
    {
      step: "02", 
      title: "Smart Integration",
      description: "Connect your existing systems or start fresh with our intuitive business management tools",
      icon: <Lightbulb className="w-12 h-12 text-blue-600" />,
      color: "blue"
    },
    {
      step: "03",
      title: "Start Growing",
      description: "Begin processing transactions, building trust, and expanding your customer base immediately",
      icon: <TrendingUp className="w-12 h-12 text-purple-600" />,
      color: "purple"
    }
  ];

  const testimonials = [
    {
      name: "Ahmad Hassan",
      role: "Fertilizer Shop Owner, Srinagar",
      content: "TrueGrow transformed my business completely. The fraud protection saved me from 3 defaulters last month alone. My trust score is now 98% and customers prefer buying from me.",
      rating: 5,
      avatar: "AH",
      business: "Green Valley Fertilizers"
    },
    {
      name: "Priya Sharma",
      role: "Pesticide Distributor, Jammu",
      content: "The analytics feature is incredible! I can see exactly which products sell best in different seasons. My inventory management is now 70% more efficient.",
      rating: 5,
      avatar: "PS",
      business: "Sharma Agro Solutions"
    },
    {
      name: "Mohammad Rafiq",
      role: "Agricultural Supplies, Baramulla",
      content: "Being part of the TrueGrow network opened so many opportunities. I now supply to 15+ shops across Kashmir and the community support is amazing.",
      rating: 5,
      avatar: "MR",
      business: "Kashmir Agro Hub"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Businesses", icon: <Globe className="w-6 h-6" />, growth: "+23%" },
    { number: "50K+", label: "Transactions", icon: <Zap className="w-6 h-6" />, growth: "+156%" },
    { number: "98.7%", label: "Trust Score", icon: <Award className="w-6 h-6" />, growth: "+2.1%" },
    { number: "24/7", label: "Support", icon: <CheckCircle className="w-6 h-6" />, growth: "Always" }
  ];

  const tools = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Smart Billing",
      description: "Generate professional invoices with automatic calculations and tax handling"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Inventory Control",
      description: "Track stock levels, set automatic reorder points, and manage suppliers"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payment Tracking",
      description: "Monitor all transactions, track pending payments, and send automated reminders"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Customer Communication",
      description: "Stay connected with customers through integrated messaging and notifications"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(testimonialTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '6s'}}></div>
        
        {/* Kashmir-inspired mountain silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-100/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-24 fill-green-100/20">
            <path d="M0,60 C300,20 600,100 900,40 C1050,10 1150,80 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* Premium Header */}
      <header className="relative z-50 bg-white/90 backdrop-blur-md border-b border-white/30 sticky top-0 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">TG</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
                <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">TrueGrow</span>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 font-medium">Digital Kashmir</div>
                  <Mountain className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">Features</a>
              <a href="#process" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">Success Stories</a>
              <a href="#community" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">Community</a>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {profile?.full_name || user.email}</span>
                <Button 
                  onClick={() => navigate(profile?.role === 'shop_owner' ? '/dashboard/shop-owner' : '/dashboard/customer')}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mr-2"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={signOut}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:border-gray-400"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-sm text-green-800 border-green-200/50 px-6 py-3 text-base font-semibold rounded-full shadow-lg">
              <MapPin className="w-5 h-5 mr-2" />
              Proudly serving Jammu & Kashmir
              <Leaf className="w-4 h-4 ml-2 text-green-600" />
            </Badge>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Digitize Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent relative">
                Local Business
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30"></div>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary platform designed specifically for <span className="font-semibold text-green-600">pesticide, fertilizer, and agricultural supply businesses</span> in Kashmir. 
              Manage billing, inventory, payments while building unshakeable trust in your community with our cutting-edge fraud prevention system.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Button 
                onClick={() => navigate('/role-selection')}
                size="lg" 
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 rounded-2xl group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-600/40 text-green-600 hover:bg-green-50 px-12 py-5 text-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:border-green-600 rounded-2xl hover:scale-105"
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-white/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                      <div className="text-sm text-gray-600 font-medium mb-2">{stat.label}</div>
                      <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                        {stat.growth} growth
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Interactive Onboarding */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-xl border-white/30 shadow-2xl overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="relative h-[500px] flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${onboardingSlides[currentSlide].gradient} opacity-15`}></div>
                  
                  <div className="relative z-10 text-center p-12">
                    <div className="flex justify-center mb-8 transform transition-all duration-700 hover:scale-125">
                      {onboardingSlides[currentSlide].icon}
                    </div>
                    
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      {onboardingSlides[currentSlide].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-10 text-xl max-w-3xl mx-auto leading-relaxed">
                      {onboardingSlides[currentSlide].description}
                    </p>
                    
                    <div className="flex justify-center gap-6 mb-10 flex-wrap">
                      {onboardingSlides[currentSlide].features.map((feature, index) => (
                        <Badge key={index} className="bg-white/90 backdrop-blur-sm text-gray-700 border-white/40 px-6 py-3 font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 backdrop-blur-md p-8 flex items-center justify-between rounded-b-3xl">
                  <div className="flex gap-3">
                    {onboardingSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-16 h-3 rounded-full transition-all duration-500 ${
                          index === currentSlide ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-110' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setCurrentSlide((prev) => (prev - 1 + onboardingSlides.length) % onboardingSlides.length)} className="hover:bg-white/60 rounded-xl">
                      Previous
                    </Button>
                    <Button onClick={() => setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Process Section */}
      <section id="process" className="py-32 px-4 relative bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-6">
              Get Started in
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> 3 Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From registration to revenue growth, our streamlined process gets your business online in minutes, not days.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative group">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-6 z-0">
                    <ChevronRight className="absolute -right-2 -top-3 w-6 h-6 text-gray-400" />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br from-${step.color}-100 to-${step.color}-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                    {step.icon}
                  </div>
                  
                  <div className={`inline-block px-4 py-2 bg-${step.color}-100 text-${step.color}-800 rounded-full font-bold text-lg mb-4`}>
                    Step {step.step}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <Badge className="mb-6 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-8">
              Everything You Need to
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Grow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From AI-powered analytics to community-driven fraud prevention, TrueGrow provides comprehensive tools 
              to digitize and scale your agricultural business in the digital age.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white/80 backdrop-blur-md border-white/30 hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 overflow-hidden rounded-3xl relative">
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-${feature.color}-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className="absolute top-4 right-4">
                  <Badge className={`bg-${feature.color}-100 text-${feature.color}-700 text-xs px-2 py-1 rounded-full`}>
                    {feature.highlight}
                  </Badge>
                </div>
                <CardHeader className="text-center relative z-10 pt-8">
                  <div className={`flex justify-center mb-6 p-6 rounded-3xl bg-${feature.color}-50 w-fit mx-auto group-hover:scale-125 transition-transform duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors mb-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 px-6 pb-8">
                  <CardDescription className="text-center text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Tools Showcase */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Professional Tools for
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Modern Businesses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your operations with our comprehensive suite of business management tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tools.map((tool, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group hover:scale-105">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-6">
              What Our
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Community Says</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real businesses across Kashmir who've transformed their operations with TrueGrow.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-md border-white/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center relative">
                <Quote className="w-16 h-16 text-yellow-400 mx-auto mb-8 opacity-50" />
                
                <div className="mb-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                    <div className="text-sm text-green-600 font-medium">{testimonials[currentTestimonial].business}</div>
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-yellow-400 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Kashmir-inspired pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-40 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-3 text-base font-semibold rounded-full">
            <Sparkles className="w-5 h-5 mr-2" />
            Join the Revolution
          </Badge>
          
          <h2 className="text-6xl font-bold text-white mb-10 leading-tight">
            Ready to Transform
            <br />
            <span className="text-green-200">Your Business?</span>
          </h2>
          <p className="text-xl text-green-100 mb-16 max-w-4xl mx-auto leading-relaxed">
            Join the growing network of trusted businesses across Jammu & Kashmir. 
            Start your digital transformation journey today and be part of Kashmir's digital revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button 
              onClick={() => navigate('/role-selection')}
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-50 px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-2xl group"
            >
              <Zap className="w-6 h-6 mr-2 group-hover:animate-pulse" />
              Get Started Today
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/40 text-white hover:bg-white/20 px-12 py-5 text-xl font-semibold backdrop-blur-sm transition-all duration-300 rounded-2xl hover:scale-105"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Talk to Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">TG</span>
              </div>
              <div>
                <span className="text-4xl font-bold">TrueGrow</span>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  Digital Kashmir Initiative 
                  <Mountain className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Digitizing local trade across the beautiful valleys of Jammu & Kashmir, 
              one business at a time. Building trust, fostering growth, creating opportunities.
            </p>
            <div className="flex justify-center space-x-12 mb-12 flex-wrap">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Support Center</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Contact Us</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Careers</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 TrueGrow. Building trust, fostering growth, creating digital opportunities across Kashmir. 
              <span className="ml-2">🌱 Made with ❤️ in Kashmir</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
