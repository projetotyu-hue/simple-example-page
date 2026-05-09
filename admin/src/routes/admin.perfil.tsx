import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, ShieldCheck, Mail, Phone, MapPin, Building2, Users as UsersIcon, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Achadinhos Admin" }] }),
  component: PerfilPage,
});

type AdminUser = {
  user_id: string;
  role: string;
  profiles: {
    email: string | null;
  } | null;
};

function PerfilPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("perfil");

  // Users Management
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [{ data: { user } }, { data: rolesData }, { data: profilesData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("profiles").select("id, email")
      ]);

      if (user) setEmail(user.email || "");
      
      if (rolesData && profilesData) {
        const joinedAdmins = rolesData.map(role => ({
          ...role,
          profiles: profilesData.find(p => p.id === role.user_id) || null
        }));
        setAdmins(joinedAdmins as AdminUser[]);
      } else if (user) {
        // Fallback: at least show the current user if tables are empty or RLS blocks view
        setAdmins([{ user_id: user.id, role: 'unknown', profiles: { email: user.email || 'Eu' } }]);
      }
    } catch (err: any) {
      console.error("Error loading users:", err);
      setError("Erro ao carregar usuários. Isso geralmente acontece se você ainda não tem a permissão 'admin' no banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const handleSavePerfil = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("A nova senha e a confirmação não coincidem.");
      return;
    }

    setSaving(true);
    try {
      if (newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setSuccess("Senha atualizada com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newUserEmail) return;
    setSaving(true);
    setError(null);
    try {
      // Find user by email in profiles
      const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUserEmail)
        .maybeSingle();

      if (pError) throw pError;
      if (!profile) {
        setError("Usuário não encontrado. Ele precisa se cadastrar na loja primeiro.");
        return;
      }

      const { error: rError } = await supabase
        .from("user_roles")
        .insert([{ user_id: profile.id, role: "admin" }]);

      if (rError) throw rError;
      
      setSuccess("Novo administrador adicionado!");
      setNewUserEmail("");
      void loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === userId) {
      setError("Você não pode remover a si mesmo.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      
      if (error) throw error;
      setSuccess("Administrador removido.");
      void loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Perfil">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const currentAdmin = admins.find(a => a.profiles?.email === email);
  const isActuallyAdmin = currentAdmin?.role === 'admin';

  return (
    <AdminLayout title="Perfil">
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {!isActuallyAdmin && !loading && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Permissão de Administrador necessária</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                Você está logado, mas seu usuário ainda não tem a role de administrador no banco de dados. 
                Isso impede que você salve configurações (ERRO DE RLS).
              </p>
              <div className="mt-3 bg-white/50 p-2 rounded border border-amber-200 font-mono text-[10px] text-amber-800 break-all">
                INSERT INTO public.user_roles (user_id, role) VALUES ('{admins[0]?.user_id}', 'admin') ON CONFLICT DO NOTHING;
              </div>
              <p className="text-[10px] text-amber-600 mt-2 font-medium italic">
                * Rode o comando acima no SQL Editor do seu Supabase para se tornar um admin.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "perfil" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Meu perfil
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "usuarios" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          Usuários
        </button>
      </div>

      <div className="max-w-xl">
        {activeTab === "perfil" && (
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-5">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Email</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-background text-muted-foreground cursor-not-allowed"
                value={email}
                disabled
              />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium mb-4">Alterar senha</p>
              <div className="space-y-3">
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-background"
                  placeholder="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <input
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-background"
                  placeholder="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleSavePerfil}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg py-2 text-sm transition-colors flex justify-center items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar senha
            </button>
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold mb-4">Adicionar Administrador</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary bg-background"
                    placeholder="Email do usuário..."
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddAdmin}
                  disabled={saving || !newUserEmail}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                * O usuário já deve ter uma conta criada na loja.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="text-sm font-semibold">Administradores Atuais</h3>
              </div>
              <div className="divide-y divide-border">
                {admins.map(admin => (
                  <div key={admin.user_id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {admin.profiles?.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{admin.profiles?.email}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{admin.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(admin.user_id)}
                      className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
