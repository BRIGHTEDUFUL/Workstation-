'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, FileDown, MousePointerClick } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { MOCK_ANALYTICS_DATA } from '@/lib/mock-analytics';

const chartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
  saves: {
    label: 'Saves',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

const AnalyticsPage = () => {
  const data = MOCK_ANALYTICS_DATA;

  return (
    <div className="flex flex-col h-screen">
      <header className="p-6 border-b shrink-0 border-border">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights about your cards' performance.
        </p>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  + {data.viewsLast30Days} in the last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Contact Saves
                </CardTitle>
                <FileDown className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSaves}</div>
                <p className="text-xs text-muted-foreground">
                  + {data.savesLast30Days} in the last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Link Clicks
                </CardTitle>
                <MousePointerClick className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalClicks}</div>
                <p className="text-xs text-muted-foreground">
                  Across all social and website links
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement This Week</CardTitle>
              <CardDescription>
                Showing card views and contact saves for the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.engagementOverTime}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="views"
                      fill="var(--color-views)"
                      radius={4}
                    />
                    <Bar
                      dataKey="saves"
                      fill="var(--color-saves)"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Card Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Card Performance</CardTitle>
              <CardDescription>
                Detailed analytics for each of your cards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Card Name</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Saves</TableHead>
                    <TableHead>Click-Through Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.cardPerformance.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">
                        {card.cardName}
                      </TableCell>
                      <TableCell>{card.views}</TableCell>
                      <TableCell>{card.saves}</TableCell>
                      <TableCell>{(card.ctr * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
