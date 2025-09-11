import * as React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";

export default function HistoryRow({ item }) {
  const date = new Date(item.dateISO);
  const fecha = date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hora = date.toLocaleTimeString("es-MX", { hour12: false });

  return (
    <ListItem
      sx={{ px: 2, py: 1.5, width: "100%" }}
      secondaryAction={
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 32,
            color: "white",
            backgroundColor: item.ok ? "#81E07B" : "#F47F7D",
            borderRadius: "50%",
            padding: 8,
          }}
        >
          {item.ok ? "check" : "close"}
        </span>
      }
    >
      <ListItemAvatar sx={{ mr: 2 }}>
        <Avatar
          variant="rounded"
          sx={{ bgcolor: "grey.200", width: 100, height: 106 }}
          src={item.thumbnailUrl}
        >
          {!item.thumbnailUrl && <ImageIcon sx={{ color: "grey.500" }} />}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={<Typography fontWeight={600}>{item.title}</Typography>}
        secondary={
          <>
            <Typography
              variant="body2"
              color="#757575"
              sx={{ fontWeight: 600 }}
              component="div"
            >
              {item.subtitle}
            </Typography>
            <Typography variant="body2" color="#757575" component="div">
              Fecha del análisis: {fecha}
            </Typography>
            <Typography variant="body2" color="#757575" component="div">
              Hora del análisis: {hora}
            </Typography>
          </>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
    </ListItem>
  );
}