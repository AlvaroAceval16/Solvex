import React from "react";
import { useState, useEffect} from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import StatusBanner from "./components/StatusBanner";
import AlertInfo from "./components/AlertInfo";
import HistoryRow from "./components/HistoryRow";
import DarkStat from "./components/DarkStat";
//import api from "./services/api";
import { getUltimo, getPenultimo } from "./services/api";


export default function App() {
    const [data, setData] = useState(null); // datos del último
    const [penultimoData, setPenultimoData] = useState(null); // datos del penúltimo
    const [item, setItems] = useState([]);
    const [ultimo, setUltimo] = useState(null);
    const [err, setErr] =useState("");

    /*useEffect(() => {
        (async () => {
        try {
            const data = await api.listar();
            setItems(data.items || []);
            setUltimo(await api.ultimo()); // puede ser null si 204
        } catch (e) {
            setErr(String(e.message || e));
        }
        })();
    }, []); */

    useEffect(() => {
        (async () => {
        try {
            const ultimo = await getUltimo();
            setData(ultimo); // ejemplo: { temperatura: 24.8, humedad: 41.2, luz: 310, fecha: ... }
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    useEffect(() => {
        (async () => {
        try {
            const penultimo = await getPenultimo();
            setPenultimoData(penultimo); // ejemplo: { temperatura: 24.8, humedad: 41.2, luz: 310, fecha: ... }
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
        })();
    }, []);
  return (
    <>
    <img src="/public/LogoPvacc.png" alt="foto logo" className="items-start py-4 pl-10"/>
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
        <AlertInfo 
        warning={{ title: "Atención", loading: false}} 
        action= {{ label: "Intentar de nuevo", loading: false}}
        />
        <div className="flex flex-row bg-white w-full h-screen  justify-center p-10 gap-10">
            <div className="basis-3/5 p-4 rounded-lg shadow-md ">
                 <Paper elevation={0} />
                    <Stack spacing={2}>
                        <h2 className="text-3xl font-bold">Inspección del componente</h2>
                        <div className="bg-blue-100 h-full flex items-center justify-center rounded-lg border-2 border-dashed border-blue-300">
                            <img src="https://fotografias.lasexta.com/clipping/cmsimages02/2017/09/15/EF20D9EA-B487-41A0-8640-44DDDB9E5861/103.jpg?crop=854,641,x0,y1&width=1200&height=900&optimize=low&format=webply" alt="Imagen de ejemplo" srcset="" />
                        </div>
                    </Stack>
            </div>
            <div className="basis-2/5 p-4 rounded-lg shadow-md ">
            <section className="mb-2 flex flex-col gap-4">
                <h2 className="text-3xl font-bold">Análisis Visual</h2>
                <StatusBanner status={{ ok: true, detectedLabel: "Componente aceptado", loading: false }} />
                <DarkStat label="Certeza" value="98%" loading={false} />

            </section>
                <Stack spacing={3}>
                    <h2 className="text-3xl font-bold">Sensores</h2>
                    <DarkStat label="Humedad relativa" value={data ? `${data.humedad}%` : "--" } loading={false} />
                    <DarkStat label="Temperatura" value={data ? `${data.temperatura} °C` : "--" } loading={false} />
                    <DarkStat label="Luminosidad" value={data ? `${data.luz} lux` : "--" } loading={false} />
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
                    dateISO: data.fecha,   // <-- ISO que da tu API
                    ok: true,
                    thumbnailUrl: "",
                    }}
                />
        )}
           {penultimoData && (
                <HistoryRow
                    item={{
                    id: 102,
                    title: "Último análisis",
                    subtitle: `T: ${penultimoData.temperatura} °C · H: ${penultimoData.humedad}% · L: ${penultimoData.luz} lux`,
                    dateISO: penultimoData.fecha,   // <-- ISO que da tu API
                    ok: true,
                    thumbnailUrl: "",
                    }}
                />
        )}
        </section>
    </div>
    </>
  );
}
