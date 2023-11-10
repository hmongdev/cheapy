import Image from "next/image"
import Link from "next/link"

const navIcons = [
  {src: '/assets/icons/search.svg', alt: 'search'},
  {src: '/assets/icons/black-heart.svg', alt: 'black-heart'},
  {src: '/assets/icons/user.svg', alt: 'user'},
]

const NavBar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            alt="logo"
            width={27}
            height={27}
          src="/assets/icons/logo.svg"
          />
          
          <p className="nav-logo">
            <span className="text-green-600">Cheapy</span>
          </p>
            </Link>
          
          <div className="flex border-2 items-center gap-5">
            {navIcons.map((icon) => (
              <Image
                src={icon.src}
                key={icon.alt}
                alt={icon.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            ))}
          </div>
      </nav>
    </header>
  )
}

export default NavBar