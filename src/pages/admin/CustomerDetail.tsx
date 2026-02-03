import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { useCustomers } from '@/contexts/CustomerContext'
import { useBookings } from '@/contexts/BookingContext'
import {
  CUSTOMER_GRADE_LABELS,
  CUSTOMER_GRADE_ORDER,
  MEMO_TYPE_LABELS,
  FOLLOW_UP_STATUS_LABELS,
  FOLLOW_UP_STATUS_COLORS,
  FOLLOW_UP_TYPE_LABELS,
  type CustomerGrade,
  type MemoType,
  type FollowUpStatus,
} from '@/types/customer'
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_COLORS,
} from '@/types/booking'
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Tag,
  MessageSquare,
  Clock,
  X,
  Plus,
  Trash2,
  CheckCircle,
  SkipForward,
} from 'lucide-react'
import { toast } from 'sonner'

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getCustomerById,
    updateGrade,
    addMemo,
    deleteMemo,
    addTag,
    removeTag,
    updateFollowUpStatus,
    getFollowUpsByCustomer,
  } = useCustomers()
  const { bookings } = useBookings()

  const customer = id ? getCustomerById(id) : undefined
  const customerFollowUps = id ? getFollowUpsByCustomer(id) : []
  const customerBookings = customer
    ? bookings.filter((b) => customer.bookingIds.includes(b.id))
    : []

  const [newTag, setNewTag] = useState('')
  const [memoContent, setMemoContent] = useState('')
  const [memoType, setMemoType] = useState<MemoType>('general')
  const [deleteTarget, setDeleteTarget] = useState<{ memoId: string } | null>(null)
  const [followUpNote, setFollowUpNote] = useState('')
  const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null)

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">고객 정보를 찾을 수 없습니다.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/customers')}>
          목록으로
        </Button>
      </div>
    )
  }

  const handleGradeChange = (grade: string) => {
    updateGrade(customer.id, grade as CustomerGrade)
    toast.success(`등급이 ${CUSTOMER_GRADE_LABELS[grade as CustomerGrade]}(으)로 변경되었습니다.`)
  }

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed) return
    if (customer.tags.includes(trimmed)) {
      toast.error('이미 존재하는 태그입니다.')
      return
    }
    addTag(customer.id, trimmed)
    setNewTag('')
    toast.success(`태그 "${trimmed}" 추가됨`)
  }

  const handleRemoveTag = (tag: string) => {
    removeTag(customer.id, tag)
    toast.success(`태그 "${tag}" 삭제됨`)
  }

  const handleAddMemo = () => {
    if (!memoContent.trim()) return
    addMemo(customer.id, { content: memoContent.trim(), type: memoType })
    setMemoContent('')
    toast.success('메모가 추가되었습니다.')
  }

  const handleDeleteMemo = () => {
    if (deleteTarget) {
      deleteMemo(customer.id, deleteTarget.memoId)
      setDeleteTarget(null)
      toast.success('메모가 삭제되었습니다.')
    }
  }

  const handleFollowUpComplete = (followUpId: string, status: FollowUpStatus) => {
    updateFollowUpStatus(followUpId, status, followUpNote)
    setActiveFollowUp(null)
    setFollowUpNote('')
    toast.success(status === 'completed' ? '팔로업 완료 처리됨' : '팔로업 건너뜀')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">{customer.phone}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">등급</span>
                <Select value={customer.grade} onValueChange={handleGradeChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_GRADE_ORDER.map((g) => (
                      <SelectItem key={g} value={g}>
                        {CUSTOMER_GRADE_LABELS[g]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> 연락처
                </span>
                <span className="text-sm font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> 등록일
                </span>
                <span className="text-sm">{customer.registeredAt.split('T')[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">방문 횟수</span>
                <span className="text-sm font-medium">{customer.totalVisits}회</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">최근 방문</span>
                <span className="text-sm">{customer.lastVisitDate || '-'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="w-5 h-5 text-primary" />
                태그
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {customer.tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">태그 없음</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="새 태그 입력..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                예약 이력 ({customerBookings.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">예약 이력이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {customerBookings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{booking.procedure}</span>
                            <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                              {BOOKING_STATUS_LABELS[booking.status]}
                            </Badge>
                            <Badge className={JOURNEY_STAGE_COLORS[booking.journeyStage]}>
                              {JOURNEY_STAGE_LABELS[booking.journeyStage]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {booking.date} {booking.time} · {booking.id}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>상세</Link>
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                팔로업 ({customerFollowUps.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerFollowUps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">팔로업 내역이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {customerFollowUps.map((fu) => (
                    <div key={fu.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={FOLLOW_UP_STATUS_COLORS[fu.status]}>
                            {FOLLOW_UP_STATUS_LABELS[fu.status]}
                          </Badge>
                          <Badge variant="outline">{FOLLOW_UP_TYPE_LABELS[fu.type]}</Badge>
                          <span className="text-sm font-medium">{fu.reason}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">기한: {fu.dueDate}</span>
                      </div>
                      {fu.note && (
                        <p className="text-sm text-muted-foreground mt-2">{fu.note}</p>
                      )}
                      {fu.status === 'pending' && (
                        <div className="mt-3">
                          {activeFollowUp === fu.id ? (
                            <div className="space-y-2">
                              <Input
                                placeholder="메모 (선택사항)..."
                                value={followUpNote}
                                onChange={(e) => setFollowUpNote(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleFollowUpComplete(fu.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  완료
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFollowUpComplete(fu.id, 'skipped')}
                                >
                                  <SkipForward className="w-4 h-4 mr-1" />
                                  건너뜀
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setActiveFollowUp(null); setFollowUpNote('') }}
                                >
                                  취소
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => setActiveFollowUp(fu.id)}>
                              처리하기
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
                메모 ({customer.memos.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Select value={memoType} onValueChange={(v) => setMemoType(v as MemoType)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(MEMO_TYPE_LABELS) as MemoType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {MEMO_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="메모를 입력하세요..."
                    value={memoContent}
                    onChange={(e) => setMemoContent(e.target.value)}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleAddMemo} disabled={!memoContent.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    메모 추가
                  </Button>
                </div>
              </div>

              <Separator />

              {customer.memos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">메모가 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {customer.memos.map((memo) => (
                    <div key={memo.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {MEMO_TYPE_LABELS[memo.type]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(memo.createdAt).toLocaleString('ko-KR')}
                            </span>
                          </div>
                          <p className="text-sm">{memo.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget({ memoId: memo.id })}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메모 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMemo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
