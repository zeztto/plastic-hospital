import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar, Send, CheckCircle } from 'lucide-react'
import { useBookings } from '@/contexts/BookingContext'
import { PROCEDURES, TIME_SLOTS } from '@/types/booking'

export function Booking() {
  const { create } = useBookings()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    procedure: '',
    date: '',
    time: '',
    message: '',
    agreed: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create({
      name: formData.name,
      phone: formData.phone,
      procedure: formData.procedure,
      date: formData.date,
      time: formData.time,
      message: formData.message,
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
          <p className="text-primary font-medium mb-2">CONSULTATION</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            상담 예약
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            무료 상담을 통해 나에게 맞는<br />
            맞춤 시술을 추천받으세요.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="message">상담 내용</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="궁금하신 사항이나 상담받고 싶은 내용을 적어주세요."
                    rows={4}
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
                    className="mt-1"
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
    </section>
  )
}
