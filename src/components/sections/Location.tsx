import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { clinicInfo, sectionImages } from '@/data/content'
import { MapPin, Phone, Clock, Train, ExternalLink } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Location() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="location" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Location</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            오시는 길
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            강남역 인근 편리한 위치에서<br />
            여러분을 기다리고 있습니다.
          </p>
        </div>

        <div 
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="h-[300px] lg:h-full min-h-[400px] rounded-xl overflow-hidden relative group">
            <img 
              src={sectionImages.location}
              alt="병원 위치 - 강남 지역"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 -z-10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">지도 영역</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {clinicInfo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {clinicInfo.address}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(clinicInfo.address)}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    길찾기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">주소</h4>
                    <p className="text-muted-foreground text-sm">{clinicInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">전화번호</h4>
                    <a 
                      href={`tel:${clinicInfo.phone}`}
                      className="text-primary hover:underline font-medium text-lg"
                    >
                      {clinicInfo.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">진료시간</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground text-sm">{clinicInfo.hours.weekday}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground text-sm">{clinicInfo.hours.saturday}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm text-destructive">{clinicInfo.hours.sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Train className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">대중교통</h4>
                    <p className="text-muted-foreground text-sm">{clinicInfo.subway}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
