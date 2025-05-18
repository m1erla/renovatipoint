import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Typography, Button } from "@mui/material";
import { XCircleIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box className="min-h-screen flex items-center justify-center bg-background">
      <Box className="text-center">
        <XCircleIcon className="w-20 h-20 mx-auto text-destructive mb-4" />
        <Typography variant="h4" component="h1" className="mb-4">
          {t("pages.unauthorized.title")}
        </Typography>
        <Typography variant="body1" className="mb-8 text-muted-foreground">
          {t("pages.unauthorized.description")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          className="px-8"
        >
          {t("pages.unauthorized.button")}
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;
