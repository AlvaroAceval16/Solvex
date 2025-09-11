import * as React from "react";
import { Paper, Stack, Typography, Skeleton, Box } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

export default function StatusBanner({ status }) {
  // status puede venir como { ok, detectedLabel, loading } o puedes no pasar nada.
  const [ok, setOk] = React.useState(Boolean(status?.ok ?? true));
  const [label, setLabel] = React.useState(
    status?.detectedLabel ?? "Componente detectado"
  );
  const [loading, setLoading] = React.useState(Boolean(status?.loading));

  // Sync con props
  React.useEffect(() => {
    if (status?.ok !== undefined) setOk(Boolean(status.ok));
    if (status?.detectedLabel !== undefined) setLabel(status.detectedLabel);
    setLoading(Boolean(status?.loading));
  }, [status?.ok, status?.detectedLabel, status?.loading]);

  return (
    <Paper sx={{ bgcolor: ok ? "#81E07B" : "#F47F7D", p: 2, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {loading ? (
          <Skeleton variant="circular" width={40} height={40} />
        ) : ok ? (
          <CheckCircleIcon sx={{ color: "#000000", fontSize: 40 }} />
        ) : (
          <CloseIcon sx={{ color: "#000000", fontSize: 40 }} />
        )}
        <Box>
          <Typography variant="h6" fontWeight={600} color="#000000">
            Estado del componente
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={160} height={24} />
          ) : (
            <Typography variant="body2" sx={{ color: "#000000" }}>
              {label}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}