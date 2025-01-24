import Link from 'next/link'
import { Button } from "@/components/ui/button"
<<<<<<< HEAD

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Welcome to The Dirt Marketplace
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Connect directly with buyers and sellers of construction materials. Save time, reduce waste, and maximize your resources.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-white/10">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
=======
import { ArrowRight, Building2, Recycle, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Optimize Construction Material Exchange
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Connect directly with buyers and sellers. Save time and reduce waste in construction material management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 sm:px-10 sm:py-6 text-base sm:text-xl">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-accent hover:bg-accent hover:text-white border-2 border-accent px-6 py-3 sm:px-10 sm:py-6 text-base sm:text-xl transition-colors duration-200">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mt-8 sm:mt-16">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-4xl font-bold text-accent mb-1 sm:mb-2">40%</div>
              <p className="text-sm sm:text-base text-gray-600">Average cost savings</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-4xl font-bold text-accent mb-1 sm:mb-2">24hr</div>
              <p className="text-sm sm:text-base text-gray-600">Average listing time</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-4xl font-bold text-accent mb-1 sm:mb-2">1000+</div>
              <p className="text-sm sm:text-base text-gray-600">Active traders</p>
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
            </div>
          </div>
        </section>

        {/* Features Section */}
<<<<<<< HEAD
        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose The Dirt Marketplace?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Direct Connections",
                  description: "Connect directly with local buyers and sellers, cutting out the middleman."
                },
                {
                  title: "Reduce Waste",
                  description: "Find new homes for excess materials, reducing landfill waste."
                },
                {
                  title: "Save Time and Money",
                  description: "Quickly find the materials you need or sell your excess inventory."
                },
                {
                  title: "Eco-Friendly",
                  description: "Contribute to sustainable construction practices by reusing materials."
                },
                {
                  title: "User-Friendly Platform",
                  description: "Easy-to-use interface for listing, searching, and managing materials."
                },
                {
                  title: "Local Focus",
                  description: "Find materials and buyers in your local area, reducing transportation costs."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
=======
        <section className="bg-gray-50 py-12 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">Why Choose Dirt Marketplace?</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-accent/10 p-3 rounded-full mb-4">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Direct Trading</h3>
                  <p className="text-sm sm:text-base text-gray-700">Connect directly with verified construction material traders</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-accent/10 p-3 rounded-full mb-4">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Market Insights</h3>
                  <p className="text-sm sm:text-base text-gray-700">Real-time pricing and availability data</p>
                </div>
                <div className="flex flex-col items-center text-center sm:col-span-2 md:col-span-1">
                  <div className="bg-accent/10 p-3 rounded-full mb-4">
                    <Recycle className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Sustainable Practice</h3>
                  <p className="text-sm sm:text-base text-gray-700">Reduce waste and environmental impact</p>
                </div>
              </div>
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
            </div>
          </div>
        </section>

        {/* CTA Section */}
<<<<<<< HEAD
        <section className="bg-blue-700 text-white py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8">Join The Dirt Marketplace today and start connecting with buyers and sellers in your area.</p>
            <Button asChild size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white">
              <Link href="/signup">Get Started Now</Link>
            </Button>
=======
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">Ready to optimize your material trading?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">Join thousands of construction professionals already saving time and money.</p>
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 sm:px-10 sm:py-6 text-base sm:text-xl">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </Link>
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
          </div>
        </section>
      </main>

<<<<<<< HEAD
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">The Dirt Marketplace is revolutionizing how construction materials are bought and sold.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm hover:underline">About</Link></li>
                <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
                <li><Link href="/faq" className="text-sm hover:underline">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm hover:underline">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:underline">Twitter</a></li>
                <li><a href="#" className="text-sm hover:underline">LinkedIn</a></li>
                <li><a href="#" className="text-sm hover:underline">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} The Dirt Marketplace. All rights reserved.</p>
=======
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center text-sm sm:text-base text-gray-600">
            <p>&copy; 2023 Dirt Marketplace. All rights reserved.</p>
>>>>>>> 63ffb823f0b4f98385a7e458f9aa0fdd13a9d0aa
          </div>
        </div>
      </footer>
    </div>
  )
}

