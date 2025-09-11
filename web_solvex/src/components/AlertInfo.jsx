import * as React from "react";
import { Alert, AlertTitle, Skeleton } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

export default function AlertInfo({ warning, action }) {
  // Estado local
  const [title, setTitle] = React.useState(warning?.title ?? "Advertencia");
  const [actionText, setActionText] = React.useState(
    action?.label ?? "Acción Recomendada"
  );
  const [loading, setLoading] = React.useState(
    Boolean(action?.loading || warning?.loading)
  );

  // Sincroniza cuando props cambian
  React.useEffect(() => {
    if (warning?.title !== undefined) setTitle(warning.title);
    if (action?.label !== undefined) setActionText(action.label);
    setLoading(Boolean(action?.loading || warning?.loading));
  }, [warning?.title, action?.label, action?.loading, warning?.loading]);

  return (
    <Alert
      icon={<InfoIcon sx={{ color: "#000000", fontSize: 32, marginLeft: 5}} />}
      severity="info"
      sx={{
        borderRadius: 2,
        width :"100%",
        bgcolor: "white",
        color: "black",
        border: "1px solid #f5f5f5",
      }}
    >
      <AlertTitle>{title}</AlertTitle>
      {loading ? <Skeleton variant="text" width={200} /> : actionText}
    </Alert>
  );
}