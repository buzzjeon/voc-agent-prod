'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDashboardStats } from '@/lib/api'
import { mockDashboardStats } from '@/lib/mock-data'
import type { DashboardStats } from '@/lib/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        // Fallback to mock data
        setStats(mockDashboardStats)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of VOC and guides status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-sm font-medium text-gray-500 mb-1">Total VOCs</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalVOCs || 0}</div>
            <Link href="/voc" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              View all
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm font-medium text-gray-500 mb-1">Pending Guides</div>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pendingGuides || 0}</div>
            <Link href="/guides?status=pending_approval" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Review now
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm font-medium text-gray-500 mb-1">Approved Guides</div>
            <div className="text-3xl font-bold text-green-600">{stats?.approvedGuides || 0}</div>
            <Link href="/guides?status=approved" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              View all
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm font-medium text-gray-500 mb-1">Resolved VOCs</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.resolvedVOCs || 0}</div>
            <Link href="/voc?status=resolved" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              View all
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link href="/voc">
              <Button variant="outline" className="w-full justify-start">
                View All VOCs
              </Button>
            </Link>
            <Link href="/guides?status=pending_approval">
              <Button variant="outline" className="w-full justify-start">
                Review Pending Guides
              </Button>
            </Link>
            <Link href="/voc?status=new">
              <Button variant="outline" className="w-full justify-start">
                New VOCs
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Guide generated for VOC-103</span>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Guide approved for VOC-104</span>
                <span className="text-xs text-gray-400">5h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>New VOC-105 created</span>
                <span className="text-xs text-gray-400">1d ago</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
