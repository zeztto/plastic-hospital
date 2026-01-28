import { Instagram, Youtube, MessageCircle } from 'lucide-react'
import { clinicInfo } from '@/data/content'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">{clinicInfo.name}</h3>
            <p className="text-background/70 mb-4">
              자연스러운 아름다움을 디자인하는<br />
              강남 프리미엄 성형외과
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">진료 안내</h4>
            <ul className="space-y-2 text-background/70">
              <li>{clinicInfo.hours.weekday}</li>
              <li>{clinicInfo.hours.saturday}</li>
              <li>{clinicInfo.hours.sunday}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-background/70">
              <li>
                <a href={`tel:${clinicInfo.phone}`} className="hover:text-background transition-colors">
                  {clinicInfo.phone}
                </a>
              </li>
              <li>{clinicInfo.address}</li>
              <li>{clinicInfo.subway}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
            <p>&copy; {currentYear} {clinicInfo.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-background transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-background transition-colors">이용약관</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
