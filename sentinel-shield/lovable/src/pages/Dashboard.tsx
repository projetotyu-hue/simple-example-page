import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Produtos", href: "/admin/products" },
  { label: "Vendas", href: "/admin/sales" },
  { label: "Clientes", href: "/admin/clients" },
  { label: "Pagamentos", href: "/admin/payments" },
  { label: "Analytics", href: "/admin/analytics" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }
    fetchMetrics();
  }

  async function fetchMetrics() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-metrics`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <style>{`
          .dashboard-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0f;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(16, 185, 129, 0.3);
            border-top-color: #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Sentinel Shield</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Visitas Hoje</h3>
            <p className="stat-value">{data?.metrics?.totalVisits || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Visitantes Únicos</h3>
            <p className="stat-value">{data?.metrics?.uniqueVisitors || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Mobile</h3>
            <p className="stat-value">{data?.metrics?.devices?.mobile || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Desktop</h3>
            <p className="stat-value">{data?.metrics?.devices?.desktop || 0}</p>
          </div>
        </div>

        <div className="logs-section">
          <h2>Logs Recentes</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {data?.logs?.map((log: any) => (
                  <tr key={log.id}>
                    <td>{log.event_type}</td>
                    <td>{log.username}</td>
                    <td><span className={`status ${log.status}`}>{log.status}</span></td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        body {
          background: #0a0a0f;
        }

        .dashboard {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
        }

        .sidebar {
          width: 260px;
          background: #121218;
          border-right: 1px solid #2a2a35;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #2a2a35;
        }

        .sidebar-header h1 {
          color: #f0f0f5;
          font-size: 20px;
          font-weight: 700;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
        }

        .nav-link {
          display: block;
          padding: 12px 24px;
          color: #8888a0;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .nav-link:hover {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid #2a2a35;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #16161e;
          border: 1px solid #2a2a35;
          border-radius: 12px;
          padding: 24px;
        }

        .stat-card h3 {
          color: #8888a0;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-value {
          color: #f0f0f5;
          font-size: 32px;
          font-weight: 700;
        }

        .logs-section h2 {
          color: #f0f0f5;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .table-container {
          background: #16161e;
          border: 1px solid #2a2a35;
          border-radius: 12px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 16px;
          text-align: left;
          color: #8888a0;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          background: #0a0a0f;
        }

        td {
          padding: 16px;
          color: #f0f0f5;
          font-size: 14px;
          border-top: 1px solid #2a2a35;
        }

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}