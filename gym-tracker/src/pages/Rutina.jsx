import { useEffect, useMemo, useState} from "react";
import {rutinaDefault} from "../data/rutinaDefault";
import {ejerciciosBase} from "../data/ejerciciosBase";

const STORAGE_KEY = "RutinaSemanal";

export default function Rutina() {
    const dias = useMemo(
        () => ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        []
    );
    const [rutina, setRutina] = useState(() => {
        const guardado = localStorage.getItem(STORAGE_KEY);
        return guardado ? JSON.parse(guardado) : rutinaDefault;
    });

    const [diaActual, setDiaActual] = useState ("Lunes");
    const [nuevoEjercicio, setNuevoEjercicio] = useState ("");

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rutina));
    }, [rutina]);

    const listaDia= rutina[diaActual] || [];

    const agregar = () => {
        const nombre = nuevoEjercicio.trim();
        if (!nombre) return;

        if(listaDia.inclues(nombre)) return;
        
        setRutina({
            ...rutina,
            [diaActual]: [...listaDia, nombre],
        });
        setNuevoEjercicio("");
    };

    const borrar = (nombre) => {
        setRutina({
            ...rutina,
            [diaActual]: listaDia.filter ((x) => x !== nombre),
        });
    };

    const ponerDescanso = () => {
        setRutina({
            ...rutina,
            [diaActual]: ["Día de descanso"],
        });
    };

    return (
        <div>
            <h2>Rutina Semanal</h2>

            <div style= {{display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12}}>
                {dias.map ((d) => (
                    <button
                        key={d}
                        className="btn"
                        onClick={() => setDiaActual (d)}
                        style={{
                            background: diaActual === d ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)",
                        }}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <div className="card" style={{padding: 12}}>
                <h3 style= {{marginTop: 0}}>{diaActual}</h3>

                <div style={{display: "flex", gap:8, marginBottom: 10}}>
                    <input
                        value= {nuevoEjercicio}
                        onChange={(e) => setNuevoEjercicio(e.target.value)}
                        placeholder="Nuevo ejercicio (ej:Press Plano)"
                        style={{
                            flex: 1,
                            background: "rgba (255,255,255,0.7)",
                            border: "1px solid rgba (255,255,255,0.08)",
                            color: "white",
                            padding: "10px 12px",
                            borderRadius: 12,
                        }}
                    />

                    <select
                        value={nuevoEjercicio}
                        onChange={(e) => setNuevoEjercicio(e.target.value)}
                        style={{
                            background: "rgba (255,255,255,0.7)",
                            border: "1px solid rgba (255,255,255,0.08)",
                            color: "white",
                            padding: "10px 12px",
                            borderRadius: 12,
                        }}
                    >
                        <option value= "">Elegir ejercicio predeterminado...</option>
                        {ejerciciosBase.map ((e) =>(
                            <option key={e} value={e}>
                                {e}
                            </option>
                        ))}
                    </select>

                    <button className="btn" onClick={agregar}>Agregar</button>
                    <button className="btn" onClick={ponerDescanso}>Descanso</button>
                </div>

                <ul style={{paddingLeft: 18, margin:0}}>
                    {listaDia.map ((e) => (
                        <li key ={e} style={{marginBottom: 8}}>
                            {e}{" "}
                            <button className="btn" onClick={() => borrar(e)} style={{padding: "6px 10 px"}}>
                                Borrar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="small" style={{marginTop: 10}}>
                Se guarda Automático en el Local Storage (RutinaSemanal).
            </p>
        </div>
    );
}