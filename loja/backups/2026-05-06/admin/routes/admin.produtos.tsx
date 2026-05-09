import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, FormEvent, useRef } from "react";
import { Plus, Pencil, Trash2, Loader2, Package, X, Upload, ImagePlus, GripVertical, Star, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import * as Dialog from "@radix-ui/react-dialog";

export const Route = createFileRoute("/admin/produtos")({
  head: () => ({ meta: [{ title: "Produtos — Achadinhos Admin" }] }),
  component: ProdutosPage,
});

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number | null;
  image_url: string | null;
  category: string | null;
  category_id: string | null;
  badge: string | null;
  featured: boolean;
  free_shipping: boolean;
  sales_count: number;
  section: string;
  position: number;
  stock: number | null;
  default_variation: any | null;
  additional_images: string[] | null;
  video_url: string | null;
  bonus_enabled: boolean;
  bonus_title: string | null;
  bonus_description: string | null;
  bonus_highlight: string | null;
  bonus_warning: string | null;
  gift_title: string | null;
  gift_description: string | null;
  gift_image_url: string | null;
  reviews_total: string | null;
  is_primary: boolean;
  primary_order: number | null;
  shipping_option_id: string;
  customization_label: string | null;
};

type ProductVariation = {
  id?: string;
  product_id?: string;
  name: string;
  value: string;
  qtd: number;
  price?: number;
  image_urls?: string[];
};

type Review = {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  avatar_url: string | null;
  variation: string | null;
  days_ago: number | null;
  likes: number | null;
  created_at: string;
};

const SHIPPING_OPTIONS = [
  { id: "padrao", label: "Padrão (grátis)", price: 0, days: 0 },
  { id: "padrao-pago", label: "Entrega Padrão (R$ 19,90 - 10 dias)", price: 19.9, days: 10 },
  { id: "expressa", label: "Entrega Expressa (R$ 29,90 - 7 dias)", price: 29.9, days: 7 },
];

const TOP_POSITIONS = [
  { value: "", label: "Sem posição" },
  { value: "1", label: "TOP 1" },
  { value: "2", label: "TOP 2" },
  { value: "3", label: "TOP 3" },
];

function ProdutosPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("position", { ascending: true }),
      supabase.from("categories").select("id,name").order("name"),
    ]);
    if (p.error) setError("Erro ao carregar produtos");
    setItems((p.data as Product[]) ?? []);
    setCategories((c.data as Category[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(p: Product) {
    setConfirmingId(null);
    setDeletingIds((prev) => new Set(prev).add(p.id));

    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      alert("Erro ao excluir");
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(p.id);
        return next;
      });
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== p.id));
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(p.id);
      return next;
    });
  }

  const filteredItems = items.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Produtos">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} produto(s)</p>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </button>
      </div>

      <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-muted-foreground shrink-0">
          <path d="m21 21-4.34-4.34"></path>
          <circle cx="11" cy="11" r="8"></circle>
        </svg>
        <input 
          placeholder="Buscar por nome ou categoria..." 
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder-gray-400" 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center bg-card rounded-xl border border-border">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm">Nenhum produto cadastrado ainda.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">NOME</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PREÇO</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ESTOQUE</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">TOP</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">STATUS</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">VENDAS</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AÇÕES</p>
          </div>

          {filteredItems.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px_1fr_auto] gap-4 px-5 py-3.5 items-center border-b border-gray-50 last:border-b-0 transition-all duration-300 ${
                deletingIds.has(p.id)
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              } ${confirmingId === p.id ? "bg-red-50/50" : ""}`}
            >
              <p className="text-sm text-muted-foreground w-8">{p.position || items.length - i}</p>
              <div className="flex items-center gap-3 min-w-0">
                {p.image_url ? (
                  <img alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0" src={p.image_url} />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {categories.find(c => c.id === p.category_id)?.name || p.category || 'sem categoria'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                {p.original_price && (
                  <p className="text-xs text-muted-foreground line-through">R$ {Number(p.original_price).toFixed(2).replace('.', ',')}</p>
                )}
              </div>
              <p className="text-sm text-foreground">{p.stock ?? 500}</p>
              <p className="text-sm text-muted-foreground">{p.badge || 'Nenhum'}</p>
              <button
                onClick={async () => {
                  const { error } = await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id);
                  if (!error) void load();
                }}
                className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider w-fit transition-colors ${
                  p.featured ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-red-500 bg-red-50 hover:bg-red-100'
                }`}
              >
                ● {p.featured ? 'Ativo' : 'Inativo'}
              </button>
              <p className="text-sm text-foreground">{p.sales_count || 0}</p>
              <div className="flex items-center gap-1 shrink-0">
                <a href={`/produto/${p.id}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </a>
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setConfirmingId(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length > 0 && (
            <div className="flex items-center justify-center gap-1 my-4">
              <button disabled className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg text-sm transition-colors bg-primary text-white font-medium">1</button>
              <button disabled className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            void load();
          }}
        />
      )}
      <Dialog.Root open={!!confirmingId} onOpenChange={(open) => !open && setConfirmingId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-2xl p-6 shadow-xl animate-in zoom-in-95 fade-in-0">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-gray-900">Excluir produto?</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Essa ação não pode ser desfeita. O produto será removido permanentemente.
                </Dialog.Description>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = items.find((x) => x.id === confirmingId);
                    if (p) void handleDelete(p);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AdminLayout>
  );
}

function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dados" | "avaliacoes" | "conteudo">("dados");

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = useState(product?.original_price ? String(product.original_price) : "");
  const [stock, setStock] = useState(product?.stock ? String(product.stock) : "500");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [badge, setBadge] = useState(product?.badge ?? "");

  const [imageUrls, setImageUrls] = useState<string[]>(product?.additional_images ?? (product?.image_url ? [product.image_url] : []));
  const [uploading, setUploading] = useState(false);

  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [varName, setVarName] = useState("");
  const [varValue, setVarValue] = useState("");
  const [varQtd, setVarQtd] = useState("");
  const [varPrice, setVarPrice] = useState("");
  const [varImageUrls, setVarImageUrls] = useState<string[]>([]);
  const [varUploading, setVarUploading] = useState(false);

  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isPrimary, setIsPrimary] = useState(product?.is_primary ?? false);
  const [primaryOrder, setPrimaryOrder] = useState(product?.primary_order ? String(product.primary_order) : "");
  const [shippingOptionId, setShippingOptionId] = useState(product?.shipping_option_id ?? "padrao");
  const [customizationLabel, setCustomizationLabel] = useState(product?.customization_label ?? "");
  const [videoUrl, setVideoUrl] = useState(product?.video_url ?? "");
  const [infoImageUrls, setInfoImageUrls] = useState<string[]>(product?.info_images ?? []);
  const [infoUploading, setInfoUploading] = useState(false);
  const infoFileRef = useRef<HTMLInputElement>(null);
  const [giftTitle, setGiftTitle] = useState(product?.gift_title ?? "");
  const [giftDescription, setGiftDescription] = useState(product?.gift_description ?? "");
  const [giftImageUrls, setGiftImageUrls] = useState<string[]>(
    product?.gift_image_url ? [product.gift_image_url] : []
  );
  const [giftUploading, setGiftUploading] = useState(false);
  const giftFileRef = useRef<HTMLInputElement>(null);

  const [bonusEnabled, setBonusEnabled] = useState(product?.bonus_enabled ?? false);
  const [bonusTitle, setBonusTitle] = useState(product?.bonus_title ?? "");
  const [bonusDescription, setBonusDescription] = useState(product?.bonus_description ?? "");
  const [bonusHighlight, setBonusHighlight] = useState(product?.bonus_highlight ?? "");
  const [bonusWarning, setBonusWarning] = useState(product?.bonus_warning ?? "");

  const [reviewsTotal, setReviewsTotal] = useState(product?.reviews_total ?? "");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewAvatarUrl, setReviewAvatarUrl] = useState("");
  const [reviewVariation, setReviewVariation] = useState("");
  const [reviewDaysAgo, setReviewDaysAgo] = useState("");
  const [reviewLikes, setReviewLikes] = useState("0");
  const [reviewUploading, setReviewUploading] = useState(false);
  const reviewFileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const varFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product?.id) {
      loadVariations(product.id);
      loadReviews(product.id);
    }
  }, [product?.id]);

  async function loadVariations(productId: string) {
    const { data, error } = await supabase
      .from("product_variations")
      .select("*")
      .eq("product_id", productId);
    if (!error && data) {
      setVariations(data.map((v: any) => ({
        id: v.id,
        product_id: v.product_id,
        name: v.name,
        value: v.value,
        qtd: v.qtd,
        price: v.price,
        image_urls: v.image_urls ?? [],
      })));
    }
  }

  async function loadReviews(productId: string) {
    setLoadingReviews(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews(data as Review[]);
    }
    setLoadingReviews(false);
  }

  async function handleUpload(file: File, isVariation = false) {
    if (isVariation) setVarUploading(true);
    else setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      if (isVariation) {
        setVarImageUrls((prev) => [...prev, data.publicUrl]);
      } else {
        setImageUrls((prev) => [...prev, data.publicUrl]);
      }
    } catch {
      setErr("Erro ao enviar imagem");
    } finally {
      if (isVariation) setVarUploading(false);
      else setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function removeVarImage(index: number) {
    setVarImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGiftUpload(file: File) {
    setGiftUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `gifts/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setGiftImageUrls((prev) => [...prev, data.publicUrl]);
    } catch {
      setErr("Erro ao enviar imagem do brinde");
    } finally {
      setGiftUploading(false);
    }
  }

  function removeGiftImage(index: number) {
    setGiftImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleInfoUpload(file: File) {
    setInfoUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `info/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setInfoImageUrls((prev) => [...prev, data.publicUrl]);
    } catch {
      setErr("Erro ao enviar imagem adicional");
    } finally {
      setInfoUploading(false);
    }
  }

  function removeInfoImage(index: number) {
    setInfoImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleReviewUpload(file: File) {
    setReviewUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `reviews/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setReviewAvatarUrl(data.publicUrl);
    } catch {
      setErr("Erro ao enviar imagem da avaliação");
    } finally {
      setReviewUploading(false);
    }
  }

  function startEditReview(r: Review) {
    setEditingReview(r);
    setReviewName(r.author_name);
    setReviewRating(r.rating);
    setReviewComment(r.comment ?? "");
    setReviewAvatarUrl(r.avatar_url ?? "");
    setReviewVariation(r.variation ?? "");
    setReviewDaysAgo(r.days_ago?.toString() ?? "0");
    setReviewLikes(r.likes?.toString() ?? "0");
    setShowReviewForm(true);
  }

  function startNewReview() {
    setEditingReview(null);
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    setReviewAvatarUrl("");
    setReviewVariation("");
    setReviewDaysAgo("0");
    setReviewLikes("0");
    setShowReviewForm(true);
  }

  async function saveReview(e: FormEvent) {
    e.preventDefault();
    if (!product?.id) return;
    setErr(null);
    try {
      const payload: any = {
        author_name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim() || null,
        avatar_url: reviewAvatarUrl || null,
        variation: reviewVariation.trim() || null,
        days_ago: reviewDaysAgo ? parseInt(reviewDaysAgo) : 0,
        likes: reviewLikes ? parseInt(reviewLikes) : 0,
      };

      if (editingReview?.id) {
        const { error } = await supabase
          .from("reviews")
          .update(payload)
          .eq("id", editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("reviews")
          .insert([{ ...payload, product_id: product.id }]);
        if (error) throw error;
      }

      setShowReviewForm(false);
      setEditingReview(null);
      loadReviews(product.id);
    } catch (e: any) {
      setErr(e.message || "Erro ao salvar avaliação");
    }
  }

  async function deleteReview(reviewId: string) {
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
      if (product?.id) loadReviews(product.id);
    } catch (e: any) {
      setErr(e.message || "Erro ao excluir");
    }
  }

  function addVariation() {
    if (!varName.trim() || !varValue.trim() || !varQtd) {
      setErr("Preencha nome, valor e quantidade da variação");
      return;
    }
    const newVar: ProductVariation = {
      name: varName.trim(),
      value: varValue.trim(),
      qtd: parseInt(varQtd),
      price: varPrice ? parseFloat(varPrice.replace(",", ".")) : undefined,
      image_urls: varImageUrls.length > 0 ? [...varImageUrls] : undefined,
    };
    setVariations((prev) => [...prev, newVar]);
    setVarName("");
    setVarValue("");
    setVarQtd("");
    setVarPrice("");
    setVarImageUrls([]);
    setShowVariationForm(false);
    setErr(null);
  }

  function removeVariation(index: number) {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) {
      setErr("Nome e preço são obrigatórios");
      return;
    }
    setSaving(true);
    setErr(null);

    const priceNum = parseFloat(price.replace(",", "."));
    const originalPriceNum = originalPrice ? parseFloat(originalPrice.replace(",", ".")) : null;
    const discount =
      originalPriceNum && originalPriceNum > priceNum
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : null;

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      original_price: originalPriceNum,
      discount_percent: discount,
      category_id: categoryId || null,
      category: selectedCategory?.name ?? null,
      badge: badge.trim() || null,
      image_url: imageUrls[0] ?? null,
      additional_images: imageUrls.length > 0 ? imageUrls : null,
      featured,
      free_shipping: shippingOptionId === "padrao",
      stock: stock ? parseInt(stock) : null,
      is_primary: isPrimary,
      primary_order: primaryOrder ? parseInt(primaryOrder) : null,
      shipping_option_id: shippingOptionId,
      customization_label: customizationLabel.trim() || null,
      reviews_total: reviewsTotal.trim() || null,
      video_url: videoUrl.trim() || null,
      bonus_enabled: bonusEnabled,
      bonus_title: bonusTitle.trim() || null,
      bonus_description: bonusDescription.trim() || null,
      bonus_highlight: bonusHighlight.trim() || null,
      bonus_warning: bonusWarning.trim() || null,
      gift_title: giftTitle.trim() || null,
      gift_description: giftDescription.trim() || null,
      gift_image_url: giftImageUrls.length > 0 ? giftImageUrls[0] : null,
      info_images: infoImageUrls.length > 0 ? infoImageUrls : null,
      section: primaryOrder && ["1", "2", "3"].includes(primaryOrder) ? "top" : (product?.section === "top" ? "all" : (product?.section ?? "all")),
    };

    try {
      let productId = product?.id;

      if (product) {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      if (productId && variations.length > 0) {
        if (product) {
          await supabase.from("product_variations").delete().eq("product_id", productId);
        }
        const variationsPayload = variations.map((v) => ({
          product_id: productId,
          name: v.name,
          value: v.value,
          qtd: v.qtd,
          price: v.price,
          image_urls: v.image_urls,
        }));
        const { error: varError } = await supabase.from("product_variations").insert(variationsPayload);
        if (varError) throw varError;
      }

      onSaved();
    } catch (e: any) {
      setErr(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            {product ? "Editar produto" : "Novo produto"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("dados")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "dados"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Dados
          </button>
          <button
            onClick={() => {
              setActiveTab("avaliacoes");
              if (product?.id && !showReviews) {
                setShowReviews(true);
                loadReviews(product.id);
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "avaliacoes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Avaliações ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("conteudo")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "conteudo"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Conteúdo Adicional
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "dados" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Imagens do produto</label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[88px]">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg border border-border overflow-hidden group shrink-0">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60 shrink-0"
                  >
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((f) => void handleUpload(f));
                    e.target.value = "";
                  }}
                />
                <input
                  value={imageUrls.join(", ")}
                  onChange={(e) => {
                    const urls = e.target.value.split(",").map((u) => u.trim()).filter(Boolean);
                    setImageUrls(urls);
                  }}
                  placeholder="ou cole URLs separadas por vírgula"
                  className="mt-2 w-full px-3 py-1.5 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <Field label="Nome">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                />
              </Field>

              <Field label="Descrição">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none min-h-[80px]"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (R$)">
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29,90"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                </Field>
                <Field label="Preço original (opcional)">
                  <input
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="59,90"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Estoque">
                  <input
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="500"
                    type="number"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                </Field>
                <Field label="Categoria">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9"
                  >
                    <option value="">— Sem categoria —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Selo (badge)">
                  <input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: NOVIDADE"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                </Field>
                <Field label="Opção de frete">
                  <select
                    value={shippingOptionId}
                    onChange={(e) => setShippingOptionId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9"
                  >
                    {SHIPPING_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Posição no TOP">
                  <select
                    value={primaryOrder}
                    onChange={(e) => {
                      setPrimaryOrder(e.target.value);
                      if (e.target.value) setIsPrimary(true);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9"
                  >
                    {TOP_POSITIONS.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Total de avaliações exibido">
                  <input
                    value={reviewsTotal}
                    onChange={(e) => setReviewsTotal(e.target.value)}
                    placeholder="Ex: 210"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                </Field>
              </div>

              <Field label="Campo de personalização (opcional)">
                <input
                  value={customizationLabel}
                  onChange={(e) => setCustomizationLabel(e.target.value)}
                  placeholder="Ex: Nome para bordado, Texto para gravação..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                />
              </Field>

              <div className="flex gap-6 pt-1">
                <ToggleSwitch label="Exibir na página inicial" checked={featured} onChange={setFeatured} />
                <ToggleSwitch label="Produto principal" checked={isPrimary} onChange={setIsPrimary} />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">Variações do produto</h4>
                  <button
                    type="button"
                    onClick={() => setShowVariationForm(!showVariationForm)}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar variação
                  </button>
                </div>

                {showVariationForm && (
                  <div className="bg-muted/30 rounded-lg p-4 mb-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nome (ex: Cor)">
                        <input
                          value={varName}
                          onChange={(e) => setVarName(e.target.value)}
                          placeholder="Cor"
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                        />
                      </Field>
                      <Field label="Valor (ex: Azul)">
                        <input
                          value={varValue}
                          onChange={(e) => setVarValue(e.target.value)}
                          placeholder="Azul"
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Qtd (estoque)">
                        <input
                          value={varQtd}
                          onChange={(e) => setVarQtd(e.target.value)}
                          placeholder="10"
                          type="number"
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                        />
                      </Field>
                      <Field label="Preço específico (opcional)">
                        <input
                          value={varPrice}
                          onChange={(e) => setVarPrice(e.target.value)}
                          placeholder="29,90"
                          className="w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                        />
                      </Field>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Imagens da variação</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {varImageUrls.map((url, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-lg border border-border overflow-hidden group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeVarImage(i)}
                              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => varFileRef.current?.click()}
                          disabled={varUploading}
                          className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                        >
                          {varUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </button>
                      </div>
                      <input
                        ref={varFileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach((f) => void handleUpload(f, true));
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVariationForm(false);
                          setVarName("");
                          setVarValue("");
                          setVarQtd("");
                          setVarPrice("");
                          setVarImageUrls([]);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={addVariation}
                        className="px-3 py-1.5 rounded-lg text-xs bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}

                {variations.length > 0 && (
                  <div className="space-y-2">
                    {variations.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 bg-muted/20 rounded-lg p-3 text-sm">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{v.name}: {v.value}</p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {v.qtd} {v.price ? `• R$ ${v.price.toFixed(2).replace('.', ',')}` : ''}
                          </p>
                          {v.image_urls && v.image_urls.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {v.image_urls.map((url, idx) => (
                                <img key={idx} src={url} alt="" className="w-8 h-8 rounded object-cover" />
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariation(i)}
                          className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "avaliacoes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  Avaliações do produto ({reviews.length})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startNewReview}
                    className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova avaliação
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (product?.id) {
                        setShowReviews(!showReviews);
                        if (!showReviews) loadReviews(product.id);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {showReviews ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showReviews ? "Ocultar" : "Ver avaliações"}
                  </button>
                </div>
              </div>

              {showReviewForm && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <Field label="Nome *">
                    <input
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Nome do cliente"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                    />
                  </Field>

                  <Field label="Nota *">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`h-5 w-5 ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Comentário *">
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="O que o cliente achou do produto?"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Foto do cliente (opcional)">
                    <div className="flex items-center gap-2">
                      {reviewAvatarUrl && (
                        <img src={reviewAvatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => reviewFileRef.current?.click()}
                        disabled={reviewUploading}
                        className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-60"
                      >
                        {reviewUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        Adicionar foto
                      </button>
                      <input
                        ref={reviewFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleReviewUpload(file);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </Field>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowReviewForm(false); setEditingReview(null); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={saveReview}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}

              {!showReviewForm && loadingReviews ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !showReviews ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Clique em "Ver avaliações" para carregar as avaliações deste produto.
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhuma avaliação encontrada para este produto.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {r.avatar_url ? (
                            <img src={r.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                              {r.author_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium text-foreground">{r.author_name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${star <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditReview(r)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteReview(r.id)}
                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-foreground">{r.comment}</p>
                      )}
                      {(r.variation || r.days_ago !== undefined) && (
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          {r.variation && <span>Variação: {r.variation}</span>}
                          {r.days_ago !== undefined && <span>Há {r.days_ago} dias</span>}
                          {r.likes !== undefined && <span>👍 {r.likes}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "conteudo" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">🖼️ Imagens adicionais</h4>
                <p className="text-xs text-muted-foreground -mt-2">
                  Exibidas na página do produto antes das avaliações, uma abaixo da outra
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {infoImageUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg border border-border overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeInfoImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => infoFileRef.current?.click()}
                    disabled={infoUploading}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                  >
                    {infoUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-[10px]">Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={infoFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((f) => void handleInfoUpload(f));
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Field label="Link do vídeo (opcional)">
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    YouTube ou qualquer link de vídeo
                  </p>
                </Field>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">🎁 Configuração do Bloco de Brinde</h4>
                  <ToggleSwitch label="Ativar Brinde" checked={bonusEnabled} onChange={setBonusEnabled} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Título do Bloco">
                    <input
                      value={bonusTitle}
                      onChange={(e) => setBonusTitle(e.target.value)}
                      placeholder="Ex: 🎁 BRINDE EXCLUSIVO!"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                    />
                  </Field>
                  <Field label="Aviso de Validade">
                    <input
                      value={bonusWarning}
                      onChange={(e) => setBonusWarning(e.target.value)}
                      placeholder="Ex: ⚡ Oferta válida apenas hoje"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Texto da Oferta">
                    <input
                      value={bonusDescription}
                      onChange={(e) => setBonusDescription(e.target.value)}
                      placeholder="Ex: Comprando hoje, você recebe:"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                    />
                  </Field>
                  <Field label="Destaque (Brinde)">
                    <input
                      value={bonusHighlight}
                      onChange={(e) => setBonusHighlight(e.target.value)}
                      placeholder="Ex: 1 Capacete GRÁTIS!"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9"
                    />
                  </Field>
                </div>

                <Field label="Imagem do brinde">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {giftImageUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg border border-border overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGiftImage(i)}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => giftFileRef.current?.click()}
                      disabled={giftUploading}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                    >
                      {giftUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                    </button>
                  </div>
                  <input
                    ref={giftFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleGiftUpload(file);
                      e.target.value = "";
                    }}
                  />
                </Field>
              </div>
            </div>
          )}

          {err && <p className="text-sm text-red-600 mt-4">{err}</p>}

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-foreground"
    >
      <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      {label}
    </button>
  );
}
