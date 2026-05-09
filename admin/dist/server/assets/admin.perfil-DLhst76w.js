import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, U as Users } from "./AdminLayout-D1Ns8z5y.js";
import { c as createLucideIcon, L as LoaderCircle, s as supabase } from "./useAuth-BDGmCldG.js";
import { P as Plus, T as Trash2 } from "./trash-2-De-lS6-V.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const __iconNode$2 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function PerfilPage() {
  const [email, setEmail] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("perfil");
  const [admins, setAdmins] = reactExports.useState([]);
  const [newUserEmail, setNewUserEmail] = reactExports.useState("");
  async function loadData() {
    setLoading(true);
    try {
      const [{
        data: {
          user
        }
      }, {
        data: rolesData
      }, {
        data: profilesData
      }] = await Promise.all([supabase.auth.getUser(), supabase.from("user_roles").select("user_id, role"), supabase.from("profiles").select("id, email")]);
      if (user) setEmail(user.email || "");
      if (rolesData && profilesData) {
        const joinedAdmins = rolesData.map((role) => ({
          ...role,
          profiles: profilesData.find((p) => p.id === role.user_id) || null
        }));
        setAdmins(joinedAdmins);
      } else if (user) {
        setAdmins([{
          user_id: user.id,
          role: "unknown",
          profiles: {
            email: user.email || "Eu"
          }
        }]);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Erro ao carregar usuários. Isso geralmente acontece se você ainda não tem a permissão 'admin' no banco de dados.");
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
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
        const {
          error: error2
        } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error2) throw error2;
        setSuccess("Senha atualizada com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
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
      const {
        data: profile,
        error: pError
      } = await supabase.from("profiles").select("id").eq("email", newUserEmail).maybeSingle();
      if (pError) throw pError;
      if (!profile) {
        setError("Usuário não encontrado. Ele precisa se cadastrar na loja primeiro.");
        return;
      }
      const {
        error: rError
      } = await supabase.from("user_roles").insert([{
        user_id: profile.id,
        role: "admin"
      }]);
      if (rError) throw rError;
      setSuccess("Novo administrador adicionado!");
      setNewUserEmail("");
      void loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleRemoveAdmin = async (userId) => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (user?.id === userId) {
      setError("Você não pode remover a si mesmo.");
      return;
    }
    setSaving(true);
    try {
      const {
        error: error2
      } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (error2) throw error2;
      setSuccess("Administrador removido.");
      void loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Perfil", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) });
  }
  const currentAdmin = admins.find((a) => a.profiles?.email === email);
  const isActuallyAdmin = currentAdmin?.role === "admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Perfil", children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: error }),
    success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600", children: success }),
    !isActuallyAdmin && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-amber-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-900", children: "Permissão de Administrador necessária" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 leading-relaxed mt-0.5", children: "Você está logado, mas seu usuário ainda não tem a role de administrador no banco de dados. Isso impede que você salve configurações (ERRO DE RLS)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 bg-white/50 p-2 rounded border border-amber-200 font-mono text-[10px] text-amber-800 break-all", children: [
          "INSERT INTO public.user_roles (user_id, role) VALUES ('",
          admins[0]?.user_id,
          "', 'admin') ON CONFLICT DO NOTHING;"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600 mt-2 font-medium italic", children: "* Rode o comando acima no SQL Editor do seu Supabase para se tornar um admin." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-border mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("perfil"), className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "perfil" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
        "Meu perfil"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("usuarios"), className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "usuarios" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
        "Usuários"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", children: [
      activeTab === "perfil" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6 flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none bg-background text-muted-foreground cursor-not-allowed", value: email, disabled: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium mb-4", children: "Alterar senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-background", placeholder: "Nova senha", type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-background", placeholder: "Confirmar nova senha", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSavePerfil, disabled: saving, className: "bg-primary hover:bg-primary/90 text-white rounded-lg py-2 text-sm transition-colors flex justify-center items-center gap-2", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Salvar senha"
        ] })
      ] }),
      activeTab === "usuarios" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-4", children: "Adicionar Administrador" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary bg-background", placeholder: "Email do usuário...", value: newUserEmail, onChange: (e) => setNewUserEmail(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAddAdmin, disabled: saving || !newUserEmail, className: "bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Adicionar"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-2 italic", children: "* O usuário já deve ter uma conta criada na loja." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Administradores Atuais" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: admins.map((admin) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between hover:bg-muted/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs", children: admin.profiles?.email?.[0].toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: admin.profiles?.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground capitalize", children: admin.role })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemoveAdmin(admin.user_id), className: "p-2 text-muted-foreground hover:text-red-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }, admin.user_id)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  PerfilPage as component
};
