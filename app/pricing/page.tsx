import PricingPlans from '@/components/PricingPlans'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-700 text-center mb-12">Start for free, upgrade when you're ready</p>
        
        <PricingPlans />
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interested in our Pro plan?</h2>
          <p className="text-gray-600 mb-8">Join our waitlist to be notified when it's available and get early access!</p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

