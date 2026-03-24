import prisma from '../utils/prisma';

export const candidateService = {
  async getTimeline(candidateId: string) {
    const [communications, documents, escalations, bgvRecords] = await Promise.all([
      prisma.communication.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'asc' },
        include: {
          sentBy: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.document.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.escalation.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'asc' },
        include: {
          escalatedBy: { select: { firstName: true, lastName: true } },
          assignedTo: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.bGVRecord.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Combine all events into a single timeline
    const timeline = [
      ...communications.map(c => ({ ...c, eventType: 'COMMUNICATION' })),
      ...documents.map(d => ({ ...d, eventType: 'DOCUMENT' })),
      ...escalations.map(e => ({ ...e, eventType: 'ESCALATION' })),
      ...bgvRecords.map(b => ({ ...b, eventType: 'BGV' }))
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return timeline;
  }
};
