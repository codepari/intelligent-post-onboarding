import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding extended database with 15 candidates...');

  // Get existing data
  const stages = await prisma.stage.findMany();
  const users = await prisma.user.findMany();
  const taUser = users.find(u => u.role === 'TA');
  const hmUser = users.find(u => u.role === 'HM');
  const hrUser = users.find(u => u.role === 'HR_OPS');

  if (!taUser || !hmUser || !hrUser) {
    throw new Error('Users not found. Run main seed first.');
  }

  // Helper function to get dates
  const getDaysFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Sample data arrays
  const firstNames = ['Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'William', 'Ava', 'Robert', 'Sophia', 'David', 'Isabella', 'Daniel', 'Mia', 'Christopher', 'Charlotte'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  const jobTitles = [
    'Senior Software Engineer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Engineer',
    'Machine Learning Engineer',
    'Security Engineer',
    'Cloud Architect',
    'QA Engineer',
    'Technical Lead',
    'Engineering Manager',
    'Solutions Architect',
    'Site Reliability Engineer'
  ];
  const locations = ['San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Los Angeles', 'Denver', 'Portland', 'Atlanta'];
  const workArrangements = ['REMOTE', 'HYBRID', 'ON_SITE'];
  const riskLevels = ['LOW', 'LOW', 'MEDIUM', 'LOW', 'MEDIUM', 'HIGH', 'LOW', 'LOW', 'MEDIUM', 'LOW'];

  // Create 15 candidates with varying joining dates
  const candidatePromises = [];

  for (let i = 0; i < 15; i++) {
    // Vary joining dates: some past, some future
    let joiningDate;
    if (i < 3) {
      // Already joined (past dates for follow-up testing)
      joiningDate = getDaysFromNow(-20 + (i * 5)); // -20, -15, -10 days
    } else if (i < 8) {
      // Joining soon (next 30 days)
      joiningDate = getDaysFromNow(5 + (i * 5));
    } else {
      // Joining later (30-60 days)
      joiningDate = getDaysFromNow(30 + ((i - 8) * 5));
    }

    const offerDate = getDaysFromNow(-10);
    const acceptanceDate = getDaysFromNow(-7);
    const lastContact = getDaysFromNow(-2 - (i % 5));

    const stageIndex = i < 3 ? 5 : (i % 5); // Past joiners at final stage

    candidatePromises.push(
      prisma.candidate.create({
        data: {
          firstName: firstNames[i],
          lastName: lastNames[i],
          email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          jobTitle: jobTitles[i],
          compensation: 100000 + (i * 10000),
          currency: 'USD',
          joiningDate,
          offerDate,
          acceptanceDate,
          acceptanceDeadline: getDaysFromNow(-5),
          location: locations[i % locations.length],
          region: 'US',
          workArrangement: workArrangements[i % workArrangements.length] as any,
          currentStageId: stages[stageIndex].id,
          taOwnerId: taUser.id,
          hmOwnerId: hmUser.id,
          hrOwnerId: hrUser.id,
          offerStatus: 'ACCEPTED',
          riskLevel: riskLevels[i % riskLevels.length] as any,
          riskScore: 10 + (i * 5),
          lastContactDate: new Date(lastContact)
        }
      })
    );
  }

  const candidates = await Promise.all(candidatePromises);
  console.log(`✓ Created ${candidates.length} candidates`);

  // Add some communications for realism
  console.log('Adding communication history...');
  const communicationPromises = [];

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];

    // Welcome email
    communicationPromises.push(
      prisma.communication.create({
        data: {
          candidateId: candidate.id,
          type: 'EMAIL',
          category: 'GENERAL',
          subject: 'Welcome to the Team!',
          content: 'We are excited to have you join us.',
          sentAt: new Date(candidate.offerDate!),
          sentById: taUser.id,
          status: 'SENT',
          sentimentScore: 0.9,
          sentimentLabel: 'POSITIVE'
        }
      })
    );

    // Follow-up check-in
    if (i % 3 === 0) {
      communicationPromises.push(
        prisma.communication.create({
          data: {
            candidateId: candidate.id,
            type: 'EMAIL',
            category: 'CHECK_IN',
            subject: 'Quick check-in',
            content: 'How are your preparations going?',
            sentAt: new Date(candidate.lastContactDate!),
            sentById: taUser.id,
            status: 'SENT',
            sentimentScore: 0.7,
            sentimentLabel: 'POSITIVE'
          }
        })
      );
    }
  }

  await Promise.all(communicationPromises);
  console.log(`✓ Created ${communicationPromises.length} communications`);

  console.log('\n✅ Extended seeding complete!');
  console.log(`\nTotal candidates in database: ${candidates.length + 3}`); // +3 from original seed
  console.log('\nNow scheduling follow-ups for candidates who have joined...');

  // Schedule follow-ups for candidates who have already joined (first 3)
  console.log('\n⚠️  To schedule follow-ups for candidates:');
  console.log('1. Start the backend: npm run dev');
  console.log('2. Login as admin to get token');
  console.log('3. Go to each candidate page and click "Schedule Follow-ups"');
  console.log('\nOr run this after backend is running:');
  for (let i = 0; i < 3; i++) {
    console.log(`  POST /api/follow-ups/candidates/${candidates[i].id}/schedule`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
