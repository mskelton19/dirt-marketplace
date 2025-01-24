import Link from 'next/link'
import { Button } from "@/components/ui/button"

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
            </div>
          </div>
        </section>

        {/* Features Section */}
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8">Join The Dirt Marketplace today and start connecting with buyers and sellers in your area.</p>
            <Button asChild size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white">
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

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
          </div>
        </div>
      </footer>
    </div>
  )
}

