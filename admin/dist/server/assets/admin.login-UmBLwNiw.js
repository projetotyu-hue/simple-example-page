import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { c as cn, f as useNavigate } from "./router-BORuSdfU.js";
import { c as createLucideIcon, a as cva, f as useAuth, A as AtSign, E as Eye, B as Button, L as LoaderCircle, s as supabase, g as AuthError } from "./useAuth-BDGmCldG.js";
import { L as Label, I as Input } from "./label-OLvFfIHm.js";
import { E as EyeOff } from "./eye-off-my6MYQlz.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = reactExports.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";
function LoginParticles() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.62 0.15 280 / ${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `oklch(0.62 0.15 280 / ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 pointer-events-none z-0",
      style: { opacity: 0.6 }
    }
  );
}
function Component() {
  const navigate = useNavigate();
  const {
    session,
    isAdmin,
    loading: authLoading
  } = useAuth();
  const emailRef = reactExports.useRef(null);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [emailError, setEmailError] = reactExports.useState("");
  const [passwordError, setPasswordError] = reactExports.useState("");
  reactExports.useEffect(() => {
    emailRef.current?.focus();
  }, []);
  reactExports.useEffect(() => {
    if (!authLoading && session && isAdmin) {
      navigate({
        to: "/admin/dashboard"
      });
    }
  }, [session, isAdmin, authLoading, navigate]);
  const isValidEmail = (email2) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2);
  };
  const isValidPassword = (password2) => {
    return password2.length >= 6;
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    if (value && !isValidEmail(value)) {
      setEmailError("Email inválido");
    } else {
      setEmailError("");
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
    if (value && !isValidPassword(value)) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!email) {
      setEmailError("Email é obrigatório");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Email inválido");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Senha é obrigatória");
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      hasError = true;
    }
    if (hasError) return;
    setError("");
    setSubmitting(true);
    const {
      data,
      error: signInError
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (signInError || !data.session) {
      setSubmitting(false);
      if (signInError instanceof AuthError) {
        if (signInError.status === 0) {
          setError("Erro de rede. Verifique sua conexão.");
        } else if (signInError.status === 400 || signInError.status === 401) {
          setError("Email ou senha incorretos");
        } else {
          setError("Erro ao fazer login. Tente novamente mais tarde.");
        }
      } else {
        setError("Email ou senha incorretos");
      }
      return;
    }
    const {
      data: roleRow,
      error: roleError
    } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
    if (roleError || !roleRow) {
      await supabase.auth.signOut();
      setSubmitting(false);
      if (roleError) {
        setError("Erro ao verificar permissões. Tente novamente.");
      } else {
        setError("Usuário não tem permissão de administrador");
      }
      return;
    }
    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => {
      navigate({
        to: "/admin/dashboard"
      });
    }, 1200);
  };
  const isFormInvalid = !email || !password || !!emailError || !!passwordError;
  const isDisabled = isFormInvalid || submitting || success;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex items-center justify-center bg-background relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoginParticles, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse [animation-delay:1000ms]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse [animation-delay:500ms]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-md mx-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-bold shadow-lg shadow-primary/25 animate-in fade-in zoom-in duration-500", children: "A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent", children: "Achadinhos da Vitrine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Painel Administrativo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref: emailRef, id: "email", type: "email", autoComplete: "email", value: email, onChange: handleEmailChange, className: cn("pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors", emailError && "border-destructive focus-visible:ring-destructive"), placeholder: "admin@exemplo.com", disabled: submitting || success, maxLength: 255 })
          ] }),
          emailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: emailError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-foreground", children: "Senha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-xs text-primary hover:opacity-80 transition-opacity", children: "Esqueceu a senha?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: showPassword ? "text" : "password", autoComplete: "current-password", value: password, onChange: handlePasswordChange, className: cn("pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors", passwordError && "border-destructive focus-visible:ring-destructive"), placeholder: "••••••••", disabled: submitting || success, maxLength: 128 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors", tabIndex: -1, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] }),
          passwordError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: passwordError })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", children: error })
        ] }),
        success && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-green-500/50 bg-green-500/10 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm text-green-600 dark:text-green-400", children: "Redirecionando..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isDisabled, className: "w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60", children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Entrando..."
        ] }) : success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "mr-2 h-4 w-4" }),
          "Redirecionando..."
        ] }) : "Entrar" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
        "Acesso restrito"
      ] })
    ] })
  ] });
}
export {
  Component as component
};
