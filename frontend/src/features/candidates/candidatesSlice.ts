import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  joiningDate: string;
  currentStage: {
    name: string;
  };
  riskLevel: string;
  riskScore: number;
}

interface CandidatesState {
  list: Candidate[];
  selectedCandidate: any;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CandidatesState = {
  list: [],
  selectedCandidate: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async (params: any = {}) => {
    const response = await api.get('/candidates', { params });
    return response.data.data;
  }
);

export const fetchCandidateById = createAsyncThunk(
  'candidates/fetchById',
  async (id: string) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data.data;
  }
);

export const fetchRiskAssessment = createAsyncThunk(
  'candidates/fetchRisk',
  async (id: string) => {
    const response = await api.get(`/candidates/${id}/risk`);
    return response.data.data;
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.candidates;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchRiskAssessment.fulfilled, (state, action) => {
        if (state.selectedCandidate) {
          state.selectedCandidate.riskAssessment = action.payload;
        }
      });
  },
});

export default candidatesSlice.reducer;
