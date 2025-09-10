import * as React from "react";
import {
    Box,
    Typography,
    Stack,
    Paper,
    Alert,
    AlertTitle,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Chip,
    Skeleton,
    Tooltip,
    Button,
} from "@mui/material";
import {
    Image as ImageIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Info as InfoIcon,
    Replay as RefreshIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ------- Theme -------
const theme = createTheme({
    palette: {
        mode: "light", // cambia a "dark" si quieres modo oscuro
        background: { default: "#f5f5f5" },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: "0 6px 24px rgba(0,0,0,.06)" },
            },
        },
    },
});

// ------- Hook simulado con datos dummy -------
// IMPORTANTE: no dependemos de 'data' para evitar bucles de render.
function useMock(data, delay = 800) {
    const [state, setState] = React.useState({ data: null, loading: true, error: null });

    const load = React.useCallback(() => {
        setState({ data: null, loading: true, error: null });
        const id = setTimeout(() => {
            setState({ data, loading: false, error: null });
        }, delay);
        return () => clearTimeout(id);
    }, [delay]); // <-- sin 'data' aquí

    React.useEffect(() => { load(); }, [load]);

    return { ...state, reload: load };
}

// ------- Reusable Stat Card -------
function DarkStat({ label, value, loading }) {
    return (
        <Paper sx={{ bgcolor: "grey.900", color: "common.white", borderRadius: 2, flex: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>{label}</Typography>
                {loading ? (
                    <Skeleton variant="text" width={80} height={36} />
                ) : (
                    <Typography variant="h5" fontWeight={800}>{value ?? "—"}</Typography>
                )}
            </Stack>
        </Paper>
    );
}

function HistoryRow({ item }) {
    const date = new Date(item.dateISO);
    const fecha = date.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
    const hora = date.toLocaleTimeString("es-MX", { hour12: false });
    return (
        <ListItem
            sx={{ px: 2, py: 1.5 }}
            secondaryAction={
                <IconButton edge="end" aria-label={item.ok ? "aprobado" : "rechazado"}>
                    {item.ok ? (
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                    ) : (
                        <CloseIcon sx={{ color: "error.main" }} />
                    )}
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar variant="rounded" sx={{ bgcolor: "grey.200", width: 48, height: 48 }} src={item.thumbnailUrl}>
                    {!item.thumbnailUrl && <ImageIcon sx={{ color: "grey.500" }} />}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={<Typography fontWeight={700}>{item.title}</Typography>}
                secondary={
                    <Stack spacing={0.2}>
                        <Typography variant="body2" color="text.primary">{item.subtitle}</Typography>
                        <Typography variant="caption" color="text.secondary">Fecha del análisis: {fecha}</Typography>
                        <Typography variant="caption" color="text.secondary">Hora del análisis: {hora}</Typography>
                    </Stack>
                }
                // <-- evita <div> dentro de <p>
                secondaryTypographyProps={{ component: "div" }}
            />
        </ListItem>
    );
}

// ------- Main Component -------
export default function SolvexPageWrapper() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex" }}>
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
                    <SolvexInspection title="Solvex" />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

function SolvexInspection({ title }) {
    // Datos simulados
    const status = useMock({ ok: true, detectedLabel: "Componente detectado" });
    const humidity = useMock({ value: 30.58, unit: "%" });
    const temperature = useMock({ value: 28, unit: "°C" });
    const lux = useMock({ value: 120, unit: " lx" });
    const image = useMock({ url: "https://via.placeholder.com/1200x800.png?text=Inspeccion" });
    const warning = useMock({ title: "Advertencia" });
    const action = useMock({ label: "Acción Recomendada" });
    const history = useMock([
        { id: 1, title: "Componente 1", subtitle: "Componente correcto", dateISO: "2025-09-08T17:26:47Z", ok: true },
        { id: 2, title: "Componente 2", subtitle: "Componente defectuoso", dateISO: "2025-09-10T12:34:56Z", ok: false },
    ]);

    const anyLoading = [status, humidity, temperature, lux, image, warning, action, history].some(s => s.loading);

    const refreshAll = () => {
        [status, humidity, temperature, lux, image, warning, action, history].forEach(s => s.reload());
    };

    return (
        <Stack spacing={3} sx={{ height: "100%" }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ width: 56, height: 56, bgcolor: "grey.300", borderRadius: 2 }} />
                <Typography variant="h3" fontWeight={700}>{title}</Typography>
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Actualizar">
                    <Button onClick={refreshAll} startIcon={<RefreshIcon />} variant="outlined" disabled={anyLoading}>Recargar</Button>
                </Tooltip>
            </Stack>

            {/* Alertas */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                {warning.loading ? (
                    <Skeleton variant="text" width={180} />
                ) : (
                    <Alert icon={<InfoIcon />} severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                        <AlertTitle>{warning.data?.title ?? "Advertencia"}</AlertTitle>
                        {action.loading ? <Skeleton variant="text" width={200} /> : (action.data?.label ?? "Acción Recomendada")}
                    </Alert>
                )}
            </Paper>

            {/* Inspección + Datos */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} flex={1}>
                {/* Imagen grande */}
                <Box sx={{ flex: { xs: "1 1 auto", md: "2 1 0" }, display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Inspección del componente</Typography>
                    <Paper
                        sx={{
                            flex: 1,
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            overflow: "hidden",
                            minHeight: { xs: 220, sm: 280, md: 360, lg: 420 },
                        }}
                    >
                        {image.loading ? (
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        ) : (
                            <Box component="img" src={image.data?.url} alt="Inspección" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                    </Paper>
                </Box>

                {/* Estado + Datos */}
                <Box sx={{ flex: { xs: "1 1 auto", md: "1 1 0" }, minWidth: 280 }}>
                    <Stack spacing={2} sx={{ height: "100%" }}>
                        <Paper sx={{ bgcolor: status.data?.ok ? "success.light" : "warning.light", color: "success.contrastText", p: 2, borderRadius: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {status.loading ? (
                                    <Skeleton variant="circular" width={24} height={24} />
                                ) : status.data?.ok ? (
                                    <CheckCircleIcon />
                                ) : (
                                    <CloseIcon />
                                )}
                                <Box>
                                    <Typography fontWeight={700}>Estado del componente</Typography>
                                    {status.loading ? (
                                        <Skeleton variant="text" width={160} />
                                    ) : (
                                        <Typography variant="body2">
                                            {status.data?.detectedLabel ?? (status.data?.ok ? "Componente detectado" : "No detectado")}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </Paper>

                        <Typography variant="subtitle1">Datos de análisis</Typography>
                        <DarkStat label="Humedad" value={humidity.data ? `${humidity.data.value}${humidity.data.unit ?? "%"}` : undefined} loading={humidity.loading} />
                        <DarkStat label="Temperatura" value={temperature.data ? `${temperature.data.value}${temperature.data.unit ?? "°C"}` : undefined} loading={temperature.loading} />
                        <DarkStat label="Luz ambiental" value={lux.data ? `${lux.data.value}${lux.data.unit ?? " lx"}` : undefined} loading={lux.loading} />
                    </Stack>
                </Box>
            </Stack>

            {/* Historial */}
            <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Historial</Typography>
                <Paper sx={{ p: 0, borderRadius: 2 }}>
                    {history.loading ? (
                        <Stack spacing={0}>
                            <Skeleton variant="rectangular" height={76} />
                            <Divider />
                            <Skeleton variant="rectangular" height={76} />
                        </Stack>
                    ) : (
                        <List disablePadding>
                            {(history.data ?? []).map((it) => (
                                <React.Fragment key={it.id}>
                                    <HistoryRow item={it} />
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>

            {/* Errores globales */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
                {[status, humidity, temperature, lux, image, warning, action, history]
                    .map((s, i) => ({ idx: i, err: s.error }))
                    .filter(x => !!x.err)
                    .map(x => (
                        <Chip key={x.idx} color="error" variant="outlined" label={`Err ${x.idx + 1}: ${x.err}`} />
                    ))}
            </Stack>
        </Stack>
    );
}
