import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            VOC Agent
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered Voice of Customer Analysis & Guide Generation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">VOC Management</h3>
              <p className="text-sm text-gray-600">
                Centralize and track customer issues from JIRA
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Automatic root cause analysis and solution generation
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold mb-2">Approval Flow</h3>
              <p className="text-sm text-gray-600">
                Review and approve AI-generated guides
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Built with Next.js, React, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
