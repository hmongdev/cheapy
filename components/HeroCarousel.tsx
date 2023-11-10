// use client directive when dealing with interactivities (swiping/carousel)
'use client'
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const heroImages = [
  { imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
  { imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
  { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
  { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
  { imgUrl: '/assets/images/hero-5.svg', alt: 'chair'},
]

const HeroCarousel = () => {
  return (
    <>
      <Carousel
        className="hero-carousel"
      showThumbs={false}
      infiniteLoop
      // autoPlay
      // interval={2000}  

      showArrows={false}
      showStatus={false}
      >
      {heroImages.map((image) => (<Image
        src={image.imgUrl}
        alt={image.alt}
        key={image.alt}
        height={484}
        width={484}
        className="object-contain"
        />))
        }
    </Carousel>
    
    <Image 
    src='assets/icons/hand-drawn-arrow.svg'
    alt="arrow"
    width={175}
    height={175}
    className="max-xl:hidden absolute -left-[15%] bottom-0 z-0/"
      />
      
    </>
  )
}

export default HeroCarousel