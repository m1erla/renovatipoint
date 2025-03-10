import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentDialog = ({ open, onClose, amount }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 60,
            color: "success.main",
            mb: 2,
          }}
        />
        <Typography variant="h5" component="div">
          Ödeme Başarılı!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {amount} € tutarındaki ödemeniz başarıyla gerçekleştirildi.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ödeme detayları e-posta adresinize gönderilecektir.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
          }}
        >
          Tamam
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
