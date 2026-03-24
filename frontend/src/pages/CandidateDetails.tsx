import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCandidateById, fetchRiskAssessment } from '../features/candidates/candidatesSlice';
import axios from 'axios';

export default function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedCandidate } = useAppSelector((state) => state.candidates);
  const [schedulingFollowUps, setSchedulingFollowUps] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCandidateById(id));
      dispatch(fetchRiskAssessment(id));
    }
  }, [id, dispatch]);

  const handleScheduleFollowUps = async () => {
    if (!id) return;

    try {
      setSchedulingFollowUps(true);
      await axios.post(`/api/follow-ups/candidates/${id}/schedule`);
      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 5000);
    } catch (error) {
      console.error('Error scheduling follow-ups:', error);
      alert('Failed to schedule follow-ups. Google Calendar may not be configured.');
    } finally {
      setSchedulingFollowUps(false);
    }
  };

  if (!selectedCandidate) {
    return <Typography>Loading...</Typography>;
  }

  const candidate = selectedCandidate;
  const riskAssessment = candidate.riskAssessment;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Candidate Details</Typography>
        <Button
          variant="contained"
          startIcon={<CalendarIcon />}
          onClick={handleScheduleFollowUps}
          disabled={schedulingFollowUps}
        >
          {schedulingFollowUps ? 'Scheduling...' : 'Schedule Follow-ups'}
        </Button>
      </Box>

      {scheduleSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Follow-ups scheduled successfully! Calendar events created for day 10, 15, and 20.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {candidate.firstName} {candidate.lastName}
              </Typography>
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Chip
                  icon={<EmailIcon />}
                  label={candidate.email}
                  variant="outlined"
                  size="small"
                />
                {candidate.phone && (
                  <Chip
                    icon={<PhoneIcon />}
                    label={candidate.phone}
                    variant="outlined"
                    size="small"
                  />
                )}
                {candidate.location && (
                  <Chip
                    icon={<LocationIcon />}
                    label={candidate.location}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Job Title
                  </Typography>
                  <Typography variant="body1">{candidate.jobTitle}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Joining Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(candidate.joiningDate), 'MMMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Stage
                  </Typography>
                  <Typography variant="body1">
                    {candidate.currentStage?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Work Arrangement
                  </Typography>
                  <Typography variant="body1">{candidate.workArrangement}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Communication History
              </Typography>
              <List>
                {candidate.communications?.slice(0, 5).map((comm: any, index: number) => (
                  <Box key={comm.id}>
                    <ListItem>
                      <ListItemText
                        primary={comm.subject || comm.type}
                        secondary={
                          <>
                            {comm.sentAt && format(new Date(comm.sentAt), 'MMM dd, yyyy hh:mm a')}
                            {comm.sentimentLabel && (
                              <Chip
                                label={comm.sentimentLabel}
                                size="small"
                                sx={{ ml: 1 }}
                                color={
                                  comm.sentimentLabel === 'POSITIVE'
                                    ? 'success'
                                    : comm.sentimentLabel === 'NEGATIVE'
                                    ? 'error'
                                    : 'default'
                                }
                              />
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </Box>
                ))}
              </List>
              {(!candidate.communications || candidate.communications.length === 0) && (
                <Typography color="text.secondary">No communications yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ownership
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  TA Owner
                </Typography>
                <Typography>
                  {candidate.taOwner?.firstName} {candidate.taOwner?.lastName}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Hiring Manager
                </Typography>
                <Typography>
                  {candidate.hmOwner?.firstName} {candidate.hmOwner?.lastName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  HR Operations
                </Typography>
                <Typography>
                  {candidate.hrOwner?.firstName} {candidate.hrOwner?.lastName}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {riskAssessment && (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <WarningIcon color="error" />
                  <Typography variant="h6">AI Risk Assessment</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Score
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={riskAssessment.riskScore}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      color={
                        riskAssessment.riskLevel === 'HIGH' ||
                        riskAssessment.riskLevel === 'CRITICAL'
                          ? 'error'
                          : riskAssessment.riskLevel === 'MEDIUM'
                          ? 'warning'
                          : 'success'
                      }
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {riskAssessment.riskScore}%
                    </Typography>
                  </Box>
                  <Chip
                    label={riskAssessment.riskLevel}
                    color={
                      riskAssessment.riskLevel === 'HIGH' ||
                      riskAssessment.riskLevel === 'CRITICAL'
                        ? 'error'
                        : riskAssessment.riskLevel === 'MEDIUM'
                        ? 'warning'
                        : 'success'
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                {riskAssessment.factors && (
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Risk Factors
                    </Typography>
                    {riskAssessment.factors.slice(0, 3).map((factor: any, index: number) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        • {factor.factor}
                      </Typography>
                    ))}
                  </Box>
                )}

                {riskAssessment.recommendations && (
                  <Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Recommended Actions
                    </Typography>
                    {riskAssessment.recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <Alert key={index} severity="info" sx={{ mb: 1, py: 0 }}>
                        <Typography variant="caption">{rec}</Typography>
                      </Alert>
                    ))}
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                  Confidence: {((riskAssessment.confidence || 0) * 100).toFixed(0)}%
                  <br />
                  Method: {riskAssessment.method || 'AI Model'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
