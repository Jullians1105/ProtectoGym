import {useMemo} from "react"
import { ejerciciosPorDia } from "../data/ejercicios"

function Historial ({refresh}) {
    const sesiones =useMemo (() => {
        const result = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key.startsWith ("Dia entreno -")) {
            const partes = key.split("-")
            const fecha = partes.slice(1, 4).join("-")
            const dia = partes.slice(4).join("-")

            const ejercicios = JSON.parse(localStorage.getItem(key)) || []

            const pesosKey= `PesosDia-${fecha}-${dia}`
            const pesos= JSON.parse(localStorage.getItem(pesosKey)) || {}

            const total = (ejerciciosPorDia[dia] || []).length
            const hechos = ejercicios.length
            const pct = total > 0 ? Math.round ((hechos / total) * 100) : 0

            result.push({fecha, dia, ejercicios, pesos, total, hechos, pct})
        }
    }

    // Ordenar por fecha, de más reciente a más antigua
    result.sort ((a,b) => b.fecha.localeCompare(a.fecha))
    return result
}, [refresh])


                const especiales = useMemo(() => {
                    const map = {};
                Object.keys (localStorage)
                .filter((k) => k.startsWith ("SesionEspecial-"))
                .forEach((k) => {
                    const obj = JSON.parse (localStorage.getItem (k) || "null");
                    if (!obj) return;
                    const desde = obj.reprogramadoDesde || obj.desde;
                if (desde) map[desde] = obj;
            });
    return map;
}, [refresh]);

    return (
        <div className="historial">
            <h2>Historial de entrenamientos</h2>

            {sesiones.length === 0 && <p> No hay entrenamientos aún</p>}

            

            {sesiones.map((sesion) => {

                const special = especiales[sesion.fecha] || null;




                return (
                    <div
                    key={`${sesion.fecha}-${sesion.dia}`}
                    style={{marginBottom: "1rem"}}
                    >
                        <div>
                            <strong>{sesion.fecha}</strong> - {sesion.dia}
                        </div>

                        {special && (
                            <p style={{color: "#facc15", margin: "4px 0"}}>
                                Reprogramado para {special.nuevaFecha} → {special.nuevaFecha}
                            </p>
                        )}
                        <div>
                            Progreso: <strong>{sesion.hechos}</strong> / {sesion.total} (
                                {sesion.pct}%)
                        </div>
                    <ul>
                            {sesion.ejercicios.map ((e) => {
                            const p = sesion.pesos?.[e]

                            return (
                                <li key={e}>
                                    ✅ {e}
                                    {p?.valor !== "" && p?.valor != null ? (
                                        <span style={{opacity: 0.85}}>
                                        {" "}- {p.tipo}: {p.valor} lbs
                                    </span>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )})}
        </div>
    )
}

export default Historial