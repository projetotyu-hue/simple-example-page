import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { cn, getDevice, getOS, getBrowser } from "../lib/utils";

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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-metrics`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
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

  async function recordMetric() {
    const ip = await fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => d.ip)
      .catch(() => "unknown");

    await supabase.from("metrics").insert({
      ip,
      device: getDevice(),
      os: getOS(),
      browser: getBrowser(),
      origin: "Direct",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Sentinel Shield</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block px-4 py-2 hover:bg-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Visitas Hoje</h3>
            <p className="text-2xl font-bold">{data?.metrics?.totalVisits || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Visitantes Únicos</h3>
            <p className="text-2xl font-bold">
              {data?.metrics?.uniqueVisitors || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Mobile</h3>
            <p className="text-2xl font-bold">
              {data?.metrics?.devices?.mobile || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Desktop</h3>
            <p className="text-2xl font-bold">
              {data?.metrics?.devices?.desktop || 0}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Logs Recentes</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm">Usuário</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Data</th>
                </tr>
              </thead>
              <tbody>
                {data?.logs?.map((log: any) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2 text-sm">{log.event_type}</td>
                    <td className="px-4 py-2 text-sm">{log.username}</td>
                    <td className="px-4 py-2 text-sm">{log.status}</td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}