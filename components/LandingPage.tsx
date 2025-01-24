'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Building2, Truck } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="font-bold text-xl text-primary">
              Dirt Marketplace
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
                Transform Your Construction Material Management
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect directly with buyers and sellers of construction materials. Save time, reduce waste, and maximize your resources with our intelligent marketplace platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Request Demo</Link>
                </Button>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Trusted by construction companies across the country
                </p>
                <div className="mt-6 flex items-center gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-[120px] h-[30px] bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative lg:h-[600px]">
              <Image
                src="/placeholder.svg"
                alt="Platform preview"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
              <Card className="absolute -bottom-6 -left-6 p-4 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Average Savings</p>
                    <p className="text-2xl font-bold">23%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Everything you need to manage construction materials
            </h2>
            <p className="text-xl text-muted-foreground">
              Our platform streamlines the entire process of buying, selling, and managing construction materials.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Material Marketplace",
                description: "Connect with verified buyers and sellers in your area. Find the best deals on materials you need."
              },
              {
                icon: Truck,
                title: "Logistics Management",
                description: "Coordinate deliveries and pickups efficiently. Track your materials in real-time."
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Get insights into your material usage, costs, and savings. Make data-driven decisions."
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your material management?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of construction professionals who are already saving time and money with Dirt Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-primary">Dirt Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Transforming construction material management for the digital age.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Case Studies", "Reviews"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Press"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Support", "API", "Contact"]
              }
            ].map((column, i) => (
              <div key={i}>
                <h3 className="font-bold mb-4 text-primary">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dirt Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

