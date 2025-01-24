'use client'
import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const plans = [
  {
    name: 'Free Version',
    price: '$0',
    period: 'forever',
    description: 'Get started with our basic features',
    features: [
      'Marketplace Access: Browse and engage with our entire marketplace.',
      'Standard Listing Visibility: Ensure your listings are visible to all users.',
      'Create Up to 3 Listings: Manage and promote up to 3 active listings at a time.',
      'Email Support: Get help and answers to your questions via email.',
      'Basic Analytics: Track essential metrics for your listings.',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Coming Soon',
    period: '',
    description: 'Everything in Free, plus:',
    features: [
      'Unlimited Active Listings: No restrictions on the number of listings you can create and manage.',
      'Enhanced Listing Visibility: Boost your listings to ensure maximum exposure.',
      'Map Listings Access: View and interact with listings on an interactive map.',
      'AI Matching (Coming Soon): Set preferences and let AI find the best matches for you.',
      'Priority Support: Receive top-tier support with faster response times.',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
    comingSoon: true,
  },
]

export default function PricingPlans() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, company }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage('Thank you for joining our waitlist!')
        setEmail('')
        setName('')
        setCompany('')
      } else {
        setSubmitMessage(data.error || 'An error occurred. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.')
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg overflow-hidden transition-all duration-300 ${
              plan.highlighted
                ? 'shadow-lg hover:shadow-xl bg-gradient-to-br from-accent/5 to-accent/10'
                : 'shadow-md hover:shadow-lg'
            }`}
          >
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-700 ml-2">{plan.period}</span>}
              </div>
              <p className="text-gray-700 mb-6">{plan.description}</p>
              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => {
                  const [title, description] = feature.split(': ');
                  return (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{title}:</span> {description}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {plan.name === 'Free Version' ? (
                <Link href="/signup" className="block">
                  <Button
                    className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 bg-primary hover:bg-primary/90"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 bg-accent hover:bg-accent/90"
                  onClick={() => setIsWaitlistOpen(true)}
                >
                  {plan.cta}
                </Button>
              )}
              {plan.comingSoon && (
                <div className="mt-4 flex items-center justify-center text-accent">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join the Pro Plan Waitlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company" className="text-right">
                  Company
                </label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
              </Button>
            </DialogFooter>
          </form>
          {submitMessage && (
            <p className={`mt-4 text-center ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
              {submitMessage}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

