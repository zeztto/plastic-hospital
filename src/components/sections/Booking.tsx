import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar, Send, CheckCircle, Check, Phone } from 'lucide-react'
import { useBookings } from '@/contexts/BookingContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { clinicInfo } from '@/data/content'
import {
  PROCEDURES,
  TIME_SLOTS,
  ACQUISITION_SOURCES,
  ACQUISITION_SOURCE_LABELS,
  type AcquisitionSource,
} from '@/types/booking'

function getUtmParams(): { source: string; medium: string; campaign: string } {
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
  }
}

const benefits = [
  '1:1 맞춤 상담',
  '전문의 직접 상담',
  '상담 비용 무료',
  '당일 시술 가능',
]

export function Booking() {
  const { create } = useBookings()
  const { ref, isVisible } = useScrollReveal()
  const [utmParams] = useState(() => getUtmParams())
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    procedure: '',
    date: '',
    time: '',
    message: '',
    source: '' as AcquisitionSource | '',
    agreed: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sourceValue: AcquisitionSource = formData.source || 'other'

    let medium = utmParams.medium
    if (!medium) {
      const mediumMap: Partial<Record<AcquisitionSource, string>> = {
        naver: 'search',
        instagram: 'social',
        youtube: 'video',
        kakao: 'message',
        referral: 'word_of_mouth',
        blog: 'content',
        ad: 'paid',
        walk_in: 'direct',
        other: 'unknown',
      }
      medium = mediumMap[sourceValue] || 'unknown'
    }

    create({
      name: formData.name,
      phone: formData.phone,
      procedure: formData.procedure,
      date: formData.date,
      time: formData.time,
      message: formData.message,
      source: sourceValue,
      medium,
      campaign: utmParams.campaign,
    })
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        phone: '',
        procedure: '',
        date: '',
        time: '',
        message: '',
        source: '',
        agreed: false,
      })
    }, 4000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <section id="booking" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">Consultation</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            상담 예약
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            무료 상담을 통해 나에게 맞는<br />
            맞춤 시술을 추천받으세요.
          </p>
        </div>

        <div 
          ref={ref}
          className={`max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">무료 상담</h3>
            <p className="text-muted-foreground mb-6">
              부담 없이 전문의와 상담하세요.<br />
              최적의 시술 계획을 제안드립니다.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-white rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">전화 상담도 가능합니다</p>
              <a 
                href={`tel:${clinicInfo.phone}`}
                className="flex items-center gap-2 text-primary font-bold text-lg hover:underline"
              >
                <Phone className="w-5 h-5" />
                {clinicInfo.phone}
              </a>
            </div>
          </div>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                상담 예약 신청
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    예약 신청이 완료되었습니다
                  </h3>
                  <p className="text-muted-foreground">
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="010-1234-5678"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procedure">관심 시술 *</Label>
                    <select
                      id="procedure"
                      name="procedure"
                      value={formData.procedure}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">시술을 선택해주세요</option>
                      {PROCEDURES.map((proc) => (
                        <option key={proc} value={proc}>
                          {proc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">희망 상담일 *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        min="2026-02-06"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">희망 시간 *</Label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">시간을 선택해주세요</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">어떻게 알게 되셨나요?</Label>
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">선택해주세요 (선택사항)</option>
                      {ACQUISITION_SOURCES.map((src) => (
                        <option key={src} value={src}>
                          {ACQUISITION_SOURCE_LABELS[src]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">상담 내용</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="궁금하신 사항이나 상담받고 싶은 내용을 적어주세요."
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreed"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      required
                      className="mt-1 accent-primary"
                    />
                    <Label htmlFor="agreed" className="text-sm text-muted-foreground font-normal">
                      개인정보 수집 및 이용에 동의합니다. 수집된 정보는 상담 목적으로만 사용되며,
                      상담 완료 후 파기됩니다.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    예약 신청하기
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
