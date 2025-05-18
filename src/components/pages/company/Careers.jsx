import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { MapPinIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Careers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleClickOpen = (position) => {
    setSelectedPosition(position);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPosition(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here
    handleClose();
  };

  const positions = [
    {
      id: 1,
      type: "seniorInterior",
      location: "istanbul",
    },
    {
      id: 2,
      type: "projectManager",
      location: "ankara",
    },
    {
      id: 3,
      type: "landscapeArchitect",
      location: "izmir",
    },
  ];

  return (
    <Box className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <Box className="relative h-[40vh]">
        <Box
          component="img"
          src="/images/careers-hero.jpg"
          alt={t("company.careers.hero.alt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <Box className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Box className="text-center text-white">
            <Typography variant="h2" component="h1" className="mb-4">
              {t("company.careers.hero.title")}
            </Typography>
            <Typography variant="h5">
              {t("company.careers.hero.description")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" className="py-16">
        <Typography variant="body1" className="text-center mb-12">
          {t("company.careers.description")}
        </Typography>

        <Grid container spacing={4}>
          {positions.map((position) => (
            <Grid item xs={12} md={4} key={position.id}>
              <Card className="h-full">
                <CardContent className="h-full flex flex-col">
                  <Typography variant="h5" component="h2" className="mb-4">
                    {t(`company.careers.positions.${position.type}.title`)}
                  </Typography>

                  <Box className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <Typography variant="body2" color="textSecondary">
                      {t(`company.careers.locations.${position.location}`)}
                    </Typography>
                  </Box>

                  <Box className="flex items-center gap-2 mb-4">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <Typography variant="body2" color="textSecondary">
                      {t("company.careers.types.fullTime")}
                    </Typography>
                  </Box>

                  <Typography variant="body1" className="mb-4 flex-grow">
                    {t(
                      `company.careers.positions.${position.type}.description`
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-4"
                  >
                    {t(
                      `company.careers.positions.${position.type}.requirements`
                    )}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleClickOpen(position)}
                  >
                    {t("company.careers.apply")}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Application Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          {t("company.careers.form.title")}
          <IconButton onClick={handleClose} size="small">
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t("company.careers.form.firstName")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t("company.careers.form.lastName")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label={t("company.careers.form.email")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t("company.careers.form.phone")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label={t("company.careers.form.experience")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label={t("company.careers.form.message")}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleClose} color="inherit">
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {t("company.careers.form.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Careers;
