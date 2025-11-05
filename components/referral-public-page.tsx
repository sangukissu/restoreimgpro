'use client'

import Link from "next/link"
import { 
  Users, 
  Share2, 
  CheckCircle, 
  Target, 
  Award, 
  Zap, 
  Shield, 
  Star, 
  ChevronRight, 
  Gift,
  Sparkles
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FramerButton } from "@/components/ui/framer-button"
import { PointerHighlight } from "@/components/pointer-highlight"

export default function ReferralPublicPage() {
  const successStories = [
    {
      name: "Sarah Johnson",
      role: "Photography Enthusiast",
      restorations: "12 free restorations",
      period: "in 6 months",
      quote: "I've helped so many friends restore their family photos and earned free restorations for my own collection. It's amazing!"
    },
    {
      name: "Mike Chen",
      role: "Family Historian",
      restorations: "8 free restorations",
      period: "in 3 months",
      quote: "Sharing this service with my extended family has been incredible. Everyone gets their memories restored!"
    },
    {
      name: "Lisa Rodriguez",
      role: "Community Leader",
      restorations: "20 free restorations",
      period: "in 8 months",
      quote: "I love helping people in my community preserve their precious memories while building my own restoration credits."
    }
  ]

  return (
    <div className="bg-white">
      <Header />
      

      <section className="relative pb-12 overflow-hidden min-h-screen">
     <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
          }}
        />
      <div className="px-4 py-12 pt-40 max-w-[85rem] 2xl:max-w-[100rem] mx-auto text-center" >
      
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              BringBack AI Refferal Program
            </div>
            <h1 className="  text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight">
                            Share & Get Free Restorations
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
  Refer friends to our photo restoration service and both of you get free restorations! 
              You get 2 free restorations, your friend gets 1 free restoration when they make their first purchase.
                      </p>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <Link href="/dashboard">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full sm:w-auto">
            Get Free Restorations
          </FramerButton>
            </Link>
          
          </div>
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar1.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar2.webp" alt="User" />  
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar3.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar6.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar5.webp" alt="User" />
                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">17+</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">Loved by Everyone</p>
          </div>
          
        
        </div>
        </div>
       
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-gray-500 italic text-lg mb-4">Our Process, Explained</p>
            <h2 className=" text-4xl lg:text-5xl text-black">Share & Earn Free Restorations in 3 Simple Steps</h2>
          </div>

          {/* Process Cards */}
          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Step 1 */}
              <div className="bg-white lg:mt-8 rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform -rotate-2 sm:-rotate-5 relative z-10">
                <div className="mb-6">
                  <span className="text-6xl font-bold text-black">1</span>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Get Your Referral Link</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sign up and get your unique referral link. Share it with friends and family who need photo restoration. It's completely free to join and start referring.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform rotate-2 sm:rotate-5  relative z-10">
                <div className="mb-6">
                  <span className="text-6xl font-bold text-black">2</span>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Friend Makes Purchase</h3>
                <p className="text-gray-600 leading-relaxed">
                  When your friend uses your referral link and makes their first purchase, the referral system activates. They get amazing photo restoration service plus a bonus free restoration.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border-6 border-gray-200 bg-transparent backdrop-blur transform -rotate-2 sm:-rotate-5 relative z-10">
                <div className="mb-6">
                  <span className="text-6xl font-bold text-black">3</span>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Both Get Rewards</h3>
                <p className="text-gray-600 leading-relaxed">
                  You receive 2 free restorations added to your account, and your friend gets 1 free restoration. Use them anytime to restore your precious memories - no expiration date.
                </p>
               
              </div>
            </div>
           
          

          
          </div>

       
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className=" text-3xl sm:text-4xl lg:text-5xl text-black mb-6">
              Why Share Our Service?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Help friends preserve memories while building your own collection of free restorations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Free Restorations</h3>
              <p className="text-gray-600">Earn 2 free restorations for every successful referral</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Help Friends</h3>
              <p className="text-gray-600">Your friends get 1 free restoration when they join</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Instant Rewards</h3>
              <p className="text-gray-600">Credits are added immediately after purchase</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">No Expiration</h3>
              <p className="text-gray-600">Your free restoration credits never expire</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Unlimited Referrals</h3>
              <p className="text-gray-600">No limit on how many friends you can refer</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Quality Service</h3>
              <p className="text-gray-600">Share a service you can be proud of</p>
            </div>
          </div>
        </div>
      </section>

    

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className=" text-4xl lg:text-5xl text-black mb-6">
            Ready to Start Sharing?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are helping friends restore memories while earning free restorations for themselves.
          </p>
          
          <div className="flex flex-col gap-4 justify-center items-center">
            
             <Link href="/login">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full sm:w-auto">
            Get Your Referral Link
          </FramerButton>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 mt-8">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              2 free restorations per referral
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
              Help friends & family
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
              99.8% satisfaction rate
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}