import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { doctors } from '@/data/content'
import { Award, GraduationCap } from 'lucide-react'

export function Doctors() {
  return (
    <section id="doctors" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2">MEDICAL TEAM</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            의료진 소개
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            풍부한 경험과 전문성을 갖춘 의료진이<br />
            안전하고 만족스러운 결과를 위해 최선을 다합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-64 md:h-auto bg-gradient-to-br from-primary/20 to-purple-200/30 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/50 flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-primary/60" />
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {doctor.name}
                      </h3>
                      <Badge variant="secondary">{doctor.title}</Badge>
                    </div>
                    <p className="text-primary font-medium mb-4">
                      {doctor.specialty}
                    </p>
                    <ul className="space-y-2">
                      {doctor.careers.map((career, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{career}</span>
                        </li>
                      ))}
                    </ul>
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
