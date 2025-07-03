
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-green-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TG</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">TrueGrow</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600">
            Select how you want to use TrueGrow
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Shop Owner Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Store className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Shop Owner</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Manage your agricultural supply business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">GST-compliant billing & invoicing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Stock management & alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Payment tracking & analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Customer reports & insights</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/register/shop-owner')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg group-hover:bg-green-700"
              >
                Register as Shop Owner
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/login/shop-owner')}
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                Already have an account? Login
              </Button>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Customer</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Browse and purchase from local shops
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Browse products from multiple shops</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Secure payments & order tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Purchase history & due tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Trust scorecard & rewards</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/register/customer')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg group-hover:bg-blue-700"
              >
                Register as Customer
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/login/customer')}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Already have an account? Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Trusted by businesses across Jammu & Kashmir</p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
