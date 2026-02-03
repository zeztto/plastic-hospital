import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useMessages } from '@/contexts/MessageContext'
import { useCustomers } from '@/contexts/CustomerContext'
import {
  MESSAGE_CHANNEL_LABELS,
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_CATEGORY_COLORS,
  SEND_STATUS_LABELS,
  SEND_STATUS_COLORS,
  AUTO_SEND_TRIGGER_LABELS,
  type MessageChannel,
  type TemplateCategory,
  type MessageTemplate,
} from '@/types/message'
import {
  MessageSquare, Send, Clock, Plus, Pencil, Trash2, Search,
  ChevronLeft, ChevronRight, Eye, Users, Settings, Power,
} from 'lucide-react'
import { toast } from 'sonner'

const PAGE_SIZE = 10

function TemplatesTab() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useMessages()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MessageTemplate | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MessageTemplate | null>(null)
  const [form, setForm] = useState({
    name: '',
    category: 'custom' as TemplateCategory,
    channel: 'kakao' as MessageChannel,
    content: '',
  })

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = search === '' || t.name.includes(search) || t.content.includes(search)
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [templates, search, categoryFilter])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ name: '', category: 'custom', channel: 'kakao', content: '' })
    setDialogOpen(true)
  }

  const openEdit = (template: MessageTemplate) => {
    setEditTarget(template)
    setForm({
      name: template.name,
      category: template.category,
      channel: template.channel,
      content: template.content,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) {
      toast.error('템플릿 이름과 내용을 입력해주세요.')
      return
    }
    const variables = (form.content.match(/\{\{(.+?)\}\}/g) || []).map((v) => v.replace(/\{\{|\}\}/g, ''))
    if (editTarget) {
      updateTemplate(editTarget.id, { ...form, variables })
      toast.success('템플릿이 수정되었습니다.')
    } else {
      createTemplate({ ...form, variables })
      toast.success('템플릿이 생성되었습니다.')
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteTemplate(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('템플릿이 삭제되었습니다.')
    }
  }

  const handleToggleActive = (template: MessageTemplate) => {
    updateTemplate(template.id, { isActive: !template.isActive })
    toast.success(template.isActive ? '템플릿이 비활성화되었습니다.' : '템플릿이 활성화되었습니다.')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="템플릿 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full sm:w-64" />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as TemplateCategory | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 유형</SelectItem>
              {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" />
          새 템플릿
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>템플릿이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((t) => (
            <Card key={t.id} className={!t.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{t.name}</span>
                      <Badge className={TEMPLATE_CATEGORY_COLORS[t.category]}>{TEMPLATE_CATEGORY_LABELS[t.category]}</Badge>
                      <Badge variant="outline">{MESSAGE_CHANNEL_LABELS[t.channel]}</Badge>
                      {!t.isActive && <Badge variant="secondary">비활성</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">{t.content}</p>
                    {t.variables.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {t.variables.map((v) => (
                          <Badge key={v} variant="outline" className="text-xs">{`{{${v}}}`}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(t)}>
                      <Power className={`w-4 h-4 ${t.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(t)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? '템플릿 수정' : '새 템플릿 만들기'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">템플릿 이름</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 신규 고객 환영 인사" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">유형</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as TemplateCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">발송 채널</label>
                <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v as MessageChannel })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(MESSAGE_CHANNEL_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">메시지 내용</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="메시지 내용을 입력하세요. 변수는 {{변수명}} 형태로 입력합니다." rows={6} />
              <p className="text-xs text-muted-foreground">사용 가능한 변수: {`{{고객명}}`}, {`{{날짜}}`}, {`{{시간}}`}, {`{{시술명}}`}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button onClick={handleSave}>{editTarget ? '수정' : '생성'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>템플릿 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.name}&quot; 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SendTab() {
  const { activeTemplates, sendMessage, sendBulkMessages } = useMessages()
  const { customers } = useCustomers()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
  const [customerSearch, setCustomerSearch] = useState('')
  const [previewContent, setPreviewContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const template = activeTemplates.find((t) => t.id === selectedTemplate)

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers
    return customers.filter(
      (c) => c.name.includes(customerSearch) || c.phone.includes(customerSearch)
    )
  }, [customers, customerSearch])

  const toggleCustomer = (id: string) => {
    setSelectedCustomers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set())
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map((c) => c.id)))
    }
  }

  const handlePreview = () => {
    if (!template) {
      toast.error('템플릿을 선택해주세요.')
      return
    }
    if (selectedCustomers.size === 0) {
      toast.error('수신자를 선택해주세요.')
      return
    }
    const firstCustomer = customers.find((c) => selectedCustomers.has(c.id))
    let content = template.content
    if (firstCustomer) {
      content = content.replace(/\{\{고객명\}\}/g, firstCustomer.name)
    }
    content = content.replace(/\{\{날짜\}\}/g, new Date().toISOString().split('T')[0])
    content = content.replace(/\{\{시간\}\}/g, '10:00')
    content = content.replace(/\{\{시술명\}\}/g, '시술')
    setPreviewContent(content)
    setShowPreview(true)
  }

  const handleSend = () => {
    if (!template) return
    const recipients = customers
      .filter((c) => selectedCustomers.has(c.id))
      .map((c) => ({ name: c.name, phone: c.phone }))

    if (recipients.length === 1) {
      let content = template.content.replace(/\{\{고객명\}\}/g, recipients[0].name)
      content = content.replace(/\{\{날짜\}\}/g, new Date().toISOString().split('T')[0])
      content = content.replace(/\{\{시간\}\}/g, '10:00')
      content = content.replace(/\{\{시술명\}\}/g, '시술')
      sendMessage({
        templateId: template.id,
        templateName: template.name,
        channel: template.channel,
        recipientName: recipients[0].name,
        recipientPhone: recipients[0].phone,
        content,
      })
    } else {
      let content = template.content
      content = content.replace(/\{\{날짜\}\}/g, new Date().toISOString().split('T')[0])
      content = content.replace(/\{\{시간\}\}/g, '10:00')
      content = content.replace(/\{\{시술명\}\}/g, '시술')
      sendBulkMessages(recipients, template.id, template.name, template.channel, content)
    }

    toast.success(`${recipients.length}명에게 메시지가 발송되었습니다.`)
    setSelectedCustomers(new Set())
    setSelectedTemplate('')
    setShowPreview(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              템플릿 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="메시지 템플릿을 선택하세요..." />
              </SelectTrigger>
              <SelectContent>
                {activeTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({MESSAGE_CHANNEL_LABELS[t.channel]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {template && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
                {template.content}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              수신자 선택 ({selectedCustomers.size}명)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="이름, 연락처 검색..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedCustomers.size === filteredCustomers.length ? '전체 해제' : '전체 선택'}
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {filteredCustomers.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.has(c.id)}
                    onChange={() => toggleCustomer(c.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{c.phone}</span>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-1" />
          미리보기
        </Button>
        <Button onClick={handleSend} disabled={!template || selectedCustomers.size === 0}>
          <Send className="w-4 h-4 mr-1" />
          발송 ({selectedCustomers.size}명)
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메시지 미리보기</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{template ? MESSAGE_CHANNEL_LABELS[template.channel] : ''}</Badge>
              <span className="text-sm text-muted-foreground">→ {selectedCustomers.size}명 수신</span>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap text-sm border">{previewContent}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>닫기</Button>
            <Button onClick={handleSend}>
              <Send className="w-4 h-4 mr-1" />
              발송 확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HistoryTab() {
  const { sendRecords, sendStats } = useMessages()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return sendRecords.filter((r) => {
      const matchesSearch = search === '' || r.recipientName.includes(search) || r.recipientPhone.includes(search) || r.templateName.includes(search)
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [sendRecords, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{sendStats.total}</p>
            <p className="text-xs text-muted-foreground">전체</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{sendStats.sent}</p>
            <p className="text-xs text-muted-foreground">발송완료</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{sendStats.failed}</p>
            <p className="text-xs text-muted-foreground">발송실패</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{sendStats.pending}</p>
            <p className="text-xs text-muted-foreground">발송대기</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="수신자, 템플릿 검색..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9 w-full sm:w-64" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              {Object.entries(SEND_STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Send className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>발송 이력이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>수신자</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>채널</TableHead>
                  <TableHead>템플릿</TableHead>
                  <TableHead>발송일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Badge className={SEND_STATUS_COLORS[r.status]}>{SEND_STATUS_LABELS[r.status]}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{r.recipientName}</TableCell>
                    <TableCell>{r.recipientPhone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{MESSAGE_CHANNEL_LABELS[r.channel]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.templateName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.sentAt).toLocaleString('ko-KR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">{filtered.length}건 중 {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)}건</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">{page} / {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AutoSendTab() {
  const { autoSendRules, activeTemplates, updateAutoSendRule, updateAutoSendRuleTemplate } = useMessages()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        특정 이벤트 발생 시 자동으로 메시지를 발송하는 규칙을 설정합니다.
      </p>
      <div className="space-y-3">
        {autoSendRules.map((rule) => {
          const template = activeTemplates.find((t) => t.id === rule.templateId)
          return (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{AUTO_SEND_TRIGGER_LABELS[rule.trigger]}</span>
                      <Badge variant="outline">{MESSAGE_CHANNEL_LABELS[rule.channel]}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={rule.templateId}
                        onValueChange={(v) => {
                          updateAutoSendRuleTemplate(rule.id, v)
                          toast.success('자동 발송 템플릿이 변경되었습니다.')
                        }}
                      >
                        <SelectTrigger className="w-[250px] h-8 text-xs">
                          <SelectValue placeholder="템플릿 선택..." />
                        </SelectTrigger>
                        <SelectContent>
                          {activeTemplates.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {template && (
                        <span className="text-xs text-muted-foreground">({TEMPLATE_CATEGORY_LABELS[template.category]})</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={rule.isEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      updateAutoSendRule(rule.id, !rule.isEnabled)
                      toast.success(rule.isEnabled ? '자동 발송이 비활성화되었습니다.' : '자동 발송이 활성화되었습니다.')
                    }}
                  >
                    <Power className="w-4 h-4 mr-1" />
                    {rule.isEnabled ? '활성' : '비활성'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function MessageCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">메시지 관리</h1>
        <p className="text-muted-foreground mt-1">메시지 템플릿 관리, 발송, 이력을 확인합니다.</p>
      </div>

      <Card>
        <CardContent className="p-4 lg:p-6">
          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="templates" className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">템플릿</span>
              </TabsTrigger>
              <TabsTrigger value="send" className="flex items-center gap-1">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">발송</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">발송이력</span>
              </TabsTrigger>
              <TabsTrigger value="auto" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">자동발송</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="mt-6">
              <TemplatesTab />
            </TabsContent>
            <TabsContent value="send" className="mt-6">
              <SendTab />
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <HistoryTab />
            </TabsContent>
            <TabsContent value="auto" className="mt-6">
              <AutoSendTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
