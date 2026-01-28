import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { beforeAfterCategories, beforeAfterCases } from '@/data/content'
import { ArrowRight } from 'lucide-react'

export function BeforeAfter() {
  const [activeTab, setActiveTab] = useState('eye')

  return (
    <section id="before-after" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2">BEFORE & AFTER</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            전후 사진
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            실제 시술 결과를 확인하고<br />
            자신에게 맞는 시술을 찾아보세요.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
            {beforeAfterCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {beforeAfterCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beforeAfterCases[category.id as keyof typeof beforeAfterCases].map((item) => (
                  <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="flex">
                          <div className="w-1/2 h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                            <span className="text-gray-500 font-medium">BEFORE</span>
                            <Badge 
                              variant="secondary" 
                              className="absolute top-2 left-2 bg-black/50 text-white text-xs"
                            >
                              Before
                            </Badge>
                          </div>
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div className="w-1/2 h-48 bg-gradient-to-br from-primary/20 to-purple-200/30 flex items-center justify-center relative">
                            <span className="text-primary/60 font-medium">AFTER</span>
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
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-8">
          * 모든 시술 결과는 개인차가 있을 수 있습니다.
        </p>
      </div>
    </section>
  )
}
