import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { clinicInfo } from '@/data/content'

const navItems = [
  { label: '홈', href: '#hero' },
  { label: '시술소개', href: '#services' },
  { label: '의료진', href: '#doctors' },
  { label: '전후사진', href: '#before-after' },
  { label: '후기', href: '#reviews' },
  { label: '오시는길', href: '#location' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); scrollToSection('#hero') }}
            className="flex items-center gap-2"
          >
            <span className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-primary' : 'text-white'
            }`}>
              {clinicInfo.name}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href) }}
                className={`text-sm font-medium transition-colors duration-300 ${
                  scrolled 
                    ? 'text-muted-foreground hover:text-primary' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a 
              href={`tel:${clinicInfo.phone}`}
              className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                scrolled ? 'text-muted-foreground' : 'text-white/80'
              }`}
            >
              <Phone className="w-4 h-4" />
              {clinicInfo.phone}
            </a>
            <Button 
              onClick={() => scrollToSection('#booking')}
              className="bg-primary hover:bg-primary/90"
            >
              상담 예약
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={scrolled ? '' : 'text-white hover:bg-white/10'}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {clinicInfo.name}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(item.href) }}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="flex flex-col gap-4 pt-4 border-t">
                  <a 
                    href={`tel:${clinicInfo.phone}`}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Phone className="w-5 h-5" />
                    {clinicInfo.phone}
                  </a>
                  <Button 
                    onClick={() => scrollToSection('#booking')}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    상담 예약
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
