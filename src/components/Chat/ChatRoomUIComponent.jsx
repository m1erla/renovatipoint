import React from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Euro,
} from "@mui/icons-material";

function UserInfoCard({ expert }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {expert.name}
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Phone />
          <Typography>{expert.phone}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Email />
          <Typography>{expert.email}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="primary" fullWidth>
            Call
          </Button>
          <Button variant="outlined" color="primary" fullWidth>
            E-mail
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

function JobDetailsCard({ jobDetails }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Job Details
      </Typography>

      <Stack spacing={2}>
        {jobDetails.directRequest && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#f3e5f5",
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography>Direct Request</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>{jobDetails.comments} comment</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTime />
          <Typography>{jobDetails.timeAgo} before</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Euro />
          <Typography>Charged {jobDetails.amount} € from you.</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOn />
          <Typography>{jobDetails.location}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function HiringStatusCard() {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "#f3e5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography>Is job done?</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" color="primary" size="small">
          YES
        </Button>
        <Button variant="outlined" color="primary" size="small">
          NO
        </Button>
      </Box>
    </Paper>
  );
}

export { HiringStatusCard, JobDetailsCard, UserInfoCard };
