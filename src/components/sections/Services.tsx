import { Card, CardContent } from '@/components/ui/card'
import { services } from '@/data/content'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { 
  Eye, 
  Sparkles, 
  CircleUser, 
  TrendingUp, 
  Heart, 
  Flame, 
  Sun, 
  Wand2,
  type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Eye,
  Sparkles,
  CircleUser,
  TrendingUp,
  Heart,
  Flame,
  Sun,
  Wand2,
}

export function Services() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Services</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            시술 소개
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            뷰티플 성형외과의 다양한 시술을 만나보세요.<br />
            풍부한 경험과 노하우로 최상의 결과를 약속드립니다.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon]
            return (
              <Card 
                key={service.id}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-border/50 hover:border-primary/30 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-purple-200/40 transition-all duration-300">
                    {Icon && <Icon className="w-9 h-9 text-primary" />}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
