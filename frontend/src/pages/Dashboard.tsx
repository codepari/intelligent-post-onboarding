import { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboard } from '../features/analytics/analyticsSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { dashboard, loading } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading || !dashboard) {
    return <Typography>Loading dashboard...</Typography>;
  }

  const statCards = [
    {
      title: 'Total Candidates',
      value: dashboard.totalCandidates,
      icon: <PeopleIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'At Risk',
      value: dashboard.atRiskCandidates,
      icon: <WarningIcon fontSize="large" />,
      color: '#d32f2f',
    },
    {
      title: 'Joining This Week',
      value: dashboard.upcomingJoinings,
      icon: <CalendarIcon fontSize="large" />,
      color: '#388e3c',
    },
    {
      title: 'Active Stages',
      value: dashboard.candidatesByStage?.length || 0,
      icon: <TrendingUpIcon fontSize="large" />,
      color: '#f57c00',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Candidates by Risk Level
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                {dashboard.candidatesByRisk && (
                  <PieChart
                    series={[
                      {
                        data: dashboard.candidatesByRisk.map((item: any) => ({
                          id: item.riskLevel,
                          value: item._count,
                          label: item.riskLevel,
                        })),
                      },
                    ]}
                    width={400}
                    height={250}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Intelligent Insights
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  AI-powered risk predictions help identify candidates who may renege.
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip label="Sentiment Analysis" color="primary" size="small" />
                  <Chip label="Engagement Tracking" color="primary" size="small" />
                  <Chip label="Anomaly Detection" color="primary" size="small" />
                  <Chip label="Predictive Scoring" color="primary" size="small" />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Today's Recommendations:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 3 candidates require immediate follow-up
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 2 candidates showing positive engagement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 1 candidate has pending documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
