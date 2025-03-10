import React, { useState } from "react";
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
  useTheme,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";

const Careers = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      title: "Kıdemli İç Mimar",
      location: "İstanbul",
      type: "Tam Zamanlı",
      description:
        "Lüks konut ve ticari projelerde çalışacak deneyimli iç mimar arayışımız bulunmaktadır.",
      requirements: [
        "En az 5 yıl deneyim",
        "AutoCAD ve 3D Max kullanımında uzman",
        "Proje yönetimi tecrübesi",
        "İyi derecede İngilizce",
      ],
    },
    {
      title: "Proje Yöneticisi",
      location: "Ankara",
      type: "Tam Zamanlı",
      description:
        "Büyük ölçekli renovasyon projelerini yönetecek deneyimli proje yöneticisi arıyoruz.",
      requirements: [
        "En az 7 yıl deneyim",
        "PMP sertifikası",
        "Güçlü iletişim becerileri",
        "MS Project kullanım tecrübesi",
      ],
    },
    {
      title: "Peyzaj Mimarı",
      location: "İzmir",
      type: "Tam Zamanlı",
      description:
        "Yaratıcı ve sürdürülebilir peyzaj projeleri tasarlayacak peyzaj mimarı arayışımız bulunmaktadır.",
      requirements: [
        "En az 3 yıl deneyim",
        "SketchUp ve Lumion kullanımında uzman",
        "Bitki bilgisi",
        "Sürdürülebilir tasarım tecrübesi",
      ],
    },
  ];

  const handleClickOpen = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = (event) => {
    event.preventDefault();
    // Form gönderme işlemi burada yapılacak
    handleClose();
  };

  return (
    <Box sx={{ py: 8 }}>
      <Box
        sx={{
          height: "300px",
          width: "100%",
          position: "relative",
          mb: 8,
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
          alt="Kariyer fırsatları"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Kariyer Fırsatları
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
          >
            Renovatipoint ekibine katılın ve birlikte geleceği inşa edelim.
            Aşağıda açık pozisyonlarımızı inceleyebilirsiniz.
          </Typography>

          <Grid container spacing={4}>
            {jobs.map((job, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {job.title}
                      </Typography>
                      <Box
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2" color="textSecondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2" color="textSecondary">
                          {job.type}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {job.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleClickOpen(job)}
                        sx={{ mt: 2 }}
                      >
                        Başvur
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedJob?.title} Pozisyonuna Başvuru</DialogTitle>
        <form onSubmit={handleApply}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Ad" margin="dense" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Soyad" margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="E-posta"
                  type="email"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Telefon" margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Deneyim (Yıl)"
                  type="number"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Mesajınız"
                  multiline
                  rows={4}
                  margin="dense"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              Başvur
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Careers;
