import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { reviews } from '@/data/content'
import { Star, Quote } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Reviews() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-8 left-8 text-[200px] font-bold text-primary/[0.03] leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Reviews</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            고객 후기
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            뷰티플 성형외과를 경험한<br />
            고객님들의 생생한 후기입니다.
          </p>
        </div>

        <div 
          ref={ref}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <Card 
              key={review.id} 
              className={`min-w-[320px] snap-center lg:min-w-0 bg-white hover:shadow-xl transition-all duration-500 ${
                index === 0 ? 'lg:col-span-1 border-primary/20 shadow-md' : ''
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {review.procedure}
                  </Badge>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                  <p className="text-muted-foreground leading-relaxed pl-4 text-sm">
                    {review.content}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-200/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{review.author.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground text-sm">{review.author}</span>
                      {review.doctorName && (
                        <p className="text-xs text-muted-foreground">담당: {review.doctorName}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
