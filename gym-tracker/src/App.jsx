import  {useState, useCallback,} from "react";
import {NavLink,Routes,Route, Navigate} from "react-router-dom";
import Rutina from "./pages/Rutina";
import Reprogramar from "./pages/Reprogramar";

import Hoy from "./pages/Hoy";
import HistorialPage from "./pages/HistorialPage";
import "./App.css";

export default function App() {
  const [refreshHistorial, setRefreshHistorial] = useState (0);
  const onSaved = useCallback(() => {
    setRefreshHistorial((v) => v + 1)
  }, []);

    return (
      <div style={{maxWidth: "900px", margin: "0 auto", padding: "24px"}}>
        <h1>Gym Tracker</h1>

        {/* Menú */}
        <div style={{display: "flex", grap: "12px", marginBottom: "16px"}}>
          <NavLink
            to = "/hoy"
            style = {({isActive}) => ({
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              background: isActive ? "#2a2f3a" : "#151821",
              color: "white",
            })}
          >
            Hoy
          </NavLink>
            
          <NavLink
            to="/rutina"
            style = {({isActive}) => ({
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              background: isActive ? "#2a2f3a" : "#151821",
              color: "white",
            })}
          >
            Rutina
          </NavLink>

          <NavLink
              to="/reprogramar"
              style = {({isActive}) => ({
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              background: isActive ? "#2a2f3a" : "#151821",
              color: "white",
            })}>
              Reprogramar
          </NavLink>

          <NavLink
            to = "/historial"
            style = {({isActive}) => ({
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              background: isActive ? "#2a2f3a" : "#151821",
              color: "white",
            })}
          >
            Historial
          </NavLink>
        </div>
            {/* Rutas */}
        <Routes>
          <Route 
            path = "/hoy" 
            element = {
              <Hoy onSaved={onSaved}/>
            } 
          />
          <Route
            path = "/historial"
            element = {
              <HistorialPage 
                refresh = {refreshHistorial} />
            }
          />

          <Route
            path = "/reprogramar"
            element = {<Reprogramar />}
          />

          <Route path= "/rutina" element = {<Rutina />} />
          {/* Si entras a /, te manda a /hoy */}
          <Route path = "/" element = {<Navigate to = "/hoy" replace />} />
          <Route path = "*" element = {<Navigate to = "/hoy" replace />} />
        </Routes>
      </div>
  );
}
// import Ejercicios from "./components/Ejercicios";
