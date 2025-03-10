import React from "react";
import { Box, Button, Typography, Paper, Stack, Chip } from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Euro,
  Business,
  Work,
} from "@mui/icons-material";

function UserInfoCard({ participant, isExpert, contactShared }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {participant.name}
        {isExpert && (
          <Chip
            label={participant.companyName || "Expert"}
            color="primary"
            size="small"
            icon={<Business />}
            sx={{ ml: 1 }}
          />
        )}
      </Typography>

      <Stack spacing={2}>
        {contactShared ? (
          <>
            {participant.phoneNumber && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone />
                <Typography>{participant.phoneNumber}</Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Email />
              <Typography>{participant.email}</Typography>
            </Box>

            {isExpert && participant.jobTitle && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Work />
                <Typography>{participant.jobTitle}</Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {participant.phoneNumber && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  href={`tel:${participant.phoneNumber}`}
                >
                  Call
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                href={`mailto:${participant.email}`}
              >
                Send Email
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="textSecondary">
            Contact information has not been shared yet
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function JobDetailsCard({ ad, chatRoom }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Job Details
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {ad.title}
          </Typography>
        </Box>

        {ad.category && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={ad.category.name}
              color="secondary"
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTime />
          <Typography>
            Last activity: {new Date(chatRoom.lastActivity).toLocaleString()}
          </Typography>
        </Box>

        {chatRoom.completionPaymentProcessed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Euro />
            <Typography>Completion fee charged: 5 €</Typography>
          </Box>
        )}

        {chatRoom.contactShared && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Euro />
            <Typography>Contact sharing fee charged: 1 €</Typography>
          </Box>
        )}

        {ad.descriptions && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {ad.descriptions}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

function HiringStatusCard({ onComplete, isExpert, isCompleted }) {
  if (!isExpert || isCompleted) return null;

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
      <Typography>Is the job completed?</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={onComplete}
        >
          YES
        </Button>
      </Box>
    </Paper>
  );
}

function ChatStatus({ chatRoom }) {
  let statusText = "";
  let color = "default";

  const hasSharedContactInfo =
    chatRoom.contactInformationShared ||
    chatRoom.contactShared ||
    chatRoom.hasContactBeenShared;

  if (chatRoom.status === "COMPLETED" || chatRoom.completed) {
    statusText = "Completed";
    color = "success";
  } else if (chatRoom.expertBlocked) {
    statusText = "Expert Blocked";
    color = "error";
  } else if (hasSharedContactInfo) {
    statusText = "Contact Shared";
    color = "info";
  } else {
    statusText = "Active";
    color = "primary";
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="subtitle1">Status:</Typography>
        <Chip label={statusText} color={color} />
      </Box>
    </Paper>
  );
}

export { HiringStatusCard, JobDetailsCard, UserInfoCard, ChatStatus };
