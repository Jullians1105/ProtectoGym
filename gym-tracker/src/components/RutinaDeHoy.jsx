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



    
    const rutinaSemanal=JSON.parse(localStorage.getItem("RutinaSemanal") || "null");
    const rutina = (rutinaSemanal?.[diaNombre]) || ejerciciosPorDia[diaNombre] || ["Descanso"];

    const pendientesKey = "PendientesEntreno"
    const sesionEspecialKey = `SesionEspecial-${fechaISO}`

    const sesionEspecial = JSON.parse(localStorage.getItem(sesionEspecialKey) || "null")

    const diaRutina = sesionEspecial?.diaRutina || diaNombre
    
    const storageKey = `Dia entreno -${fechaISO}-${diaRutina}`
    const pesosDiaKey = `PesosDia-${fechaISO}-${diaRutina}`
    const reprogramadoDesde = sesionEspecial?.reprogramadoDesde

    const [pendientes, setPendientes] = useState (() => {
        const guardado = localStorage.getItem(pendientesKey)
        return guardado ? JSON.parse(guardado) : []
    })

    useEffect (() => {
        localStorage.setItem(pendientesKey,JSON.stringify(pendientes))
    }, [pendientes])

    const [completados, setCompletados] = useState (() => {
        const guardado = localStorage.getItem(storageKey)
        return guardado ? JSON.parse(guardado) : []
    })

    const [pesosHoy, setPesosHoy] = useState (() => {
        const guardado = localStorage.getItem(pesosDiaKey)
        return guardado ? JSON.parse (guardado) : {}
    })

        useEffect (() => {
        localStorage.setItem(pesosDiaKey, JSON.stringify(pesosHoy))
        if (onSaved) onSaved()
    }, [pesosDiaKey, pesosHoy, onSaved])

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

            {reprogramadoDesde ? (
                <p className="small">
                    Reprogramado desde: <strong>{reprogramadoDesde}</strong>
                </p>
            ): null}

            <p>
                Progreso hoy: <strong>{hechos}</strong> / {total} ({pct}%)
            </p>

            <button
                className = "btn"
                onClick={() =>{
                    const yaExiste=pendientes.some((p) => p.fecha === fechaISO)
                    if (yaExiste) return

                    setPendientes ([
                        ...pendientes,
                        {fecha: fechaISO, dia: diaNombre, rutina},
                    ])
                }}
            >
                Hoy no entrené, reprogramar
            </button>

            <p>Te toca:</p>

            <button onClick={() => setCompletados ([])}>
                Limpiar check de hoy
            </button>

            <ul>
                {rutina.map((item) => {
                    const hecho = completados.includes(item)
                    const dataPeso= pesosHoy[item] || {tipo: "Mancuerna", valor: ""}

                    const toggle = () => {
                        if (hecho) {
                            setCompletados(completados.filter((e) => e !== item))
                        } else {
                            setCompletados([...completados, item])
                        }
                    }

                    return (
                        <li key={item} style ={{padding: "6px 0"}}>
                            <button
                                onClick={toggle}
                                className="btn"
                                style = {{
                                    padding: "6px 10px",
                                    marginRight: "10px",
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                }}
                            >
                                {hecho ? "✅" : "⬜"}
                            </button>

                            <span style={{textDecoration: hecho ? "line-through" : "none", color: hecho ? "gray" : "white"}}>
                                {item}
                            </span>

                            <div style={{marginTop: "6px", display: "Flex", gap: "8px"}}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <select
                                    value={dataPeso.tipo}
                                    onChange = {(e) => {
                                        const nuevo = {...pesosHoy, [item]: {... dataPeso, tipo: e.target.value}}
                                        setPesosHoy (nuevo)
                                    }}
                                >
                                    <option value = "Mancuerna">Mancuerna</option>
                                    <option value = "Barra">Barra</option>
                                    <option value = "Máquina">Máquina</option>
                                    <option value = "Polea">Polea</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Peso en libras"
                                    value={dataPeso.valor}
                                    onChange={(e) => {
                                        const nuevo = {...pesosHoy, [item]: {...dataPeso, valor: e.target.value}}
                                        setPesosHoy(nuevo)
                                    }}
                                    style={{width: "120px"}}
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RutinaDeHoy;