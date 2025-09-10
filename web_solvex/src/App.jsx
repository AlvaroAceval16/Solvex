import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
    const [estado, setEstado] = useState("advertencia");
    const [datos, setDatos] = useState({
        humedad: 0,
        temperatura: 0,
        luz: 0,
    });
    const [historial, setHistorial] = useState([]);

    // Simulación de llamada al backend
    const fetchDatos = async () => {
        try {
            // ⚠️ Aquí sustituye por tu endpoint real
            const response = await fetch("/api/analisis");
            const data = await response.json();

            setEstado(data.estado);
            setDatos({
                humedad: data.humedad,
                temperatura: data.temperatura,
                luz: data.luz,
            });
            setHistorial(data.historial);
        } catch (error) {
            console.error("Error obteniendo datos:", error);
        }
    };

    useEffect(() => {
        fetchDatos();
        const interval = setInterval(fetchDatos, 5000); // refrescar cada 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 p-6">
            {/* Header */}
            <header className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-300 rounded mr-3" />
                <h1 className="text-2xl font-bold">Solvex</h1>
            </header>

            {/* Advertencia */}
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                <AlertCircle className="text-yellow-600" />
                <div>
                    <p className="font-semibold">Advertencia</p>
                    <p className="text-sm text-gray-600">Acción recomendada</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vista de componente */}
                <div>
                    <h2 className="font-semibold mb-2">Inspección del componente</h2>
                    <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">[Vista de la cámara]</span>
                    </div>

                    {/* Historial */}
                    <h3 className="font-semibold mt-6 mb-2">Historial</h3>
                    <div className="space-y-3">
                        {historial.length === 0 ? (
                            <p className="text-gray-500 text-sm">Sin historial disponible</p>
                        ) : (
                            historial.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{item.nombre}</p>
                                        <p
                                            className={`text-sm ${
                                                item.estado === "correcto"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {item.estado === "correcto"
                                                ? "Componente correcto"
                                                : "Componente defectuoso"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Fecha: {item.fecha} - Hora: {item.hora}
                                        </p>
                                    </div>
                                    {item.estado === "correcto" ? (
                                        <CheckCircle className="text-green-500" />
                                    ) : (
                                        <XCircle className="text-red-500" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Estado + Datos */}
                <div>
                    {/* Estado */}
                    <div
                        className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
                            estado === "correcto"
                                ? "bg-green-100 text-green-700"
                                : estado === "defectuoso"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {estado === "correcto" && <CheckCircle />}
                        {estado === "defectuoso" && <XCircle />}
                        {estado === "advertencia" && <AlertCircle />}
                        <div>
                            <p className="font-semibold">Estado del componente</p>
                            <p className="text-sm">
                                {estado === "correcto"
                                    ? "Componente detectado"
                                    : estado === "defectuoso"
                                        ? "Componente defectuoso"
                                        : "Revisión requerida"}
                            </p>
                        </div>
                    </div>

                    {/* Datos de análisis */}
                    <h3 className="font-semibold mb-2">Datos de análisis</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-gray-900 text-white rounded-lg">
                            <p className="text-sm">Humedad</p>
                            <p className="text-xl font-bold">{datos.humedad}%</p>
                        </div>
                        <div className="p-4 bg-gray-900 text-white rounded-lg">
                            <p className="text-sm">Temperatura</p>
                            <p className="text-xl font-bold">{datos.temperatura}°C</p>
                        </div>
                        <div className="p-4 bg-gray-900 text-white rounded-lg">
                            <p className="text-sm">Luz ambiental</p>
                            <p className="text-xl font-bold">{datos.luz} lx</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}