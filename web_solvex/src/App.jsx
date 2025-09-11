import React from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import StatusBanner from "./components/StatusBanner";
import AlertInfo from "./components/AlertInfo";
import HistoryRow from "./components/HistoryRow";
import DarkStat from "./components/DarkStat";



export default function App() {
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
            <section className="mb-6 flex flex-col gap-6">
                <h2 className="text-3xl font-bold">Análisis Visual</h2>
                <StatusBanner status={{ ok: true, detectedLabel: "Componente aceptado", loading: false }} />
                <DarkStat label="Certeza" value="98%" loading={false} />

            </section>
                <Stack spacing={5}>
                    <h2 className="text-3xl font-bold">Sensores</h2>
                    <DarkStat label="Humedad relativa" value="90%" loading={false} />
                    <DarkStat label="Temperatura" value="45°C" loading={false} />
                    <DarkStat label="Luminosidad" value="1000 lux" loading={false} />
                </Stack>
            </div>
        </div>
        <section className="w-full p-10 bg-white">
        <h2 className="text-3xl font-bold mb-6">Historial de inspecciones</h2>
            <HistoryRow item={{
                id: 102,
                title: "Componente 2",
                subtitle: "Componente defectuoso",
                dateISO: new Date().toISOString(), // genera ISO ahora
                ok: true,
                thumbnailUrl: "", // vacío => mostrará el ícono de imagen

            }}></HistoryRow>
            <HistoryRow item={{
                id: 102,
                title: "Componente 2",
                subtitle: "Componente defectuoso",
                dateISO: new Date().toISOString(), // genera ISO ahora
                ok: false,
                thumbnailUrl: "", // vacío => mostrará el ícono de imagen

            }}></HistoryRow>
        </section>
    </div>
    </>
  );
}
