import { useState } from "react";

// ─── MOCK DATABASE ───────────────────────────────────────────────────────────
const DB = {
  users: [
    { id: "u1", nombre: "María González", email: "maria@mail.com", rol: "padre", password: "1234" },
    { id: "u2", nombre: "Admin Sistema",  email: "admin@linkid.mx",  rol: "admin", password: "admin" },
  ],
  hijos: [
    { id: "h1", nombre: "Sofía González",  equipo: "Rayos Sub-10",   estatus: "ACTIVO",  padreId: "u1", pin: "4821", avatar: "⚽" },
    { id: "h2", nombre: "Mateo González",  equipo: "Leones Sub-12",  estatus: "ADEUDO",  padreId: "u1", pin: "7356", avatar: "🏃" },
    { id: "h3", nombre: "Valeria Torres",  equipo: "Águilas Sub-8",  estatus: "ACTIVO",  padreId: "u1", pin: "2940", avatar: "🌟" },
  ],
  alertas: [
    { id: "a1", hijoId: "h1", titulo: "Práctica mañana", mensaje: "Práctica a las 9am en cancha norte. Llevar uniforme completo.", fecha: "2026-05-21", tipo: "info", leida: false },
    { id: "a2", hijoId: "h2", titulo: "⚠️ Adeudo pendiente", mensaje: "Tu cuenta tiene un adeudo. El acceso queda bloqueado hasta regularizar el pago.", fecha: "2026-05-20", tipo: "alerta", leida: false },
    { id: "a3", hijoId: "h1", titulo: "Torneo este fin de semana", mensaje: "Torneo regional el sábado 24 de mayo. Presentarse 30min antes.", fecha: "2026-05-19", tipo: "evento", leida: true },
    { id: "a4", hijoId: "h3", titulo: "Cambio de horario", mensaje: "La práctica del jueves se recorre a las 5pm.", fecha: "2026-05-18", tipo: "info", leida: true },
  ],
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --verde: #00C896;
    --verde-dark: #009e77;
    --azul: #1A1F3C;
    --azul-mid: #252B4E;
    --azul-light: #2E3560;
    --blanco: #F8FAFB;
    --gris: #9BA3B8;
    --rojo: #FF5252;
    --amarillo: #FFD166;
    --card: rgba(255,255,255,0.05);
    --border: rgba(255,255,255,0.08);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--azul); color: var(--blanco); min-height: 100vh; }

  .app { max-width: 420px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; position: relative; background: var(--azul); }

  /* LOGIN */
  .login-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 32px; min-height: 100vh; }
  .login-logo { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .logo-icon { width: 72px; height: 72px; background: linear-gradient(135deg, var(--verde), #00f2b0); border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 8px 32px rgba(0,200,150,0.35); }
  .logo-name { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -1px; }
  .logo-name span { color: var(--verde); }
  .logo-sub { font-size: 13px; color: var(--gris); letter-spacing: 0.5px; }
  .login-form { width: 100%; display: flex; flex-direction: column; gap: 16px; }
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .input-group label { font-size: 12px; font-weight: 500; color: var(--gris); text-transform: uppercase; letter-spacing: 0.8px; }
  .input-group input { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; color: var(--blanco); font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none; transition: border 0.2s; }
  .input-group input:focus { border-color: var(--verde); }
  .btn-primary { background: linear-gradient(135deg, var(--verde), #00f2b0); color: var(--azul); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; border: none; border-radius: 14px; padding: 16px; cursor: pointer; width: 100%; letter-spacing: 0.3px; transition: opacity 0.2s, transform 0.1s; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .login-hint { font-size: 12px; color: var(--gris); text-align: center; }
  .login-hint b { color: var(--verde); }
  .err-msg { background: rgba(255,82,82,0.12); border: 1px solid rgba(255,82,82,0.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: var(--rojo); text-align: center; }

  /* HEADER */
  .header { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--azul); z-index: 10; }
  .header-left { display: flex; align-items: center; gap: 10px; }
  .h-logo { width: 34px; height: 34px; background: linear-gradient(135deg, var(--verde), #00f2b0); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .h-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; }
  .h-title span { color: var(--verde); }
  .h-right { display: flex; align-items: center; gap: 8px; }
  .badge-btn { position: relative; background: none; border: none; cursor: pointer; color: var(--gris); font-size: 22px; padding: 4px; }
  .badge { position: absolute; top: 0; right: 0; background: var(--rojo); color: white; font-size: 10px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .avatar-btn { width: 34px; height: 34px; background: var(--azul-light); border-radius: 50%; border: 2px solid var(--verde); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--verde); cursor: pointer; font-family: 'Syne', sans-serif; }

  /* MAIN CONTENT */
  .main { flex: 1; overflow-y: auto; padding-bottom: 80px; }

  /* BOTTOM NAV */
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 420px; background: var(--azul-mid); border-top: 1px solid var(--border); display: flex; padding: 8px 0 20px; z-index: 20; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 6px 0; color: var(--gris); transition: color 0.2s; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .nav-item.active { color: var(--verde); }
  .nav-icon { font-size: 22px; }
  .nav-label { font-size: 10px; font-weight: 500; letter-spacing: 0.3px; }

  /* HOME */
  .home-pad { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
  .greeting { display: flex; flex-direction: column; gap: 4px; }
  .greeting h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
  .greeting p { font-size: 13px; color: var(--gris); }
  .section-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--gris); text-transform: uppercase; letter-spacing: 1px; margin-bottom: -8px; }

  /* HIJO CARD */
  .hijo-card { background: var(--azul-mid); border: 1px solid var(--border); border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 14px; cursor: pointer; transition: transform 0.15s, border-color 0.2s; }
  .hijo-card:hover { transform: translateY(-2px); border-color: rgba(0,200,150,0.25); }
  .hijo-card.adeudo { border-color: rgba(255,82,82,0.25); }
  .hijo-top { display: flex; align-items: center; gap: 12px; }
  .hijo-avatar { width: 48px; height: 48px; background: var(--azul-light); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .hijo-info { flex: 1; }
  .hijo-nombre { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
  .hijo-equipo { font-size: 12px; color: var(--gris); margin-top: 2px; }
  .estatus-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
  .estatus-badge.activo { background: rgba(0,200,150,0.15); color: var(--verde); }
  .estatus-badge.adeudo { background: rgba(255,82,82,0.15); color: var(--rojo); }
  .pin-area { background: var(--azul-light); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
  .pin-label { font-size: 11px; color: var(--gris); text-transform: uppercase; letter-spacing: 0.8px; }
  .pin-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: 6px; color: var(--verde); }
  .pin-mes { font-size: 11px; color: var(--gris); text-align: right; }
  .pin-bloqueado { display: flex; align-items: center; gap: 8px; }
  .pin-bloqueado-icon { font-size: 20px; }
  .pin-bloqueado-text { font-size: 13px; color: var(--rojo); font-weight: 500; }

  /* ALERTAS */
  .alertas-pad { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .alerta-card { background: var(--azul-mid); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; gap: 12px; cursor: pointer; transition: border-color 0.2s; }
  .alerta-card.no-leida { border-color: rgba(0,200,150,0.2); }
  .alerta-dot { width: 8px; height: 8px; background: var(--verde); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
  .alerta-dot.leida { background: transparent; }
  .alerta-body { flex: 1; }
  .alerta-titulo { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
  .alerta-msg { font-size: 13px; color: var(--gris); line-height: 1.4; }
  .alerta-footer { display: flex; justify-content: space-between; margin-top: 8px; }
  .alerta-hijo { font-size: 11px; color: var(--verde); font-weight: 500; }
  .alerta-fecha { font-size: 11px; color: var(--gris); }
  .tipo-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
  .tipo-info { background: #60a5fa; }
  .tipo-alerta { background: var(--rojo); }
  .tipo-evento { background: var(--amarillo); }
  .empty-state { text-align: center; padding: 48px 20px; color: var(--gris); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-text { font-size: 15px; }

  /* PERFIL */
  .perfil-pad { padding: 24px 20px; display: flex; flex-direction: column; gap: 20px; }
  .perfil-hero { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; background: var(--azul-mid); border-radius: 18px; border: 1px solid var(--border); }
  .perfil-avatar { width: 72px; height: 72px; background: linear-gradient(135deg, var(--verde), #00f2b0); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--azul); }
  .perfil-nombre { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; }
  .perfil-email { font-size: 13px; color: var(--gris); }
  .perfil-rol { padding: 4px 12px; background: rgba(0,200,150,0.1); border: 1px solid rgba(0,200,150,0.2); border-radius: 20px; font-size: 11px; color: var(--verde); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-section { background: var(--azul-mid); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
  .info-row { padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 13px; color: var(--gris); display: flex; align-items: center; gap: 8px; }
  .info-value { font-size: 13px; font-weight: 500; }
  .btn-logout { background: rgba(255,82,82,0.1); border: 1px solid rgba(255,82,82,0.25); color: var(--rojo); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; border-radius: 14px; padding: 14px; cursor: pointer; width: 100%; letter-spacing: 0.3px; transition: background 0.2s; }
  .btn-logout:hover { background: rgba(255,82,82,0.2); }

  /* ADMIN */
  .admin-pad { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .admin-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .stat-card { background: var(--azul-mid); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
  .stat-num.verde { color: var(--verde); }
  .stat-num.rojo { color: var(--rojo); }
  .stat-label { font-size: 12px; color: var(--gris); margin-top: 4px; }
  .admin-table { background: var(--azul-mid); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .table-header { padding: 14px 16px; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--gris); text-transform: uppercase; letter-spacing: 0.8px; }
  .table-row { padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
  .table-row:last-child { border-bottom: none; }
  .tr-left { display: flex; align-items: center; gap: 10px; }
  .tr-avatar { width: 36px; height: 36px; background: var(--azul-light); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .tr-nombre { font-size: 14px; font-weight: 500; }
  .tr-equipo { font-size: 11px; color: var(--gris); }
  .toggle-btn { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; }
  .toggle-btn.to-adeudo { background: rgba(255,82,82,0.15); color: var(--rojo); border: 1px solid rgba(255,82,82,0.3); }
  .toggle-btn.to-activo { background: rgba(0,200,150,0.15); color: var(--verde); border: 1px solid rgba(0,200,150,0.3); }

  /* DB SCHEMA */
  .schema-pad { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .schema-card { background: var(--azul-mid); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .schema-header { padding: 12px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.03); }
  .schema-table-icon { font-size: 18px; }
  .schema-table-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--verde); }
  .schema-field { padding: 10px 16px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; }
  .schema-field:last-child { border-bottom: none; }
  .field-name { font-weight: 500; font-family: 'DM Mono', monospace; }
  .field-type { color: var(--gris); font-size: 12px; display: flex; align-items: center; gap: 6px; }
  .field-pk { background: rgba(0,200,150,0.15); color: var(--verde); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
  .field-fk { background: rgba(96,165,250,0.15); color: #60a5fa; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
  .rules-box { background: rgba(0,200,150,0.06); border: 1px solid rgba(0,200,150,0.2); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
  .rule-item { display: flex; gap: 8px; font-size: 13px; }
  .rule-icon { flex-shrink: 0; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HijoCard({ hijo, onClick }) {
  const activo = hijo.estatus === "ACTIVO";
  return (
    <div className={`hijo-card ${activo ? "" : "adeudo"}`} onClick={() => onClick(hijo)}>
      <div className="hijo-top">
        <div className="hijo-avatar">{hijo.avatar}</div>
        <div className="hijo-info">
          <div className="hijo-nombre">{hijo.nombre}</div>
          <div className="hijo-equipo">🏟 {hijo.equipo}</div>
        </div>
        <span className={`estatus-badge ${activo ? "activo" : "adeudo"}`}>
          {hijo.estatus}
        </span>
      </div>
      <div className="pin-area">
        {activo ? (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="pin-label">PIN de acceso</div>
                <div className="pin-value">{hijo.pin}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="pin-mes">Mayo 2026</div>
                <div style={{ fontSize: 11, color: "var(--gris)", marginTop: 2 }}>Válido este mes</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pin-bloqueado">
            <span className="pin-bloqueado-icon">🔒</span>
            <span className="pin-bloqueado-text">Acceso bloqueado por adeudo</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ user, hijos, alertas, onNavChange }) {
  const noLeidas = alertas.filter(a => !a.leida).length;
  return (
    <div className="home-pad">
      <div className="greeting">
        <h2>Hola, {user.nombre.split(" ")[0]} 👋</h2>
        <p>{hijos.length} hijo{hijos.length !== 1 ? "s" : ""} registrado{hijos.length !== 1 ? "s" : ""}
          {noLeidas > 0 && <> · <span style={{ color: "var(--verde)" }}>{noLeidas} aviso{noLeidas !== 1 ? "s" : ""} nuevo{noLeidas !== 1 ? "s" : ""}</span></>}
        </p>
      </div>

      <div>
        <div className="section-title">Mis hijos</div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {hijos.map(h => <HijoCard key={h.id} hijo={h} onClick={() => onNavChange("alertas")} />)}
        </div>
      </div>

      {noLeidas > 0 && (
        <div>
          <div className="section-title">Avisos recientes</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {alertas.filter(a => !a.leida).slice(0, 2).map(a => {
              const hijo = hijos.find(h => h.id === a.hijoId);
              return (
                <div key={a.id} className="alerta-card no-leida" onClick={() => onNavChange("alertas")}>
                  <div className="alerta-dot" />
                  <div className="alerta-body">
                    <div className="alerta-titulo">{a.titulo}</div>
                    <div className="alerta-msg">{a.mensaje}</div>
                    <div className="alerta-footer">
                      <span className="alerta-hijo">{hijo?.nombre}</span>
                      <span className="alerta-fecha">{a.fecha}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertasScreen({ hijos, alertas, setAlertas }) {
  const marcarLeida = (id) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a));
  };
  if (alertas.length === 0) {
    return (
      <div className="alertas-pad">
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <div className="empty-text">Sin avisos por ahora</div>
        </div>
      </div>
    );
  }
  return (
    <div className="alertas-pad">
      <div className="section-title" style={{ marginBottom: 4 }}>
        Avisos y alertas · {alertas.filter(a => !a.leida).length} sin leer
      </div>
      {alertas.map(a => {
        const hijo = hijos.find(h => h.id === a.hijoId);
        return (
          <div key={a.id} className={`alerta-card ${!a.leida ? "no-leida" : ""}`} onClick={() => marcarLeida(a.id)}>
            <div className={`alerta-dot ${a.leida ? "leida" : ""}`} />
            <div className="alerta-body">
              <div className="alerta-titulo">
                <span className={`tipo-dot tipo-${a.tipo}`} />
                {a.titulo}
              </div>
              <div className="alerta-msg">{a.mensaje}</div>
              <div className="alerta-footer">
                <span className="alerta-hijo">{hijo?.nombre}</span>
                <span className="alerta-fecha">{a.fecha}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PerfilScreen({ user, hijos, onLogout }) {
  const initials = user.nombre.split(" ").map(n => n[0]).slice(0, 2).join("");
  return (
    <div className="perfil-pad">
      <div className="perfil-hero">
        <div className="perfil-avatar">{initials}</div>
        <div className="perfil-nombre">{user.nombre}</div>
        <div className="perfil-email">{user.email}</div>
        <div className="perfil-rol">{user.rol === "padre" ? "👨‍👧 Padre / Tutor" : "⚙️ Administrador"}</div>
      </div>

      <div className="info-section">
        <div className="info-row">
          <span className="info-label">👦 Hijos vinculados</span>
          <span className="info-value">{hijos.length}</span>
        </div>
        <div className="info-row">
          <span className="info-label">✅ Activos</span>
          <span className="info-value" style={{ color: "var(--verde)" }}>{hijos.filter(h => h.estatus === "ACTIVO").length}</span>
        </div>
        <div className="info-row">
          <span className="info-label">⚠️ Con adeudo</span>
          <span className="info-value" style={{ color: "var(--rojo)" }}>{hijos.filter(h => h.estatus === "ADEUDO").length}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📱 Versión app</span>
          <span className="info-value" style={{ color: "var(--gris)" }}>MVP 1.0</span>
        </div>
      </div>

      <div style={{ background: "var(--azul-mid)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 12, color: "var(--gris)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 12 }}>Estructura de roles</div>
        {[
          { rol: "Padre / Tutor", desc: "Ve PINs activos, recibe avisos", icon: "👨‍👧" },
          { rol: "Admin", desc: "Gestiona alumnos y estatus", icon: "⚙️" },
          { rol: "Sistema", desc: "Genera PINs mensuales", icon: "🤖" },
        ].map(r => (
          <div key={r.rol} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.rol}</div>
              <div style={{ fontSize: 12, color: "var(--gris)" }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
}

function AdminScreen({ hijos, setHijos }) {
  const activos = hijos.filter(h => h.estatus === "ACTIVO").length;
  const adeudos = hijos.filter(h => h.estatus === "ADEUDO").length;

  const toggleEstatus = (id) => {
    setHijos(prev => prev.map(h =>
      h.id === id ? { ...h, estatus: h.estatus === "ACTIVO" ? "ADEUDO" : "ACTIVO" } : h
    ));
  };

  return (
    <div className="admin-pad">
      <div className="section-title">Panel administrador</div>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-num verde">{activos}</div>
          <div className="stat-label">Alumnos activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-num rojo">{adeudos}</div>
          <div className="stat-label">Con adeudo</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "var(--amarillo)" }}>{hijos.length}</div>
          <div className="stat-label">Total alumnos</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: "#60a5fa" }}>3</div>
          <div className="stat-label">Equipos</div>
        </div>
      </div>

      <div className="admin-table">
        <div className="table-header">Gestión de estatus</div>
        {hijos.map(h => (
          <div key={h.id} className="table-row">
            <div className="tr-left">
              <div className="tr-avatar">{h.avatar}</div>
              <div>
                <div className="tr-nombre">{h.nombre}</div>
                <div className="tr-equipo">{h.equipo}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={`estatus-badge ${h.estatus === "ACTIVO" ? "activo" : "adeudo"}`}>{h.estatus}</span>
              <button
                className={`toggle-btn ${h.estatus === "ACTIVO" ? "to-adeudo" : "to-activo"}`}
                onClick={() => toggleEstatus(h.id)}
              >
                {h.estatus === "ACTIVO" ? "→ Adeudo" : "→ Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rules-box">
        <div style={{ fontSize: 12, color: "var(--verde)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Reglas del sistema</div>
        {[
          { icon: "✅", text: "Solo alumnos ACTIVO pueden ver su PIN" },
          { icon: "🔒", text: "Al cambiar a ADEUDO, el PIN desaparece automáticamente" },
          { icon: "❌", text: "El sistema NO procesa pagos en esta etapa" },
          { icon: "🔄", text: "PINs se renuevan automáticamente cada mes" },
        ].map((r, i) => (
          <div key={i} className="rule-item">
            <span className="rule-icon">{r.icon}</span>
            <span style={{ color: "var(--gris)" }}>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemaScreen() {
  const tables = [
    {
      icon: "👤", name: "users",
      fields: [
        { name: "id", type: "UUID", tag: "PK" },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "email", type: "VARCHAR(150)", extra: "UNIQUE" },
        { name: "password_hash", type: "VARCHAR(255)" },
        { name: "rol", type: "ENUM (padre, admin)" },
        { name: "created_at", type: "TIMESTAMP" },
      ]
    },
    {
      icon: "👦", name: "alumnos",
      fields: [
        { name: "id", type: "UUID", tag: "PK" },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "equipo_id", type: "UUID", tag: "FK" },
        { name: "padre_id", type: "UUID", tag: "FK" },
        { name: "estatus", type: "ENUM (ACTIVO, ADEUDO)" },
        { name: "avatar_emoji", type: "VARCHAR(10)" },
        { name: "created_at", type: "TIMESTAMP" },
      ]
    },
    {
      icon: "🔑", name: "pins_mensuales",
      fields: [
        { name: "id", type: "UUID", tag: "PK" },
        { name: "alumno_id", type: "UUID", tag: "FK" },
        { name: "pin", type: "CHAR(4)" },
        { name: "mes", type: "DATE (primer día del mes)" },
        { name: "activo", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMP" },
      ]
    },
    {
      icon: "🏟", name: "equipos",
      fields: [
        { name: "id", type: "UUID", tag: "PK" },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "categoria", type: "VARCHAR(50)" },
        { name: "admin_id", type: "UUID", tag: "FK" },
      ]
    },
    {
      icon: "🔔", name: "alertas",
      fields: [
        { name: "id", type: "UUID", tag: "PK" },
        { name: "alumno_id", type: "UUID", tag: "FK" },
        { name: "titulo", type: "VARCHAR(150)" },
        { name: "mensaje", type: "TEXT" },
        { name: "tipo", type: "ENUM (info, alerta, evento)" },
        { name: "leida", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMP" },
      ]
    },
  ];

  return (
    <div className="schema-pad">
      <div className="section-title">Base de datos · MVP Schema</div>
      {tables.map(t => (
        <div key={t.name} className="schema-card">
          <div className="schema-header">
            <span className="schema-table-icon">{t.icon}</span>
            <span className="schema-table-name">{t.name}</span>
          </div>
          {t.fields.map(f => (
            <div key={f.name} className="schema-field">
              <span className="field-name">{f.name}</span>
              <span className="field-type">
                {f.tag === "PK" && <span className="field-pk">PK</span>}
                {f.tag === "FK" && <span className="field-fk">FK</span>}
                {f.type}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LinKidApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [activeNav, setActiveNav] = useState("home");
  const [hijos, setHijos] = useState(DB.hijos);
  const [alertas, setAlertas] = useState(DB.alertas);

  const login = () => {
    const found = DB.users.find(u => u.email === email && u.password === pass);
    if (found) {
      setUser(found);
      setErr("");
    } else {
      setErr("Correo o contraseña incorrectos");
    }
  };

  const logout = () => { setUser(null); setEmail(""); setPass(""); setActiveNav("home"); };

  const misHijos = user ? hijos.filter(h => user.rol === "admin" ? true : h.padreId === user.id) : [];
  const misAlertas = alertas.filter(a => misHijos.some(h => h.id === a.hijoId));
  const noLeidas = misAlertas.filter(a => !a.leida).length;

  const navItems = user?.rol === "admin"
    ? [
        { id: "home",   icon: "🏠", label: "Inicio" },
        { id: "admin",  icon: "⚙️", label: "Admin" },
        { id: "schema", icon: "🗄️", label: "Schema" },
        { id: "perfil", icon: "👤", label: "Perfil" },
      ]
    : [
        { id: "home",    icon: "🏠", label: "Inicio" },
        { id: "alertas", icon: "🔔", label: "Avisos" },
        { id: "schema",  icon: "🗄️", label: "Schema" },
        { id: "perfil",  icon: "👤", label: "Perfil" },
      ];

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="login-wrap">
            <div className="login-logo">
              <div className="logo-icon">⚽</div>
              <div className="logo-name">Lin<span>Kid</span></div>
              <div className="logo-sub">Sistema de acceso deportivo</div>
            </div>
            <div className="login-form">
              {err && <div className="err-msg">{err}</div>}
              <div className="input-group">
                <label>Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" onKeyDown={e => e.key === "Enter" && login()} />
              </div>
              <div className="input-group">
                <label>Contraseña</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && login()} />
              </div>
              <button className="btn-primary" onClick={login}>Ingresar</button>
            </div>
            <div className="login-hint">
              Demo padre: <b>maria@mail.com</b> / <b>1234</b><br />
              Demo admin: <b>admin@linkid.mx</b> / <b>admin</b>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-left">
            <div className="h-logo">⚽</div>
            <div className="h-title">Lin<span>Kid</span></div>
          </div>
          <div className="h-right">
            {user.rol === "padre" && (
              <button className="badge-btn" onClick={() => setActiveNav("alertas")}>
                🔔
                {noLeidas > 0 && <span className="badge">{noLeidas}</span>}
              </button>
            )}
            <div className="avatar-btn" onClick={() => setActiveNav("perfil")}>
              {user.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
          </div>
        </div>

        <div className="main">
          {activeNav === "home" && <HomeScreen user={user} hijos={misHijos} alertas={misAlertas} onNavChange={setActiveNav} />}
          {activeNav === "alertas" && <AlertasScreen hijos={misHijos} alertas={misAlertas} setAlertas={setAlertas} />}
          {activeNav === "admin" && user.rol === "admin" && <AdminScreen hijos={hijos} setHijos={setHijos} />}
          {activeNav === "schema" && <SchemaScreen />}
          {activeNav === "perfil" && <PerfilScreen user={user} hijos={misHijos} onLogout={logout} />}
        </div>

        <nav className="bottom-nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${activeNav === n.id ? "active" : ""}`} onClick={() => setActiveNav(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
