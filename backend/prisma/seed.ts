import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create stages
  const stages = await Promise.all([
    prisma.stage.create({
      data: {
        name: 'Offer Release',
        orderIndex: 1,
        description: 'Share written offer within 24 hours',
        typicalDurationDays: 1
      }
    }),
    prisma.stage.create({
      data: {
        name: 'Offer Acceptance',
        orderIndex: 2,
        description: 'Confirm acceptance and share welcome email',
        typicalDurationDays: 2
      }
    }),
    prisma.stage.create({
      data: {
        name: 'Pre-Joining Engagement',
        orderIndex: 3,
        description: 'Regular check-ins and manager connect',
        typicalDurationDays: 30
      }
    }),
    prisma.stage.create({
      data: {
        name: 'Documentation & BGV',
        orderIndex: 4,
        description: 'Document collection and background verification',
        typicalDurationDays: 14
      }
    }),
    prisma.stage.create({
      data: {
        name: 'Joining Readiness',
        orderIndex: 5,
        description: 'Final preparations for Day 1',
        typicalDurationDays: 7
      }
    }),
    prisma.stage.create({
      data: {
        name: 'Day 1 Handoff',
        orderIndex: 6,
        description: 'Candidate joins and transitions to HR Ops',
        typicalDurationDays: 1
      }
    })
  ]);

  console.log(`Created ${stages.length} stages`);

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      region: 'US'
    }
  });

  const taUser = await prisma.user.create({
    data: {
      email: 'ta@company.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'TA',
      region: 'US'
    }
  });

  const hmUser = await prisma.user.create({
    data: {
      email: 'hm@company.com',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Chen',
      role: 'HM',
      region: 'US'
    }
  });

  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@company.com',
      passwordHash,
      firstName: 'Emily',
      lastName: 'Davis',
      role: 'HR_OPS',
      region: 'US'
    }
  });

  console.log('Created 4 users');

  // Create sample candidates
  const joiningDate1 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const joiningDate2 = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const joiningDate3 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const twelveDaysAgo = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000);

  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        jobTitle: 'Senior Software Engineer',
        compensation: 150000,
        currency: 'USD',
        joiningDate: joiningDate1,
        offerDate: today,
        acceptanceDate: today,
        acceptanceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'San Francisco',
        region: 'US',
        workArrangement: 'HYBRID',
        currentStageId: stages[2].id,
        taOwnerId: taUser.id,
        hmOwnerId: hmUser.id,
        hrOwnerId: hrUser.id,
        offerStatus: 'ACCEPTED',
        riskLevel: 'LOW',
        riskScore: 15,
        lastContactDate: threeDaysAgo
      }
    }),
    prisma.candidate.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+919876543210',
        jobTitle: 'Product Manager',
        compensation: 3000000,
        currency: 'INR',
        joiningDate: joiningDate2,
        offerDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        acceptanceDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Mumbai',
        region: 'INDIA',
        workArrangement: 'WFO',
        currentStageId: stages[3].id,
        taOwnerId: taUser.id,
        hmOwnerId: hmUser.id,
        hrOwnerId: hrUser.id,
        offerStatus: 'ACCEPTED',
        riskLevel: 'MEDIUM',
        riskScore: 45,
        lastContactDate: eightDaysAgo
      }
    }),
    prisma.candidate.create({
      data: {
        firstName: 'Alex',
        lastName: 'Brown',
        email: 'alex.brown@example.com',
        phone: '+447123456789',
        jobTitle: 'Data Scientist',
        compensation: 80000,
        currency: 'GBP',
        joiningDate: joiningDate3,
        offerDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'London',
        region: 'UK_EU',
        workArrangement: 'REMOTE',
        currentStageId: stages[1].id,
        taOwnerId: taUser.id,
        hmOwnerId: hmUser.id,
        hrOwnerId: hrUser.id,
        offerStatus: 'PENDING',
        riskLevel: 'HIGH',
        riskScore: 72,
        lastContactDate: twelveDaysAgo
      }
    })
  ]);

  console.log(`Created ${candidates.length} candidates`);

  // Create sample email templates
  await prisma.template.create({
    data: {
      name: 'Welcome Email',
      type: 'EMAIL',
      category: 'WELCOME',
      subject: 'Welcome to {companyName}! We\'re excited to have you onboard',
      body: `Hi {firstName},

Congratulations and welcome to {companyName}!

We're excited that you've accepted the offer for the role of {jobTitle}, and we're really looking forward to you joining the team.

This email is to officially welcome you and give you a quick overview of what happens next before your joining date on {joiningDate}.

What to expect next:
• You'll shortly receive a separate email from our HR Operations team with details on documentation and background verification.
• Your primary point of contact until you join will be {taName}.
• Your Hiring Manager, {hmName}, will also connect with you before joining.

Stay connected and feel free to reach out if you have any questions.

Warm regards,
{taName}
`,
      region: null,
      createdById: adminUser.id,
      variables: JSON.stringify({
        fields: ['companyName', 'firstName', 'jobTitle', 'joiningDate', 'taName', 'hmName']
      })
    }
  });

  console.log('Created sample templates');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
