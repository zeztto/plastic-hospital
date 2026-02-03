import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEMRAuth } from '@/contexts/EMRAuthContext'
import { ShieldCheck, AlertCircle } from 'lucide-react'

export function EMRLogin() {
  const { login } = useEMRAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/emr')
    } else {
      setError(true)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">EMR 로그인</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            뷰티플 성형외과 전자의무기록 시스템
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            의료진 전용 — 환자 진료 기록에 대한 접근 권한이 필요합니다
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emr-password">비밀번호</Label>
              <Input
                id="emr-password"
                type="password"
                placeholder="EMR 비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                비밀번호가 올바르지 않습니다.
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              로그인
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              데모 비밀번호: emr5678
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
