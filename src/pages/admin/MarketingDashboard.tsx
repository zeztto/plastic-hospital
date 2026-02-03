import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBookings } from '@/contexts/BookingContext'
import {
  ACQUISITION_SOURCE_LABELS,
  ACQUISITION_SOURCE_COLORS,
  ACQUISITION_SOURCES,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_ORDER,
} from '@/types/booking'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Megaphone,
  ArrowUpRight,
  Percent,
} from 'lucide-react'

export function MarketingDashboard() {
  const { bookings, marketingStats } = useBookings()

  const channelData = useMemo(() => {
    return ACQUISITION_SOURCES
      .map((src) => ({
        name: ACQUISITION_SOURCE_LABELS[src],
        value: marketingStats.sourceCount[src] || 0,
        color: ACQUISITION_SOURCE_COLORS[src],
        source: src,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [marketingStats])

  const funnelData = useMemo(() => {
    const nonCancelled = bookings.filter((b) => b.status !== 'cancelled')
    return JOURNEY_STAGE_ORDER.map((stage) => {
      const stageIdx = JOURNEY_STAGE_ORDER.indexOf(stage)
      const count = nonCancelled.filter((b) => {
        const bIdx = JOURNEY_STAGE_ORDER.indexOf(b.journeyStage)
        return bIdx >= stageIdx
      }).length
      return {
        name: JOURNEY_STAGE_LABELS[stage],
        value: count,
        stage,
      }
    })
  }, [bookings])

  const campaignData = useMemo(() => {
    const entries = Object.entries(marketingStats.campaignMap)
      .filter(([name]) => name.length > 0)
      .map(([name, data]) => ({
        name,
        total: data.total,
        converted: data.converted,
        rate: data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
    return entries
  }, [marketingStats])

  const trendData = useMemo(() => {
    const dateMap: Record<string, number> = {}
    for (const b of bookings) {
      const date = b.createdAt.split('T')[0]
      dateMap[date] = (dateMap[date] || 0) + 1
    }
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: date.substring(5),
        count,
      }))
  }, [bookings])

  const sourceConversionData = useMemo(() => {
    const sourceMap: Record<string, { total: number; converted: number }> = {}
    for (const b of bookings) {
      if (!b.source) continue
      if (!sourceMap[b.source]) sourceMap[b.source] = { total: 0, converted: 0 }
      sourceMap[b.source].total++
      const bIdx = JOURNEY_STAGE_ORDER.indexOf(b.journeyStage)
      if (bIdx >= 3) {
        sourceMap[b.source].converted++
      }
    }
    return ACQUISITION_SOURCES
      .filter((src) => sourceMap[src]?.total)
      .map((src) => ({
        name: ACQUISITION_SOURCE_LABELS[src],
        total: sourceMap[src].total,
        converted: sourceMap[src].converted,
        rate: sourceMap[src].total > 0
          ? Math.round((sourceMap[src].converted / sourceMap[src].total) * 100)
          : 0,
      }))
  }, [bookings])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">마케팅 분석</h1>
        <p className="text-muted-foreground mt-1">유입경로 및 고객 여정 분석 대시보드</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 리드</p>
                <p className="text-2xl font-bold">{marketingStats.totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전환 완료</p>
                <p className="text-2xl font-bold">{marketingStats.convertedLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전환율</p>
                <p className="text-2xl font-bold">{marketingStats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">최다 유입</p>
                <p className="text-2xl font-bold">
                  {marketingStats.topSource
                    ? ACQUISITION_SOURCE_LABELS[marketingStats.topSource]
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              유입 채널별 예약 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            {channelData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">데이터가 없습니다.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="예약 수" radius={[0, 4, 4, 0]}>
                    {channelData.map((entry) => (
                      <Cell key={entry.source} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="w-5 h-5 text-primary" />
              유입 채널 비율
            </CardTitle>
          </CardHeader>
          <CardContent>
            {channelData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">데이터가 없습니다.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {channelData.map((entry) => (
                      <Cell key={entry.source} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            고객 여정 퍼널
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.map((item, idx) => {
              const maxVal = funnelData[0]?.value || 1
              const widthPct = Math.max((item.value / maxVal) * 100, 8)
              return (
                <div key={item.stage} className="flex items-center gap-4">
                  <div className="w-20 text-right text-sm font-medium text-muted-foreground">
                    {item.name}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-10 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: `hsl(${220 + idx * 25}, 70%, ${55 + idx * 5}%)`,
                        }}
                      >
                        <span className="text-sm font-bold text-white">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                  {idx > 0 && funnelData[idx - 1].value > 0 && (
                    <div className="w-16 text-right">
                      <Badge variant="outline" className="text-xs">
                        {Math.round((item.value / funnelData[idx - 1].value) * 100)}%
                      </Badge>
                    </div>
                  )}
                  {idx === 0 && <div className="w-16" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            일별 예약 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">데이터가 없습니다.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="예약 수"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">캠페인 성과</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">캠페인 데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>캠페인명</TableHead>
                      <TableHead className="text-right">리드</TableHead>
                      <TableHead className="text-right">전환</TableHead>
                      <TableHead className="text-right">전환율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignData.map((c) => (
                      <TableRow key={c.name}>
                        <TableCell className="font-medium text-sm">{c.name}</TableCell>
                        <TableCell className="text-right">{c.total}</TableCell>
                        <TableCell className="text-right">{c.converted}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={c.rate >= 50 ? 'default' : 'outline'} className="text-xs">
                            {c.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">채널별 전환 성과</CardTitle>
          </CardHeader>
          <CardContent>
            {sourceConversionData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>채널</TableHead>
                      <TableHead className="text-right">리드</TableHead>
                      <TableHead className="text-right">전환</TableHead>
                      <TableHead className="text-right">전환율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sourceConversionData.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell className="text-right">{s.total}</TableCell>
                        <TableCell className="text-right">{s.converted}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={s.rate >= 50 ? 'default' : 'outline'} className="text-xs">
                            {s.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
