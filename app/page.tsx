import HeroCarousel from "@/components/HeroCarousel"
import SearchBar from "@/components/SearchBar"
import Image from "next/image"

const Home = () => {
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Best Prices Start Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
              width={16}  
              height={16}  
              />
            </p>
            
            <h1 className="head-text">
              Find the Cheapest Prices @
              <span className="text-green-500"> Cheapy</span>
            </h1>
            
            <h2 className="mt-6">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </h2>
            
            <SearchBar />
          </div>
          
          <HeroCarousel />
      </div>
      </section>
      
      <section className="trending-section">
        <h2 className="section-text/">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {['Apple iPhone 15', 'Book', 'Sneakers'].map((product) => (
            <div>{product}</div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home