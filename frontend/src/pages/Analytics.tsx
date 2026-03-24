import { Box, Typography, Card, CardContent } from '@mui/material';

export default function Analytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Advanced analytics and reporting features coming soon.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This page will include:
          </Typography>
          <ul>
            <li>Offer acceptance rate trends</li>
            <li>Acceptance to joining conversion metrics</li>
            <li>Time-to-join analysis</li>
            <li>Renege reasons breakdown</li>
            <li>Region-wise performance</li>
            <li>Communication effectiveness metrics</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
