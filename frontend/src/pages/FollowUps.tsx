import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../services/api';

interface FollowUp {
  candidateName: string;
  followUpDate: string;
  daysSinceJoining: number;
  assignedTo: string;
  status: 'Pending' | 'Completed';
  notes: string;
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchFollowUps();
    fetchSheetUrl();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const response = await api.get('/follow-ups/pending');
      setFollowUps(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('Failed to load follow-ups. Google Sheets may not be configured.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetUrl = async () => {
    try {
      const response = await api.get('/follow-ups/tracking-sheet');
      if (response.data.data.url) {
        setSheetUrl(response.data.data.url);
      }
    } catch (err) {
      console.error('Error fetching sheet URL:', err);
    }
  };

  const handleCompleteClick = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setNotes(followUp.notes || '');
    setDialogOpen(true);
  };

  const handleComplete = async () => {
    if (!selectedFollowUp) return;

    try {
      await api.post('/follow-ups/complete', {
        candidateName: selectedFollowUp.candidateName,
        followUpDate: selectedFollowUp.followUpDate,
        assignedTo: selectedFollowUp.assignedTo,
        notes,
      });

      setDialogOpen(false);
      setSelectedFollowUp(null);
      setNotes('');
      fetchFollowUps();
    } catch (err) {
      console.error('Error completing follow-up:', err);
      alert('Failed to complete follow-up');
    }
  };

  const getDaysBadgeColor = (days: number) => {
    if (days === 10) return 'primary';
    if (days === 15) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Follow-up Tracking</Typography>
        <Box display="flex" gap={1}>
          {sheetUrl && (
            <Button
              variant="outlined"
              startIcon={<OpenIcon />}
              onClick={() => window.open(sheetUrl, '_blank')}
            >
              Open Google Sheet
            </Button>
          )}
          <IconButton onClick={fetchFollowUps}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Pending Follow-ups
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Follow-ups are scheduled at 10, 15, and 20 days after candidate joining date.
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Follow-up Date</TableCell>
                <TableCell>Days Since Joining</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : followUps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No pending follow-ups
                  </TableCell>
                </TableRow>
              ) : (
                followUps.map((followUp, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {followUp.candidateName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(followUp.followUpDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Day ${followUp.daysSinceJoining}`}
                        color={getDaysBadgeColor(followUp.daysSinceJoining)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{followUp.assignedTo}</TableCell>
                    <TableCell>
                      <Chip
                        label={followUp.status}
                        color={followUp.status === 'Completed' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {followUp.status === 'Pending' && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleCompleteClick(followUp)}
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Follow-up</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              <strong>Candidate:</strong> {selectedFollowUp?.candidateName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong>{' '}
              {selectedFollowUp &&
                format(new Date(selectedFollowUp.followUpDate), 'MMM dd, yyyy')}
            </Typography>
            <Typography variant="body2" gutterBottom mb={2}>
              <strong>Days Since Joining:</strong> {selectedFollowUp?.daysSinceJoining}
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              placeholder="Add notes about the conversation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleComplete} variant="contained">
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
