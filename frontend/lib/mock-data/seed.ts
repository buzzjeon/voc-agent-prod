/**
 * Mock Data for Testing Without Database Connection
 *
 * Run this seed script to populate your database with test data:
 * npx tsx lib/mock-data/seed.ts
 *
 * Or use in development mode when DATABASE_URL is not configured
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vocagent.com' },
    update: {},
    create: {
      email: 'admin@vocagent.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const pdmUser = await prisma.user.upsert({
    where: { email: 'pdm@vocagent.com' },
    update: {},
    create: {
      email: 'pdm@vocagent.com',
      name: 'PDM Manager',
      role: 'PDM',
    },
  });

  const engineerUser = await prisma.user.upsert({
    where: { email: 'engineer@vocagent.com' },
    update: {},
    create: {
      email: 'engineer@vocagent.com',
      name: 'Engineer Kim',
      role: 'ENGINEER',
    },
  });

  console.log('✅ Users created');

  // Create VOCs
  const voc1 = await prisma.vOC.upsert({
    where: { jiraKey: 'VOC-001' },
    update: {},
    create: {
      jiraKey: 'VOC-001',
      title: 'VM instance creation fails with timeout error',
      description: 'Customer reports that VM creation consistently fails after 5 minutes with a timeout error. This happens only for instances with more than 8 vCPUs.',
      category: 'COMPUTE',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      reporter: 'Customer Support',
      userId: engineerUser.id,
    },
  });

  const voc2 = await prisma.vOC.upsert({
    where: { jiraKey: 'VOC-002' },
    update: {},
    create: {
      jiraKey: 'VOC-002',
      title: 'Object storage upload speed is slower than expected',
      description: 'Upload speeds to object storage are significantly slower (10MB/s) compared to documented speeds (100MB/s). Issue occurs during peak hours.',
      category: 'STORAGE',
      status: 'NEW',
      priority: 'MEDIUM',
      reporter: 'Enterprise Customer',
    },
  });

  const voc3 = await prisma.vOC.upsert({
    where: { jiraKey: 'VOC-003' },
    update: {},
    create: {
      jiraKey: 'VOC-003',
      title: 'Load balancer health check configuration unclear',
      description: 'Documentation does not clearly explain how to configure custom health check endpoints for application load balancers.',
      category: 'NETWORK',
      status: 'RESOLVED',
      priority: 'LOW',
      reporter: 'DevOps Team',
      userId: engineerUser.id,
    },
  });

  console.log('✅ VOCs created');

  // Create guides
  const guide1 = await prisma.guide.upsert({
    where: { id: 'guide-1-seed' },
    update: {},
    create: {
      id: 'guide-1-seed',
      vocId: voc1.id,
      title: 'Troubleshooting VM Creation Timeout Issues',
      problem: 'VM instances with more than 8 vCPUs fail to create within the expected timeframe, resulting in timeout errors after approximately 5 minutes.',
      cause: 'The issue is caused by insufficient resource allocation in the availability zone during peak usage hours. Large instances require more time for resource provisioning and initialization.',
      procedure: '1. Check availability zone capacity\n2. Verify quota limits for the account\n3. Review instance type availability\n4. Monitor resource allocation logs\n5. Attempt creation in alternative availability zones',
      solution: 'Recommend customers to:\n1. Use instance reservation for large VMs\n2. Schedule creation during off-peak hours\n3. Distribute workloads across multiple smaller instances\n4. Contact support for quota increase if needed',
      sources: JSON.stringify([
        { title: 'VM Creation Best Practices', url: 'https://docs.scp.com/compute/vm-creation' },
        { title: 'Quota Management Guide', url: 'https://docs.scp.com/account/quotas' },
        { title: 'Availability Zone Selection', url: 'https://confluence.internal/az-selection' },
      ]),
      status: 'APPROVED',
      authorId: engineerUser.id,
    },
  });

  const guide2 = await prisma.guide.upsert({
    where: { id: 'guide-2-seed' },
    update: {},
    create: {
      id: 'guide-2-seed',
      vocId: voc3.id,
      title: 'Load Balancer Health Check Configuration Guide',
      problem: 'Users are unable to configure custom health check endpoints for their application load balancers due to unclear documentation.',
      cause: 'The health check configuration section in the documentation lacks concrete examples and does not explain the relationship between health check paths, protocols, and application endpoints.',
      procedure: '1. Navigate to Load Balancer settings\n2. Select Health Check configuration\n3. Choose HTTP/HTTPS protocol\n4. Specify custom health check path (e.g., /health, /status)\n5. Configure interval, timeout, and threshold values\n6. Save and test the configuration',
      solution: 'Provide clear step-by-step guide with examples:\n- HTTP health check: path=/health, port=80, interval=30s\n- HTTPS health check: path=/api/status, port=443, interval=30s\n- Custom health check response codes: 200, 201, 204\n- Include code examples for implementing health check endpoints in common frameworks',
      sources: JSON.stringify([
        { title: 'Load Balancer Documentation', url: 'https://docs.scp.com/network/load-balancer' },
        { title: 'Health Check Best Practices', url: 'https://docs.scp.com/network/health-checks' },
        { title: 'API Gateway Integration', url: 'https://confluence.internal/api-gateway' },
      ]),
      status: 'PUBLISHED',
      authorId: engineerUser.id,
    },
  });

  console.log('✅ Guides created');

  // Create approvals
  const approval1 = await prisma.approval.upsert({
    where: { id: 'approval-1-seed' },
    update: {},
    create: {
      id: 'approval-1-seed',
      guideId: guide1.id,
      approverId: pdmUser.id,
      status: 'APPROVED',
      comment: 'Well-documented solution with clear steps. Approved for publication.',
    },
  });

  const approval2 = await prisma.approval.upsert({
    where: { id: 'approval-2-seed' },
    update: {},
    create: {
      id: 'approval-2-seed',
      guideId: guide2.id,
      approverId: pdmUser.id,
      status: 'APPROVED',
      comment: 'Excellent guide with practical examples. Ready to publish.',
    },
  });

  console.log('✅ Approvals created');

  // Create documents for RAG
  const documents = [
    {
      title: 'Virtual Machine Overview',
      content: 'SCP provides flexible virtual machine instances with various configurations. Instances can be created with custom CPU, memory, and storage specifications.',
      source: 'SCP_DOCS',
      url: 'https://docs.scp.com/compute/vm-overview',
      category: 'COMPUTE',
    },
    {
      title: 'Object Storage Guide',
      content: 'Object storage provides scalable, durable storage for unstructured data. Supports high-throughput uploads and downloads with global accessibility.',
      source: 'SCP_DOCS',
      url: 'https://docs.scp.com/storage/object-storage',
      category: 'STORAGE',
    },
    {
      title: 'Load Balancer Configuration',
      content: 'Application load balancers distribute traffic across multiple instances. Configure health checks to ensure traffic is only routed to healthy instances.',
      source: 'SCP_DOCS',
      url: 'https://docs.scp.com/network/load-balancer-config',
      category: 'NETWORK',
    },
  ];

  for (const doc of documents) {
    await prisma.document.create({
      data: doc,
    });
  }

  console.log('✅ Documents created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
