import * as React from "react";
import {
    Box,
    Container,
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

// ------- Theme -------
const theme = createTheme({
    shape: { borderRadius: 16 },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: "0 6px 24px rgba(0,0,0,.06)" },
            },
        },
    },
});

// ------- Helpers -------
async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
}

// ---- Mocks ----
const ENABLE_MOCKS = true; // <— ponlo en false cuando conectes el backend
const MOCK_DELAY = 500; // ms
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Devuelve una función async que:
 * - si ENABLE_MOCKS === true o no hay URL, resuelve con el mock tras delay
 * - si ENABLE_MOCKS === false, intenta fetch(url) y si falla cae al mock (fallback)
 */
function withMock(url, mockFn, { fallback = true, delay = MOCK_DELAY } = {}) {
    return async () => {
        if (!url || ENABLE_MOCKS) {
            if (mockFn) { await sleep(delay); return mockFn(); }
            return null;
        }
        try {
            return await fetchJSON(url);
        } catch (e) {
            if (fallback && mockFn) { await sleep(delay); return mockFn(); }
            throw e;
        }
    };
}

/**
 * Hook que acepta:
 *  - una URL string   -> hará fetch
 *  - una función async -> ejecutará esa función (ideal para mocks)
 */
function useEndpoint(source, refreshMs) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(!!source);
    const [error, setError] = React.useState(null);

    const load = React.useCallback(async () => {
        if (!source) return;
        setLoading(true);
        setError(null);
        try {
            const d = typeof source === "function" ? await source() : await fetchJSON(source);
            setData(d);
        } catch (e) {
            setError(e?.message ?? "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [source]);

    React.useEffect(() => { load(); }, [load]);

    React.useEffect(() => {
        if (!refreshMs || !source) return;
        const id = setInterval(load, refreshMs);
        return () => clearInterval(id);
    }, [refreshMs, source, load]);

    return { data, loading, error, reload: load };
}

// ------- Reusable Stat Card -------
function DarkStat({ label, value, loading }) {
    return (
        <Paper sx={{ bgcolor: "grey.900", color: "common.white", borderRadius: 2 }}>
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
                    {item.ok ? <CheckCircleIcon sx={{ color: "success.main" }} /> : <CloseIcon sx={{ color: "error.main" }} />}
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
            />
        </ListItem>
    );
}

// ------- Demo Wrapper (puedes reemplazar por tu router) -------
export default function SolvexPageWrapper() {
    const endpoints = {
        status: "/api/inspeccion/123/estado",
        humidity: "/api/inspeccion/123/humedad",
        temperature: "/api/inspeccion/123/temperatura",
        lux: "/api/inspeccion/123/luz",
        image: "/api/inspeccion/123/imagen",
        warning: "/api/inspeccion/123/advertencia",
        action: "/api/inspeccion/123/accion-recomendada",
        history: "/api/inspeccion/123/historial",
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <SolvexInspection title="Solvex" endpoints={endpoints} refreshMs={15000} />
            </Container>
        </ThemeProvider>
    );
}

// ------- Main Component -------
function SolvexInspection({ title, endpoints, refreshMs }) {
    // Aquí usamos mocks. Cuando tengas backend, deja ENABLE_MOCKS=false y listo.
    const status = useEndpoint(
        withMock(endpoints.status, () => ({ ok: true, detectedLabel: "Componente detectado" })),
        refreshMs
    );
    const humidity = useEndpoint(
        withMock(endpoints.humidity, () => ({ value: 30.58, unit: "%" })),
        refreshMs
    );
    const temperature = useEndpoint(
        withMock(endpoints.temperature, () => ({ value: 28, unit: "°C" })),
        refreshMs
    );
    const lux = useEndpoint(
        withMock(endpoints.lux, () => ({ value: 120, unit: " lx" })),
        refreshMs
    );
    const image = useEndpoint(
        withMock(endpoints.image, () => ({ url: "https://via.placeholder.com/800x600?text=Inspeccion" })),
        refreshMs
    );
    const warning = useEndpoint(
        withMock(endpoints.warning, () => ({ title: "Advertencia", description: "—" })),
        refreshMs
    );
    const action = useEndpoint(
        withMock(endpoints.action, () => ({ label: "Acción Recomendada" })),
        refreshMs
    );
    const history = useEndpoint(
        withMock(endpoints.history, () => ([
            { id: 1, title: "Componente 1", subtitle: "Componente correcto", dateISO: new Date(Date.now() - 86400000 * 2).toISOString(), ok: true },
            { id: 2, title: "Componente 2", subtitle: "Componente defectuoso", dateISO: new Date(Date.now() - 86400000 * 1).toISOString(), ok: false },
        ])),
        refreshMs
    );

    const anyLoading = [status, humidity, temperature, lux, image, warning, action, history].some(s => s.loading);
    const refreshAll = () => {
        [status, humidity, temperature, lux, image, warning, action, history].forEach(s => s.reload && s.reload());
    };

    return (
        <>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ width: 56, height: 56, bgcolor: "grey.300", borderRadius: 2 }} />
                <Typography variant="h3" fontWeight={700}>{title}</Typography>
                <Box flex={1} />
                <Tooltip title="Actualizar">
                    <Button onClick={refreshAll} startIcon={<RefreshIcon />} variant="outlined" disabled={anyLoading}>
                        Recargar
                    </Button>
                </Tooltip>
            </Stack>

            {/* Alertas */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                {warning.loading ? (
                    <Skeleton variant="text" width={180} />
                ) : (
                    <Alert icon={<InfoIcon />} severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                        <AlertTitle>{warning.data?.title ?? "Advertencia"}</AlertTitle>
                        {action.loading ? <Skeleton variant="text" width={200} /> : (action.data?.label ?? "Acción Recomendada")}
                    </Alert>
                )}
            </Paper>

            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                {/* Imagen / Inspección */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Inspección del componente</Typography>
                    <Paper
                        sx={{
                            p: 0,
                            height: 360,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            overflow: "hidden",
                        }}
                    >
                        {image.loading ? (
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        ) : image.error ? (
                            <Stack alignItems="center" spacing={1}>
                                <ImageIcon sx={{ fontSize: 64, color: "grey.400" }} />
                                <Typography variant="caption" color="text.secondary">No se pudo cargar la imagen</Typography>
                            </Stack>
                        ) : (
                            <Box component="img" src={image.data?.url} alt="Inspección" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                    </Paper>
                </Box>

                {/* Estado + Datos */}
                <Box sx={{ width: { xs: "100%", md: 380 } }}>
                    <Stack spacing={2}>
                        <Paper
                            sx={{
                                bgcolor: status.data?.ok ? "success.light" : "warning.light",
                                color: "success.contrastText",
                                p: 2,
                                borderRadius: 2,
                            }}
                        >
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
                        <DarkStat
                            label="Humedad"
                            value={humidity.data ? `${humidity.data.value}${humidity.data.unit ?? "%"}` : undefined}
                            loading={humidity.loading}
                        />
                        <DarkStat
                            label="Temperatura"
                            value={temperature.data ? `${temperature.data.value}${temperature.data.unit ?? "°C"}` : undefined}
                            loading={temperature.loading}
                        />
                        <DarkStat
                            label="Luz ambiental"
                            value={lux.data ? `${lux.data.value}${lux.data.unit ?? " lx"}` : undefined}
                            loading={lux.loading}
                        />
                    </Stack>
                </Box>
            </Stack>

            {/* Historial */}
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>Historial</Typography>
            <Paper sx={{ p: 0, borderRadius: 2 }}>
                {history.loading ? (
                    <Stack spacing={0}>
                        <Skeleton variant="rectangular" height={76} />
                        <Divider />
                        <Skeleton variant="rectangular" height={76} />
                    </Stack>
                ) : history.error ? (
                    <Stack alignItems="center" p={2}>
                        <Typography variant="body2" color="text.secondary">No se pudo cargar el historial.</Typography>
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

            {/* Errores globales (chips) */}
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {[status, humidity, temperature, lux, image, warning, action, history]
                    .map((s, i) => ({ idx: i, err: s.error }))
                    .filter(x => !!x.err)
                    .map(x => (
                        <Chip key={x.idx} color="error" variant="outlined" label={`Err ${x.idx + 1}: ${x.err}`} />
                    ))}
            </Stack>
        </>
    );
}

