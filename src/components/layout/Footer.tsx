import { Instagram, Youtube, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clinicInfo } from '@/data/content'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToBooking = () => {
    const element = document.querySelector('#booking')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerNavItems = [
    { label: '시술소개', href: '#services' },
    { label: '의료진', href: '#doctors' },
    { label: '전후사진', href: '#before-after' },
    { label: '후기', href: '#reviews' },
    { label: '오시는길', href: '#location' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-primary to-purple-600 py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            지금 무료 상담을 예약하세요
          </h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            전문의와의 1:1 상담으로 나에게 맞는 시술을 찾아보세요.
          </p>
          <Button 
            size="lg" 
            onClick={scrollToBooking}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-semibold"
          >
            무료 상담 예약하기
          </Button>
        </div>
      </div>

      <footer className="bg-foreground text-background py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-3">{clinicInfo.name}</h3>
              <p className="text-background/60 mb-4 text-sm leading-relaxed">
                자연스러운 아름다움을 디자인하는 강남 프리미엄 성형외과.<br />
                22년 경력의 전문의가 안전하고 만족스러운 결과를 약속합니다.
              </p>
              <div className="flex gap-3 mb-6">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <nav className="flex flex-wrap gap-4">
                {footerNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href) }}
                    className="text-sm text-background/50 hover:text-background transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-background/80">진료 안내</h4>
              <ul className="space-y-2 text-background/60 text-sm">
                <li>{clinicInfo.hours.weekday}</li>
                <li>{clinicInfo.hours.saturday}</li>
                <li>{clinicInfo.hours.sunday}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-background/80">연락처</h4>
              <ul className="space-y-2 text-background/60 text-sm">
                <li>
                  <a href={`tel:${clinicInfo.phone}`} className="hover:text-background transition-colors font-medium">
                    {clinicInfo.phone}
                  </a>
                </li>
                <li>{clinicInfo.address}</li>
                <li>{clinicInfo.subway}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-background/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
              <p>&copy; {currentYear} {clinicInfo.name}. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-background transition-colors">개인정보처리방침</a>
                <a href="#" className="hover:text-background transition-colors">이용약관</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
