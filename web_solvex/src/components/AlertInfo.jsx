import * as React from "react";
import { Paper, Stack, Typography, Skeleton, Box } from "@mui/material";

export default function DarkStat({ label, value, loading: loadingProp }) {
  const [val, setVal] = React.useState(value ?? null);
  const [loading, setLoading] = React.useState(Boolean(loadingProp));

  // Sync con props
  React.useEffect(() => {
    if (value !== undefined) setVal(value);
  }, [value]);

  React.useEffect(() => {
    setLoading(Boolean(loadingProp));
  }, [loadingProp]);

  return (
    <Paper
      sx={{
        bgcolor: "#1E1E1E",
        color: "common.white",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Stack
        direction="column"
        alignItems="flex-start"
        spacing={1}
        sx={{ p: 2 }}
      >
        <Typography color="#9e9e9e" variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{ minHeight: 36, display: "flex", alignItems: "center" }}>
          {loading ? (
            <Skeleton variant="text" width={120} height={28} />
          ) : (
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", lineHeight: 1.2 }}
            >
              {val ?? "—"}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}