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
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Button,
  TablePagination,
} from '@mui/material';
import { Visibility as ViewIcon, Refresh as RefreshIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCandidates } from '../features/candidates/candidatesSlice';

export default function Candidates() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, pagination, loading } = useAppSelector((state) => state.candidates);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: '',
    region: '',
  });

  useEffect(() => {
    dispatch(fetchCandidates({ page: pagination.page, ...filters }));
  }, [dispatch, pagination.page]);

  const handleRefresh = () => {
    dispatch(fetchCandidates({ page: pagination.page, ...filters }));
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.region) params.append('region', filters.region);

    const queryString = params.toString();
    const url = `/api/candidates/export/csv${queryString ? '?' + queryString : ''}`;

    // Create a temporary link and click it to download
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidates-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(fetchCandidates({ page: newPage + 1, ...filters }));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Candidates</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            size="small"
            label="Risk Level"
            value={filters.riskLevel}
            onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Region"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="US">US</MenuItem>
            <MenuItem value="INDIA">India</MenuItem>
            <MenuItem value="UK_EU">UK/EU</MenuItem>
          </TextField>
          <Button variant="contained" onClick={handleRefresh}>
            Apply Filters
          </Button>
        </Box>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Risk Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                list.map((candidate) => (
                  <TableRow key={candidate.id} hover>
                    <TableCell>
                      {candidate.firstName} {candidate.lastName}
                    </TableCell>
                    <TableCell>{candidate.jobTitle}</TableCell>
                    <TableCell>{candidate.currentStage?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(candidate.joiningDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.riskLevel}
                        color={getRiskColor(candidate.riskLevel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{candidate.riskScore}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[20]}
        />
      </Card>
    </Box>
  );
}
