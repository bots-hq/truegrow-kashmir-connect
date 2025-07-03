
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera,
  MapPin,
  Star,
  Store,
  User,
  Clock,
  Plus
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");

  const posts = [
    {
      id: 1,
      author: "Himalaya Agro Store",
      userType: "shop",
      avatar: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=100&h=100&fit=crop",
      location: "Srinagar, J&K",
      time: "2 hours ago",
      content: "🌱 New arrivals! Premium organic fertilizers now available. Special discount for bulk orders this week!",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=300&fit=crop",
      likes: 24,
      comments: 8,
      tags: ["#OrganicFertilizer", "#BulkDiscount", "#NewArrivals"]
    },
    {
      id: 2,
      author: "Rajesh Kumar",
      userType: "customer",
      avatar: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&h=100&fit=crop",
      location: "Baramulla, J&K",
      time: "5 hours ago",
      content: "Excellent service from Kashmir Seeds & Supplies! Got my wheat seeds delivered on time and quality is outstanding. Highly recommended! 🌾",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=500&h=300&fit=crop",
      likes: 15,
      comments: 4,
      tags: ["#QualitySeeds", "#FastDelivery", "#Recommended"]
    },
    {
      id: 3,
      author: "Valley Fertilizer Hub",
      userType: "shop",
      avatar: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=100&h=100&fit=crop",
      location: "Anantnag, J&K",
      time: "1 day ago",
      content: "🎉 Grand Opening Sale! 20% off on all pesticides and fertilizers. Free home delivery within 10km radius. Visit us today!",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=500&h=300&fit=crop",
      likes: 32,
      comments: 12,
      tags: ["#GrandOpening", "#Sale", "#FreeDelivery"]
    },
    {
      id: 4,
      author: "Priya Sharma",
      userType: "customer",
      avatar: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=100&h=100&fit=crop",
      location: "Jammu, J&K",
      time: "2 days ago",
      content: "Looking for good quality apple saplings for my orchard. Any recommendations for trusted suppliers in Jammu region?",
      likes: 8,
      comments: 15,
      tags: ["#AppleSaplings", "#OrchardFarming", "#Recommendations"]
    }
  ];

  const trendingTags = [
    "#OrganicFertilizer", "#SeedQuality", "#LocalSuppliers", "#BulkOrders", 
    "#FreeDelivery", "#QualityProducts", "#TrustedShops", "#FarmingTips"
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <AppSidebar userRole="customer" />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
                  <p className="text-gray-600">Connect with farmers and suppliers across J&K</p>
                </div>
              </div>
            </div>

            {/* Create Post */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 mb-8">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&h=100&fit=crop" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share updates, ask questions, or showcase your products..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-20 mb-4 border-purple-200"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-purple-200">
                          <Camera className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="outline" size="sm" className="border-purple-200">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location
                        </Button>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Feed Posts */}
              <div className="lg:col-span-3 space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-purple-100">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              post.userType === 'shop' ? 'bg-green-500' : 'bg-blue-500'
                            }`}>
                              {post.userType === 'shop' ? 
                                <Store className="w-3 h-3 text-white" /> : 
                                <User className="w-3 h-3 text-white" />
                              }
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{post.author}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {post.location}
                              <span className="mx-2">•</span>
                              <Clock className="w-3 h-3 mr-1" />
                              {post.time}
                            </div>
                          </div>
                        </div>
                        <Badge variant={post.userType === 'shop' ? 'default' : 'secondary'}>
                          {post.userType === 'shop' ? 'Shop Owner' : 'Customer'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                      
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post image"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-purple-600 border-purple-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-6">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                            <Heart className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Tags */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {trendingTags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-purple-50 text-purple-600 border-purple-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Connections */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Suggested Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Green Valley Seeds", type: "shop", rating: 4.8 },
                        { name: "Mountain Agro", type: "shop", rating: 4.6 },
                        { name: "Amit Singh", type: "customer", rating: 4.7 }
                      ].map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{suggestion.name}</p>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                <span className="text-xs text-gray-500">{suggestion.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CommunityFeed;
