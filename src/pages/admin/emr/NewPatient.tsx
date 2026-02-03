import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEMR } from '@/contexts/EMRContext'
import { BLOOD_TYPES, type Gender } from '@/types/emr'
import { ArrowLeft, UserPlus } from 'lucide-react'

export function NewPatient() {
  const { createPatient } = useEMR()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [bloodType, setBloodType] = useState('')
  const [allergiesText, setAllergiesText] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !birthDate || !gender || !phone) return

    const allergies = allergiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)

    const patient = createPatient({
      name,
      birthDate,
      gender,
      phone,
      address,
      bloodType,
      allergies,
      medicalHistory,
    })

    navigate(`/emr/patients/${patient.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/emr/patients">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            신규 환자 등록
          </h1>
          <p className="text-muted-foreground mt-1">
            새로운 환자 정보를 입력합니다.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5 text-primary" />
            환자 정보 입력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  이름 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  생년월일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  성별 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="서울시 강남구..."
                />
              </div>

              <div className="space-y-2">
                <Label>혈액형</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">알레르기</Label>
              <Textarea
                id="allergies"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="없으면 비워두세요. 여러 개인 경우 쉼표로 구분 (예: 페니실린, 아스피린)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">기왕력/병력</Label>
              <Textarea
                id="medicalHistory"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="특이사항이 없으면 비워두세요"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">
                <UserPlus className="w-4 h-4 mr-2" />
                환자 등록
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/emr/patients">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
