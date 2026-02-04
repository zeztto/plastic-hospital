import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { heroImages } from '@/data/content'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Hero() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.2 })

  const scrollToBooking = () => {
    const element = document.querySelector('#booking')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToServices = () => {
    const element = document.querySelector('#services')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const stats = [
    { value: '22년+', label: '경력' },
    { value: '15,000+', label: '시술 건수' },
    { value: '전문의 4명', label: '의료진' },
    { value: '98%', label: '만족도' },
  ]

  return (
    <section 
      id="hero" 
      className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImages.main})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <p className="text-white/90 font-medium mb-4 text-sm tracking-widest uppercase animate-fade-in-up opacity-0 animation-delay-100">
            강남 프리미엄 성형외과
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up opacity-0 animation-delay-200">
            자연스러운 아름다움을<br />디자인합니다
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up opacity-0 animation-delay-300">
            22년 경력의 성형외과 전문의가<br className="md:hidden" />
            당신만의 아름다움을 찾아드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 animation-delay-400">
            <Button 
              size="lg" 
              onClick={scrollToBooking}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              무료 상담 예약하기
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToServices}
              className="text-lg px-8 py-6 border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              시술 둘러보기
            </Button>
          </div>
        </div>

        <div 
          ref={statsRef}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 text-center transition-all duration-700 ${
                statsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70 hover:text-white transition-colors"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  )
}
