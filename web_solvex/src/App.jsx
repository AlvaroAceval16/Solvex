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

/** ========== THEME ========== */
const theme = createTheme({
    typography: {
        fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
    },
    palette: {
        mode: "light",
        background: { default: "#ffffff" },
    },
    shape: { borderRadius: 5 },
    components: {
        MuiPaper: { styleOverrides: { root: { boxShadow: "0 6px 24px rgba(0,0,0,.06)" } } },
    },
});

/** ========== MOCK HOOK (sin bucles) ========== */
function useMock(data, delay = 600) {
    const [state, setState] = React.useState({ data: null, loading: true, error: null });

    const load = React.useCallback(() => {
        setState({ data: null, loading: true, error: null });
        const id = setTimeout(() => setState({ data, loading: false, error: null }), delay);
        return () => clearTimeout(id);
    }, [delay]); // OJO: sin 'data' para evitar re-renders infinitos

    React.useEffect(() => load(), [load]);

    return { ...state, reload: load };
}

/** ========== WIDGET DE MÉTRICAS ========== */
function DarkStat({ label, value, loading }) {
    return (
        <Paper sx={{ bgcolor: "#1E1E1E", color: "common.white", borderRadius: 2, width:"100%"}}>
            <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ p: 2 }}>
                <Typography color="#757575" variant="body1" sx={{ fontWeight: "600" }}>{label}</Typography>
                {loading ? (
                    <Skeleton variant="text" width={160} height={32} />
                ) : (
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{value ?? "—"}</Typography>
                )}
            </Stack>
        </Paper>
    );
}

/** ========== FILA DE HISTORIAL ========== */
function HistoryRow({ item }) {
    const date = new Date(item.dateISO);
    const fecha = date.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
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
                <Avatar variant="rounded" sx={{ bgcolor: "grey.200", width: 100, height: 106 }} src={item.thumbnailUrl}>
                    {!item.thumbnailUrl && <ImageIcon sx={{ color: "grey.500" }} />}
                </Avatar>
            </ListItemAvatar>

            {/* Evitamos <div> dentro de <p> forzando 'component: div' en secundarios */}
            <ListItemText
                primary={<Typography fontWeight={600}>{item.title}</Typography>}
                secondary={
                    <>
                        <Typography variant="body2" color="#757575" sx={{ fontWeight: 600 }} component="div">{item.subtitle}</Typography>
                        <Typography variant="body2" color="#757575" component="div">Fecha del análisis: {fecha}</Typography>
                        <Typography variant="body2" color="#757575" component="div">Hora del análisis: {hora}</Typography>
                    </>
                }
            />
        </ListItem>
    );
}

/** ========== APP WRAPPER (FULL HEIGHT) ========== */
export default function SolvexPageWrapper() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Contenedor de página: flex columna + ocupa todo el viewport */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",   // toda la altura de la ventana
                    width: "100vw",
                    paddingX: 4,
                    paddingTop: 2,
                    bgcolor: "background.default",
                }}
            >
                {/* Contenido principal que CRECE */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: { xs: 2, md: 4 }, minHeight: 0 ,
                    width: "100%"}}>
                    <SolvexInspection title="Solvex" />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

/** ========== PANTALLA PRINCIPAL ========== */
function SolvexInspection({ title }) {
    // Simulaciones
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
        // Este Stack es el contenedor vertical de TODA la pantalla
        <Stack spacing={3} sx={{ flex: 1, minHeight: 0 }}>
            {/* Header (altura fija) */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ width: 56, height: 56, bgcolor: "grey.300", borderRadius: 2 }} />
                <Typography variant="h3" fontWeight={700}>{title}</Typography>
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Actualizar">
                    <Button onClick={refreshAll} startIcon={<RefreshIcon />} variant="outlined" disabled={anyLoading}
                            sx={{
                                bgcolor: "white",
                                color: "black",
                                borderColor: "#f5f5f5",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    bgcolor: "#f5f5f5",
                                    borderColor: "#bdbdbd",
                                },
                            }}
                    >
                        Recargar
                    </Button>
                </Tooltip>
            </Stack>

            {/* Alerta (altura fija) */}
            <Alert
                icon={<InfoIcon sx={{ color: "#000000", fontSize: 32 }} />}
                severity="info"
                sx={{
                    borderRadius: 2,
                    bgcolor: "white",
                    color: "black",
                    border: "1px solid #f5f5f5",
                }}
            >
                <AlertTitle>{warning.data?.title ?? "Advertencia"}</AlertTitle>
                {action.loading ? (
                    <Skeleton variant="text" width={200} />
                ) : (
                    action.data?.label ?? "Acción Recomendada"
                )}
            </Alert>
            {/* Zona central (DEBE CRECER): izquierda imagen, derecha stats */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                sx={{ flex: 1, minHeight: 0 }}
            >
                {/* COLUMNA IZQUIERDA: Imagen (crece) */}
                <Box sx={{display: "flex", flexDirection: "column", minHeight: 0, paddingRight:10}}>
                    <Typography variant="subtitle1" marginBottom={2} sx={{ fontWeight: 600, fontSize: "1.25rem" }}>Inspección del componente</Typography>

                    <Paper
                        sx={{
                            width: 900,
                            height: 500,
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            overflow: "hidden",
                        }}
                    >
                        {image.loading ? (
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        ) : (
                            <Box
                                component="img"
                                src={image.data?.url}
                                alt="Inspección"
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        )}
                    </Paper>
                </Box>

                {/* COLUMNA DERECHA: Estado + métricas (columna que se estira) */}
                <Box
                    sx={{
                        flex: { xs: "1 1 auto", md: "1 1 0" },
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 280,
                        minHeight: 0,           // <-- importante en layouts con flex hijos
                    }}
                >
                    <Stack spacing={2.5} sx={{ flex: 1, minHeight: 0, width:"100%" }} paddingY={7}>
                        {/* Estado */}
                        <Paper sx={{ bgcolor: status.data?.ok ? "#81E07B" : "#F47F7D", color: "success.contrastText", p: 2, borderRadius: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={3}>
                                {status.loading ? (
                                    <Skeleton variant="circular" width={24} height={24} />
                                ) : status.data?.ok ? (
                                    <CheckCircleIcon sx={{ color: "#000000", fontSize: 40 }} />
                                    ) : (
                                    <CloseIcon sx={{ color: "#000000" , fontSize: 40}} />
                            )}
                                <Box>
                                    <Typography variant="h6" fontWeight={600} color="#000000">Estado del componente</Typography>
                                    {status.loading ? (
                                        <Skeleton variant="text" width={160} height={24} />
                                    ) : (
                                        <Typography variant="body2" color="#000000" variant="h7">
                                            {status.data?.detectedLabel ?? (status.data?.ok ? "Componente detectado" : "No detectado")}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Métricas */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>Datos de análisis</Typography>
                        <DarkStat label="Humedad" value={humidity.data ? `${humidity.data.value}${humidity.data.unit ?? "%"}` : undefined} loading={humidity.loading} />
                        <DarkStat label="Temperatura" value={temperature.data ? `${temperature.data.value}${temperature.data.unit ?? "°C"}` : undefined} loading={temperature.loading} />
                        <DarkStat label="Luz ambiental" value={lux.data ? `${lux.data.value}${lux.data.unit ?? " lx"}` : undefined} loading={lux.loading} />
                    </Stack>
                </Box>
            </Stack>

            {/* Historial (no crece, queda al final; si quieres que crezca, añade flex:1 aquí y minHeight:0) */}
            <Box sx={{ flexShrink: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "1.25rem" }} marginBottom={2}>Historial</Typography>
                <Paper sx={{ p: 0, borderRadius: 2, border: "1px solid #f5f5f5"}}>
                    {history.loading ? (
                        <Stack spacing={0}>
                            <Skeleton variant="rectangular" height={76} />
                            <Divider sx={{ borderColor: "#f5f5f5" }}/>
                            <Skeleton variant="rectangular" height={76} />
                        </Stack>
                    ) : (
                        <List disablePadding>
                            {(history.data ?? []).map((it) => (
                                <React.Fragment key={it.id}>
                                    <HistoryRow item={it} />
                                    <Divider sx={{ borderColor: "#f5f5f5" }} />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>

            {/* Errores globales (no crece) */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flexShrink: 0 }}>
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
