import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import stylesUrl from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sentinel Shield — Painel Admin" },
      {
        name: "description",
        content: "Painel administrativo de monitoramento, métricas e logs.",
      },
    ],
    links: [{ rel: "stylesheet", href: stylesUrl }],
  }),
  shellComponent: RootShell,
  notFoundComponent: NotFound,
});

function RootShell() {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="app">
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster position="top-right" theme="dark" richColors />
          </QueryClientProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada.</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Voltar ao início
      </Link>
    </div>
  );
}
