import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { beforeAfterCategories, beforeAfterCases, sectionImages } from '@/data/content'
import { ArrowRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function BeforeAfter() {
  const [activeTab, setActiveTab] = useState('eye')
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="before-after" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Before &amp; After</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            전후 사진
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            실제 시술 결과를 확인하고<br />
            자신에게 맞는 시술을 찾아보세요.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted rounded-full p-1 gap-1">
            {beforeAfterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === category.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beforeAfterCases[activeTab as keyof typeof beforeAfterCases].map((item, index) => {
            const images = sectionImages.beforeAfter[activeTab as keyof typeof sectionImages.beforeAfter]
            const imageUrl = images?.[index]

            return (
              <Card 
                key={`${activeTab}-${item.id}`} 
                className={`overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="flex">
                      <div className="w-1/2 h-56 relative overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={`${item.procedure} Before`}
                            className="w-full h-full object-cover brightness-90 saturate-75"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 -z-10 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">BEFORE</span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2 bg-black/50 text-white text-xs"
                        >
                          Before
                        </Badge>
                      </div>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="w-1/2 h-56 relative overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={`${item.procedure} After`}
                            className="w-full h-full object-cover brightness-110 saturate-110"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-200/30 -z-10 flex items-center justify-center">
                          <span className="text-primary/60 font-medium">AFTER</span>
                        </div>
                        <Badge 
                          className="absolute top-2 right-2 bg-primary text-white text-xs"
                        >
                          After
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-1">
                      {item.procedure}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          * 이미지는 시술 이해를 돕기 위한 참고 이미지이며, 실제 결과는 개인차가 있을 수 있습니다.
        </p>
      </div>
    </section>
  )
}
