"use client"

import { useState, useEffect } from "react"
import ReferralDashboard from "@/components/referral-dashboard"

import { toast } from "sonner"

interface ReferralClientProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  isPaymentSuccess: boolean
}

export default function ReferralClient({ user, initialCredits }: ReferralClientProps) {
  const [credits, setCredits] = useState(initialCredits)


  return (
    <>
      <ReferralDashboard 
        user={user} 
        initialCredits={credits} 
      />


 
    </>
  )
}