import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function Hero() {
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

  return (
    <section 
      id="hero" 
      className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-medium mb-4 animate-fade-in-up opacity-0 animation-delay-100">
            강남 프리미엄 성형외과
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up opacity-0 animation-delay-200">
            자연스러운 아름다움을<br />디자인합니다
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up opacity-0 animation-delay-300">
            20년 경력의 성형외과 전문의가<br className="md:hidden" />
            당신만의 아름다움을 찾아드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 animation-delay-400">
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
              className="text-lg px-8 py-6"
            >
              시술 둘러보기
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  )
}
