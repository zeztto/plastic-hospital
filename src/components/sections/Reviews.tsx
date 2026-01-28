import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { reviews } from '@/data/content'
import { Star, Quote } from 'lucide-react'

export function Reviews() {
  return (
    <section id="reviews" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2">REVIEWS</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            고객 후기
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            뷰티플 성형외과를 경험한<br />
            고객님들의 생생한 후기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="bg-white hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {review.procedure}
                  </Badge>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {review.content}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-medium text-foreground">{review.author}</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
