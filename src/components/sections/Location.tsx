import { Card, CardContent } from '@/components/ui/card'
import { clinicInfo } from '@/data/content'
import { MapPin, Phone, Clock, Train } from 'lucide-react'

export function Location() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2">LOCATION</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            오시는 길
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            강남역 인근 편리한 위치에서<br />
            여러분을 기다리고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="h-[300px] lg:h-full min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">지도 영역</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {clinicInfo.address}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-white/90 backdrop-blur">
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-foreground">
                    {clinicInfo.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {clinicInfo.address}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">주소</h4>
                    <p className="text-muted-foreground">{clinicInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">전화번호</h4>
                    <a 
                      href={`tel:${clinicInfo.phone}`}
                      className="text-primary hover:underline"
                    >
                      {clinicInfo.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">진료시간</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>{clinicInfo.hours.weekday}</li>
                      <li>{clinicInfo.hours.saturday}</li>
                      <li className="text-destructive">{clinicInfo.hours.sunday}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Train className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">대중교통</h4>
                    <p className="text-muted-foreground">{clinicInfo.subway}</p>
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
