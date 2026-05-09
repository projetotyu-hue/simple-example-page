export const pages = {
  dashboard: () => import('./dashboard'),
  categorias: () => import('./categorias'),
  produtos: () => import('./produtos'),
  protecao: () => import('./protecao'),
  relacionados: () => import('./relacionados'),
  clientes: () => import('./clientes'),
  pedidos: () => import('./pedidos'),
  perfil: () => import('./perfil'),
  frete: () => import('./frete'),
  tiktok: () => import('./tiktok'),
  whosamungus: () => import('./whosamungus'),
  chave: () => import('./chave'),
  upsells: () => import('./upsells'),
  configuracoes: () => import('./configuracoes'),
} as const;
export type AdminSlug = keyof typeof pages;
