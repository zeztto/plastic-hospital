import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { doctors } from '@/data/content'
import { Award, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Doctors() {
  const { ref, isVisible } = useScrollReveal()
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedDoctor(prev => prev === id ? null : id)
  }

  return (
    <section id="doctors" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Medical Team</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            의료진 소개
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            풍부한 경험과 전문성을 갖춘 의료진이<br />
            안전하고 만족스러운 결과를 위해 최선을 다합니다.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {doctors.map((doctor, index) => {
            const isExpanded = expandedDoctor === doctor.id
            const visibleCareers = isExpanded ? doctor.careers : doctor.careers.slice(0, 3)
            const hasMore = doctor.careers.length > 3

            return (
              <Card 
                key={doctor.id} 
                className={`overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-purple-200/30 overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={`${doctor.name} ${doctor.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling
                        if (fallback instanceof HTMLElement) {
                          fallback.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center absolute inset-0">
                      <GraduationCap className="w-16 h-16 text-primary/60" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {doctor.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">{doctor.title}</Badge>
                    </div>
                    <p className="text-primary font-medium text-sm mb-3">
                      {doctor.specialty}
                    </p>
                    <ul className="space-y-1.5">
                      {visibleCareers.map((career, ci) => (
                        <li 
                          key={ci}
                          className="flex items-start gap-1.5 text-xs text-muted-foreground"
                        >
                          <Award className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{career}</span>
                        </li>
                      ))}
                    </ul>
                    {hasMore && (
                      <button
                        onClick={() => toggleExpand(doctor.id)}
                        className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                      >
                        {isExpanded ? (
                          <>접기 <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>더보기 <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
