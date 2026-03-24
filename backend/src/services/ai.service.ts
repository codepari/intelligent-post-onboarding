import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { differenceInDays } from 'date-fns';

interface CandidateWithRelations {
  id: string;
  joiningDate: Date;
  offerDate: Date;
  acceptanceDate: Date | null;
  lastContactDate: Date | null;
  communications: any[];
  documents: any[];
  escalations: any[];
  riskScore: any;
}

export const aiService = {
  /**
   * Predict renege risk using AI/ML model or rule-based approach
   */
  async predictRenegeRisk(candidate: CandidateWithRelations) {
    try {
      // Try to call ML service first
      if (config.mlService.url) {
        try {
          const response = await axios.post(`${config.mlService.url}/api/ml/predict-renege`, {
            candidate
          }, { timeout: 5000 });

          return response.data;
        } catch (error) {
          logger.warn('ML service unavailable, falling back to rule-based approach');
        }
      }

      // Fallback: Rule-based risk scoring
      return this.calculateRiskScoreRuleBased(candidate);
    } catch (error) {
      logger.error('Error predicting renege risk:', error);
      throw error;
    }
  },

  /**
   * Rule-based risk scoring algorithm (fallback when ML service is unavailable)
   */
  calculateRiskScoreRuleBased(candidate: CandidateWithRelations) {
    let riskScore = 0;
    const factors = [];

    // Factor 1: Days to joining (0-30 points)
    const daysToJoining = differenceInDays(new Date(candidate.joiningDate), new Date());
    if (daysToJoining < 7) {
      riskScore += 5;
      factors.push({ factor: 'Joining imminent', impact: 'LOW', weight: 0.05 });
    } else if (daysToJoining > 60) {
      riskScore += 20;
      factors.push({ factor: 'Long wait until joining', impact: 'MEDIUM', weight: 0.20 });
    } else if (daysToJoining > 90) {
      riskScore += 30;
      factors.push({ factor: 'Very long wait until joining', impact: 'HIGH', weight: 0.30 });
    }

    // Factor 2: Response time to communications (0-25 points)
    const recentComms = candidate.communications.slice(0, 5);
    let avgResponseTime = 0;
    let noResponseCount = 0;

    recentComms.forEach(comm => {
      if (comm.sentAt && comm.responseReceivedAt) {
        const responseTime = differenceInDays(
          new Date(comm.responseReceivedAt),
          new Date(comm.sentAt)
        );
        avgResponseTime += responseTime;
      } else if (comm.sentAt && !comm.responseReceivedAt) {
        noResponseCount++;
      }
    });

    if (noResponseCount > 2) {
      riskScore += 25;
      factors.push({ factor: 'Multiple no-responses', impact: 'HIGH', weight: 0.25 });
    } else if (avgResponseTime > 3) {
      riskScore += 15;
      factors.push({ factor: 'Slow response times', impact: 'MEDIUM', weight: 0.15 });
    }

    // Factor 3: Days since last contact (0-20 points)
    if (candidate.lastContactDate) {
      const daysSinceContact = differenceInDays(new Date(), new Date(candidate.lastContactDate));
      if (daysSinceContact > 14) {
        riskScore += 20;
        factors.push({ factor: 'Long silence period', impact: 'HIGH', weight: 0.20 });
      } else if (daysSinceContact > 7) {
        riskScore += 10;
        factors.push({ factor: 'Extended silence period', impact: 'MEDIUM', weight: 0.10 });
      }
    } else {
      riskScore += 15;
      factors.push({ factor: 'Never contacted', impact: 'MEDIUM', weight: 0.15 });
    }

    // Factor 4: Sentiment analysis (0-15 points)
    const sentimentScores = candidate.communications
      .filter(c => c.sentimentScore !== null)
      .map(c => parseFloat(c.sentimentScore));

    if (sentimentScores.length > 0) {
      const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
      if (avgSentiment < -0.3) {
        riskScore += 15;
        factors.push({ factor: 'Negative sentiment in communications', impact: 'MEDIUM', weight: 0.15 });
      } else if (avgSentiment < 0) {
        riskScore += 8;
        factors.push({ factor: 'Somewhat negative sentiment', impact: 'LOW', weight: 0.08 });
      }
    }

    // Factor 5: Document submission delays (0-10 points)
    const pendingDocs = candidate.documents.filter(d => d.status === 'PENDING');
    if (pendingDocs.length > 3) {
      riskScore += 10;
      factors.push({ factor: 'Multiple pending documents', impact: 'MEDIUM', weight: 0.10 });
    } else if (pendingDocs.length > 0) {
      riskScore += 5;
      factors.push({ factor: 'Some pending documents', impact: 'LOW', weight: 0.05 });
    }

    // Factor 6: Active escalations (0-10 points)
    const activeEscalations = candidate.escalations.filter(
      e => e.status === 'OPEN' || e.status === 'IN_PROGRESS'
    );
    if (activeEscalations.length > 0) {
      riskScore += 10;
      factors.push({ factor: 'Active escalations', impact: 'HIGH', weight: 0.10 });
    }

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore < 25) riskLevel = 'LOW';
    else if (riskScore < 50) riskLevel = 'MEDIUM';
    else if (riskScore < 75) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    // Generate recommendations
    const recommendations = this.generateRecommendations(riskScore, factors);

    return {
      candidateId: candidate.id,
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      factors: factors.sort((a, b) => b.weight - a.weight),
      recommendations,
      confidence: 0.75, // Rule-based has lower confidence than ML
      lastUpdated: new Date().toISOString(),
      method: 'rule-based'
    };
  },

  /**
   * Generate recommendations based on risk factors
   */
  generateRecommendations(riskScore: number, factors: any[]) {
    const recommendations = [];

    if (riskScore > 50) {
      recommendations.push('Immediate TA connect required');
      recommendations.push('Schedule urgent HM intervention call');
    }

    // Specific recommendations based on factors
    const factorNames = factors.map(f => f.factor);

    if (factorNames.some(f => f.includes('no-response') || f.includes('silence'))) {
      recommendations.push('Increase communication frequency');
      recommendations.push('Try alternative contact methods (phone, WhatsApp)');
    }

    if (factorNames.some(f => f.includes('negative sentiment'))) {
      recommendations.push('Identify and address concerns');
      recommendations.push('Consider compensation or role clarity discussion');
    }

    if (factorNames.some(f => f.includes('document'))) {
      recommendations.push('Follow up on pending documents');
      recommendations.push('Offer assistance with document preparation');
    }

    if (factorNames.some(f => f.includes('long wait'))) {
      recommendations.push('Maintain regular engagement');
      recommendations.push('Share culture content and team introductions');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue standard engagement cadence');
      recommendations.push('Monitor for any changes in behavior');
    }

    return recommendations;
  },

  /**
   * Analyze sentiment of communication text
   */
  async analyzeSentiment(text: string) {
    try {
      if (config.mlService.url) {
        const response = await axios.post(`${config.mlService.url}/api/ml/analyze-sentiment`, {
          text
        }, { timeout: 3000 });

        return response.data;
      }

      // Fallback: Simple keyword-based sentiment
      return this.analyzeSentimentSimple(text);
    } catch (error) {
      logger.warn('Sentiment analysis failed, using fallback');
      return this.analyzeSentimentSimple(text);
    }
  },

  /**
   * Simple keyword-based sentiment analysis
   */
  analyzeSentimentSimple(text: string) {
    const positiveWords = ['excited', 'happy', 'great', 'wonderful', 'looking forward', 'thrilled', 'excellent', 'perfect'];
    const negativeWords = ['concerned', 'worried', 'issue', 'problem', 'delay', 'unfortunately', 'sorry', 'cannot', 'difficult'];

    const lowerText = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.2;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.2;
    });

    // Clamp between -1 and 1
    score = Math.max(-1, Math.min(1, score));

    let label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    if (score > 0.2) label = 'POSITIVE';
    else if (score < -0.2) label = 'NEGATIVE';
    else label = 'NEUTRAL';

    return {
      score,
      label,
      confidence: 0.6
    };
  },

  /**
   * Detect anomalies in candidate behavior
   */
  async detectAnomaly(candidate: CandidateWithRelations) {
    const anomalies = [];

    // Sudden drop in response rate
    const recentComms = candidate.communications.slice(0, 5);
    const olderComms = candidate.communications.slice(5, 10);

    const recentResponseRate = recentComms.filter(c => c.responseReceivedAt).length / recentComms.length;
    const olderResponseRate = olderComms.filter(c => c.responseReceivedAt).length / olderComms.length;

    if (olderResponseRate > 0.7 && recentResponseRate < 0.3) {
      anomalies.push({
        type: 'SUDDEN_DISENGAGEMENT',
        severity: 'HIGH',
        description: 'Candidate response rate dropped significantly'
      });
    }

    // Unusual silence
    if (candidate.lastContactDate) {
      const daysSinceContact = differenceInDays(new Date(), new Date(candidate.lastContactDate));
      const avgDaysBetweenComms = this.calculateAvgDaysBetweenComms(candidate.communications);

      if (daysSinceContact > avgDaysBetweenComms * 2) {
        anomalies.push({
          type: 'UNUSUAL_SILENCE',
          severity: 'MEDIUM',
          description: 'Current silence period is unusually long'
        });
      }
    }

    return anomalies;
  },

  calculateAvgDaysBetweenComms(communications: any[]) {
    if (communications.length < 2) return 7; // Default

    const sorted = communications
      .filter(c => c.sentAt)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    let totalDays = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      totalDays += differenceInDays(
        new Date(sorted[i].sentAt),
        new Date(sorted[i + 1].sentAt)
      );
    }

    return totalDays / (sorted.length - 1);
  }
};
