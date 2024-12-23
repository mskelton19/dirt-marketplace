import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    title: "Interactive Dashboard",
    description: "Access all your listings and marketplace activity in one centralized location. Our user-friendly dashboard provides a comprehensive overview of your account, with the ability to sort and filter listings for efficient management.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-12-22%20at%207.16.27%20PM-jcbExSHElwGykAmfKF7dGE9T1bSwgA.png"
  },
  {
    title: "Seamless Material Posting",
    description: "Effortlessly add new materials with our user-friendly posting tool. Specify the type of material, quantity, and location quickly and easily, either by entering an address or selecting a spot on the map. Once posted, your materials are instantly visible to other professionals on their dashboards, making it simple for them to contact you.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-12-22%20at%207.13.22%20PM-RIzEoc1BVkJKnxCXVcRobVWgy5UwpE.png"
  },
  {
    title: "My Listings View",
    description: "Easily manage all your material postings in one place. Switch between a detailed list view and an interactive map view to visualize the locations and details of your postings. Edit, delete, or mark them as completed once they have been purchased or traded by another company, ensuring your listings are always up-to-date.",
    images: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-12-22%20at%208.24.09%20PM-ReXsFYxoRMzvb9YFbKGRhQPpComZle.png",
        alt: "My Listings List View"
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-12-22%20at%208.24.46%20PM-XrKGCrxPl0vJBrAvzVW3uKJtMNOT5h.png",
        alt: "My Listings Map View"
      }
    ]
  },
  {
    title: "Active Listings View",
    description: "Explore all active listings in the marketplace. Switch between a comprehensive list view and a dynamic map view to find materials that meet your needs.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Distance Calculation",
    description: "See how far materials are from your location. Our platform automatically calculates and displays distances to help you make informed decisions about transportation and logistics.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Material Variety",
    description: "Find a wide range of construction materials including soil, gravel, sand, and concrete. Our platform caters to diverse project needs with comprehensive material listings.",
    image: "/placeholder.svg?height=400&width=600"
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Dirt Marketplace Features</h1>
        <p className="text-xl text-gray-700 text-center mb-12">Discover the powerful tools and features that make managing construction materials effortless</p>
        
        <div className="grid gap-12 mt-12">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">{feature.title}</h2>
                <p className="text-gray-700 mb-4">{feature.description}</p>
              </div>
              <div className="md:w-1/2">
                {'images' in feature ? (
                  <div className="grid gap-4">
                    {feature.images.map((img, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={img.src}
                        alt={img.alt}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                ) : (
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Ready to get started?</h2>
          <p className="text-gray-700 mb-8">Join Dirt Marketplace today and streamline your construction material management.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

