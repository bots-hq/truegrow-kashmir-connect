
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Camera, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RegisterShopOwner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    shopName: "",
    shopLocation: "",
    aadharNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    shopDescription: "",
    shopLogo: null as File | null,
    ownerPhoto: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.mobileNumber || !formData.shopName || !formData.shopLocation || !formData.aadharNumber || !formData.email || !formData.password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!formData.ownerPhoto) {
      toast({
        title: "Photo Required",
        description: "Owner/manager photo is mandatory",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Welcome to TrueGrow! Your shop owner account has been created.",
    });
    
    navigate('/dashboard/shop-owner');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/role-selection')}
            className="text-green-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900">Shop Owner Registration</CardTitle>
            <CardDescription>
              Step {step} of 2 - {step === 1 ? "Basic Information" : "Shop Profile Setup"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Your login ID"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <Input
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      placeholder="Your shop name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopLocation">Shop Location *</Label>
                    <Input
                      id="shopLocation"
                      name="shopLocation"
                      value={formData.shopLocation}
                      onChange={handleInputChange}
                      placeholder="Village/Town name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Card Number *</Label>
                  <Input
                    id="aadharNumber"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    placeholder="12-digit Aadhar number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create strong password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNextStep}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  Continue to Profile Setup
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopDescription">Shop Description (Optional)</Label>
                    <Textarea
                      id="shopDescription"
                      name="shopDescription"
                      value={formData.shopDescription}
                      onChange={handleInputChange}
                      placeholder="Brief description of your shop and services"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Shop Logo (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload shop logo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'shopLogo')}
                          className="hidden"
                          id="shopLogo"
                        />
                        <Label htmlFor="shopLogo" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                        {formData.shopLogo && (
                          <p className="text-xs text-green-600 mt-2">
                            {formData.shopLogo.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Owner/Manager Photo *</Label>
                      <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                        <Camera className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Mandatory photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'ownerPhoto')}
                          className="hidden"
                          id="ownerPhoto"
                        />
                        <Label htmlFor="ownerPhoto" className="cursor-pointer">
                          <Button variant="outline" size="sm" className="border-red-300 text-red-600" asChild>
                            <span>Choose Photo</span>
                          </Button>
                        </Label>
                        {formData.ownerPhoto && (
                          <p className="text-xs text-green-600 mt-2">
                            {formData.ownerPhoto.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Complete Registration
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          By registering, you agree to TrueGrow's Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default RegisterShopOwner;
