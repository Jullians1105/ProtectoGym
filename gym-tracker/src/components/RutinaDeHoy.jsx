import { ejerciciosPorDia } from "../data/ejercicios";
import { useEffect,useState } from "react";

function RutinaDeHoy({onSaved}) {
    const hoy = new Date();

    const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    const diaNombre = dias[hoy.getDay()];

    const yyyy = hoy.getFullYear()
    const mm = String(hoy.getMonth () + 1).padStart (2, "0")
    const dd = String(hoy.getDate()).padStart(2, "0")
    const fechaISO = `${yyyy}-${mm}-${dd}` // "2025-06-15"
    
    const rutina = ejerciciosPorDia[diaNombre] || ["Descanso"];


    
    
    const storageKey = `Dia entreno -${fechaISO}-${diaNombre}`

    const [completados, setCompletados] = useState (() => {
        const guardado = localStorage.getItem(storageKey)
        return guardado ? JSON.parse(guardado) : []
    })

    const total = rutina.length
    const hechos = completados.length
    const pct = total > 0 ? Math.round ((hechos / total)* 100) : 0

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(completados))
        if (onSaved) onSaved()
    }, [storageKey, completados, onSaved])

    return (
        <div>
            <h2>Rutina de hoy</h2>
            <p>
                Hoy es: <strong>{diaNombre}</strong>
            </p>

            <p>
                Fecha: <strong>{fechaISO}</strong>
            </p>

            <p>
                Progreso hoy: <strong>{hechos}</strong> / {total} ({pct}%)
            </p>

            <p>Te toca:</p>

            <button onClick={() => setCompletados ([])}>
                Limpiar check de hoy
            </button>

            <ul>
                {rutina.map((item) => {
                    const hecho = completados.includes(item)
                    return (
                        <li 
                            key={item}
                            onClick={() => {
                            if (hecho) {
                                    setCompletados(completados.filter((e) => e !== item))
                                } else {
                                    setCompletados([...completados, item])
                                }
                            }}
                            style={{
                                cursor: "pointer",
                                textDecoration: hecho ? "line-through" : "none",
                                color: hecho ? "gray" : "white",
                            }}
                        >
                            {hecho ? "✅ " : "⬜ "} {item}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RutinaDeHoy;