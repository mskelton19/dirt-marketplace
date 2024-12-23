import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    title: "Seamless Material Posting",
    description: "Easily list your excess construction materials or find exactly what you need. Our intuitive interface allows for quick and detailed listings, ensuring that your materials find the right buyer or that you source the perfect materials for your project.",
    images: [
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seamless-material-posting-IVdAF3rNDZ7s0VLiIzNZc7C4BPsswM.png", alt: "Seamless Material Posting Interface" },
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seamless-material-posting-2-Rl9Iy9Ue9Hy5Hy1Hy1Hy1Hy1Hy.png", alt: "Material Listing Form" }
    ]
  },
  {
    title: "Interactive Map View",
    description: "Visualize material locations with our interactive map feature. Quickly identify nearby opportunities, evaluate logistics, and make informed decisions based on material proximity to your project sites.",
    images: [
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/interactive-map-view-xNdzOzxRUZHBj5TpImTmVCmdbqTyVu.png", alt: "Interactive Map Overview" },
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/interactive-map-view-2-Rl9Iy9Ue9Hy5Hy1Hy1Hy1Hy1Hy1Hy.png", alt: "Map with Material Pins" }
    ]
  },
  {
    title: "Real-Time Messaging",
    description: "Communicate directly with buyers or sellers through our built-in messaging system. Negotiate terms, ask questions, and finalize deals all within the platform, streamlining the entire transaction process.",
    images: [
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/real-time-messaging-fGd3HdmB8uTbIVNpRuCxczvXgz0L8u.png", alt: "Messaging Interface" },
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/real-time-messaging-2-Rl9Iy9Ue9Hy5Hy1Hy1Hy1Hy1Hy1Hy.png", alt: "Chat History" }
    ]
  },
  {
    title: "Active Listings View",
    description: "Keep track of your current listings and their status with our Active Listings feature. Easily manage, update, or remove listings as needed, ensuring that your inventory is always up-to-date and accurately represented.",
    images: [
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/active-listings-view-GTODdMNhm9cS3rD2hCE0aWVQZj7o8e.png", alt: "Active Listings Dashboard" },
      { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/active-listings-view-2-Rl9Iy9Ue9Hy5Hy1Hy1Hy1Hy1Hy1Hy.png", alt: "Listing Management Interface" }
    ]
  }
]

const newAndMoreFeature = {
  title: "And More Features",
  description: "Take advantage of our powerful platform capabilities including advanced sorting and filtering options to find exactly what you need, real-time editing of your listings, distance calculations for better logistics planning, and coming soon - AI-powered matching to connect you with the perfect material trading partners. Our comprehensive suite of tools is designed to make construction material management as efficient as possible.",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-12-23%20at%203.19.31%20PM-EYfmywVLTUKInPQSPWREPc1wGI0fW5.png"
}

// Add the newAndMoreFeature to the features array
features.push(newAndMoreFeature)

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
                {('images' in feature) ? (
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

