import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Página de Exemplo" },
      { name: "description", content: "Uma página simples de exemplo criada com Lovable." },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Exemplo
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Bem-vindo à sua página de exemplo
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Esta é uma página simples para você começar. Edite e personalize como quiser.
        </p>
        <div className="mt-8 flex gap-3">
          <Button>Começar</Button>
          <Button variant="outline">Saiba mais</Button>
        </div>

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {[
            { title: "Rápido", desc: "Construído com Vite e React." },
            { title: "Bonito", desc: "Estilizado com Tailwind e shadcn." },
            { title: "Simples", desc: "Pronto para você editar." },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
