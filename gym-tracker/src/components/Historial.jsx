import {useMemo} from "react"
import { ejerciciosPorDia } from "../data/ejercicios"

function barraProgreso (pct) {
    //pct: 0 a 100
    const filled = Math.round(pct / 10)
    let s = ""
    for (let i = 0; i < 10; i++) {
        s+= i < filled ? "◉" : "○"
    }
    return s
}

function Historial ({refresh}) {
    const sesiones =useMemo (() => {
        const result = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key.startsWith ("Dia entreno -")) {
            const [, fecha, dia] = key.split("-")
            const ejercicios = JSON.parse(localStorage.getItem(key)) || []

            const total = (ejerciciosPorDia[dia] || []).length
            const hechos = ejercicios.length
            const pct = total > 0 ? Math.round ((hechos / total) * 100) : 0

            result.push({fecha, dia, ejercicios, total, hechos, pct})
        }
    }

    // Ordenar por fecha, de más reciente a más antigua
    result.sort ((a,b) => b.fecha.localeCompare(a.fecha))
    return result
}, [refresh])

    return (
        <div>
            <h2>Historial de entrenamientos</h2>

            {sesiones.length === 0 && <p> No hay entrenamientos aún</p>}

            {sesiones.map((sesion) => (
                <div
                    key={`${sesion.fecha}-${sesion.dia}`}
                    style={{marginBottom: "1rem"}}
                    >
                        <div>
                            <strong>{sesion.fecha}</strong> - {sesion.dia}
                        </div>

                        <div>
                            Progreso: <strong>{sesion.hechos}</strong> / {sesion.total} (
                                {sesion.pct}%)
                        </div>
                        <div style = {{fontFamily: "monospace"}}> {barraProgreso (sesion.pct)} </div>
                    <ul>
                        {sesion.ejercicios.map((e) => (
                            <li key={e}>✅  {e}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default Historial