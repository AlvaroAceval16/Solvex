import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import StatusBanner from "./components/StatusBanner";
import AlertInfo from "./components/AlertInfo";
import HistoryRow from "./components/HistoryRow";
import DarkStat from "./components/DarkStat";
import { getUltimo, getPenultimo } from "./services/api";

const BASE = "http://172.16.180.1:5000";

export default function App() {
  const [pastImg, setPastImg] = useState(null); // imagen previa
  const [data, setData] = useState(null);            // último
  const [penultimoData, setPenultimoData] = useState(null);
  const [img, setImg] = useState(null);              // json de la predicción/imagen
  const [loading, setLoading] = useState(false);     // <-- declarado
  const [error, setError] = useState(null);          // <-- declarado

  useEffect(() => {
    const ac = new AbortController();

    const fetchLastData = async () => {
      try {
        const ultimo = await getUltimo();
        setData(ultimo);
      } catch (e) {
        setError(String(e));                         // <-- usa setError correcto
      }
    };

    const fetchPenultimoData = async () => {
      try {
        const penultimo = await getPenultimo();
        setPenultimoData(penultimo);
      } catch (e) {
        setError(String(e));
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/api/predict/last`, {
          signal: ac.signal,
          headers: { "cache-control": "no-cache" },
        });
        if (!res.ok) throw new Error("Error al obtener datos");
        const json = await res.json();

        // Si tu API dice que no cambió, no actualizamos
        if (json.changed === false) return;

        // Actualizamos el objeto de imagen (forzaremos recarga con ?v=...)
        setPastImg(img);
        setImg(json);
        
        // refrescamos sensores
        await Promise.all([fetchLastData(), fetchPenultimoData()]);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    };

    // primera llamada + polling
    fetchData();
    const interval = setInterval(fetchData, 5000);

    // cleanup
    return () => {
      clearInterval(interval);
      ac.abort();
    };
  }, []);

  // -------- Helpers de UI --------
  // Usa un valor que cambie cuando llega nueva imagen. Si tu API trae `updated_at` o `hash`, prefierelo:
  const versionTag =
    img?.image_hash || img?.updated_at || img?.id || Date.now();

  const imgSrc =
    img?.image_url ? `${BASE}/${img.image_url}?v=${encodeURIComponent(versionTag)}` : null;
      const imgPastSrc =
    pastImg?.image_url ? `${BASE}/${pastImg.image_url}?v=${encodeURIComponent(versionTag)}` : null;

  return (
    <>
      <img
        src="/public/LogoPvacc.png"
        alt="foto logo"
        className="items-start py-4 pl-10"
      />
      <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
        <AlertInfo
          warning={{ title: "Atención", loading }}
          action={{ label: "Intentar de nuevo", loading }}
        />

        <div className="flex flex-row bg-white w-full h-screen justify-center p-10 gap-10">
          <div className="basis-3/5 p-4 rounded-lg shadow-md ">
            <Paper elevation={0} />
            <Stack spacing={2}>
              <h2 className="text-3xl font-bold">Inspección del componente</h2>
              <div className="bg-blue-100 h-full flex items-center justify-center rounded-lg border-2 border-dashed border-blue-300">
                {imgSrc ? (
                  // key fuerza a React a recrear el <img> si cambia la versión
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt="Imagen de ejemplo"
                  />
                ) : (
                  <div className="text-blue-300">
                    {loading ? "Cargando imagen..." : "Sin imagen"}
                  </div>
                )}
              </div>
            </Stack>
          </div>

          <div className="basis-2/5 p-4 rounded-lg shadow-md ">
            <section className="mb-2 flex flex-col gap-4">
              <h2 className="text-3xl font-bold">Análisis Visual</h2>
              <StatusBanner
                status={{
                  ok: img?.prediction === "ok",
                  detectedLabel:
                    img?.prediction === "ok"
                      ? "Componente aceptado"
                      : "Componente defectuoso",
                  loading,
                }}
              />
              <DarkStat
                label="Certeza"
                value={img?.confidence*100 +" %" ?? "--"}
                loading={loading}
              />
            </section>

            <Stack spacing={3}>
              <h2 className="text-3xl font-bold">Sensores</h2>
              <DarkStat
                label="Humedad relativa"
                value={data ? `${data.humedad}%` : "--"}
                loading={loading}
              />
              <DarkStat
                label="Temperatura"
                value={data ? `${data.temperatura} °C` : "--"}
                loading={loading}
              />
              <DarkStat
                label="Luminosidad"
                value={data ? `${data.luz} lux` : "--"}
                loading={loading}
              />
            </Stack>
          </div>
        </div>

        <section className="w-full p-10 bg-white">
          <h2 className="text-3xl font-bold mb-6">Historial de inspecciones</h2>

          {data && (
            <HistoryRow
              item={{
                id: 102,
                title: "Último análisis",
                subtitle: `T: ${data.temperatura} °C · H: ${data.humedad}% · L: ${data.luz} lux`,
                dateISO: data.fecha,
                ok:  img?.prediction === "ok"
                      ? true
                      : false,
                thumbnailUrl: imgSrc,
              }}
            />
          )}

          {penultimoData && (
            <HistoryRow
              item={{
                id: 101,
                title: "Penúltimo análisis",
                subtitle: `T: ${penultimoData.temperatura} °C · H: ${penultimoData.humedad}% · L: ${penultimoData.luz} lux`,
                dateISO: penultimoData.fecha,
                ok:  pastImg?.prediction === "ok"
                      ? true
                      : false,
                thumbnailUrl:imgPastSrc,
              }}
            />
          )}
        </section>
          
    
      </div>
    </>
  );
}
