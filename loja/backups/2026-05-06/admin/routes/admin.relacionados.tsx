import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Link as LinkIcon, Search, ShoppingCart, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/relacionados")({
  head: () => ({ meta: [{ title: "Relacionados — Achadinhos Admin" }] }),
  component: RelacionadosPage,
});

type Product = {
  id: string;
  name: string;
  image_url: string | null;
  related_product_ids: string[] | null;
};

type Settings = {
  id: string;
  cart_recommendations: string[] | null;
};

function RelacionadosPage() {
  const [activeTab, setActiveTab] = useState<"product" | "global">("product");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [baseProduct, setBaseProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      // Load products
      const { data: productsData, error: pError } = await supabase
        .from("products")
        .select("id, name, image_url, related_product_ids")
        .order("name");
      
      if (pError) throw pError;
      
      if (productsData) {
        setAllProducts(productsData as Product[]);
        if (baseProduct) {
          const updated = productsData.find(p => p.id === baseProduct.id);
          if (updated) setBaseProduct(updated as Product);
        }
      }

      // Load settings for global recommendations
      const { data: settingsData, error: sError } = await supabase
        .from("settings")
        .select("id, cart_recommendations")
        .limit(1)
        .maybeSingle();
      
      if (sError) throw sError;
      
      if (settingsData) {
        setSettings(settingsData as Settings);
      }
    } catch (err: any) {
      console.error("Error loading data:", err);
      let errorMsg = err.message;
      if (err.message?.includes("column products.related_product_ids does not exist") || 
          err.message?.includes("column settings.cart_recommendations does not exist")) {
        errorMsg = "Colunas faltando no banco de dados. Vá ao SQL Editor do Supabase e rode: \n\n" +
                  "ALTER TABLE public.products ADD COLUMN IF NOT EXISTS related_product_ids UUID[] DEFAULT '{}'; \n" +
                  "ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS cart_recommendations UUID[] DEFAULT '{}';";
      }
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    if (!selectedProductId) return;
    setSaving(true);

    try {
      if (activeTab === "product" && baseProduct) {
        const currentIds = baseProduct.related_product_ids || [];
        if (currentIds.includes(selectedProductId)) {
          showMessage("Produto já está vinculado.", "error");
          return;
        }
        const newIds = [...currentIds, selectedProductId];
        const { error } = await supabase
          .from("products")
          .update({ related_product_ids: newIds })
          .eq("id", baseProduct.id);
        
        if (error) throw error;

        setBaseProduct({ ...baseProduct, related_product_ids: newIds });
        setAllProducts(allProducts.map(p => p.id === baseProduct.id ? { ...p, related_product_ids: newIds } : p));
        showMessage("Produto vinculado com sucesso!", "success");
      } else if (activeTab === "global") {
        let currentSettings = settings;
        if (!currentSettings) {
          // Try one last time to get settings or create one
          const { data: existing } = await supabase.from("settings").select("id, cart_recommendations").limit(1).maybeSingle();
          if (existing) {
            currentSettings = existing as Settings;
            setSettings(existing as Settings);
          } else {
            // Create a default row
            const { data: created, error: createError } = await supabase.from("settings").insert([{ shop_name: "Minha Loja" }]).select().single();
            if (createError) throw createError;
            currentSettings = created as Settings;
            setSettings(created as Settings);
          }
        }

        if (!currentSettings) throw new Error("Não foi possível carregar as configurações.");

        const currentIds = currentSettings.cart_recommendations || [];
        if (currentIds.includes(selectedProductId)) {
          showMessage("Produto já está vinculado.", "error");
          return;
        }
        const newIds = [...currentIds, selectedProductId];
        const { error } = await supabase
          .from("settings")
          .update({ cart_recommendations: newIds })
          .eq("id", currentSettings.id);
        
        if (error) throw error;

        setSettings({ ...currentSettings, cart_recommendations: newIds });
        showMessage("Sugestão global adicionada!", "success");
      }
      setSelectedProductId("");
    } catch (err: any) {
      console.error("Error adding related product:", err);
      let errorMsg = err.message;
      if (err.message?.includes("row-level security policy")) {
        errorMsg = "Erro de Permissão (RLS). Seu usuário não tem a role 'admin' no banco de dados.";
      }
      showMessage("Erro ao salvar: " + errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setSaving(true);
    try {
      if (activeTab === "product" && baseProduct) {
        const newIds = (baseProduct.related_product_ids || []).filter(rid => rid !== id);
        const { error } = await supabase
          .from("products")
          .update({ related_product_ids: newIds })
          .eq("id", baseProduct.id);
        
        if (error) throw error;

        setBaseProduct({ ...baseProduct, related_product_ids: newIds });
        setAllProducts(allProducts.map(p => p.id === baseProduct.id ? { ...p, related_product_ids: newIds } : p));
        showMessage("Vínculo removido.", "success");
      } else if (activeTab === "global" && settings) {
        const newIds = (settings.cart_recommendations || []).filter(rid => rid !== id);
        const { error } = await supabase
          .from("settings")
          .update({ cart_recommendations: newIds })
          .eq("id", settings.id);
        
        if (error) throw error;

        setSettings({ ...settings, cart_recommendations: newIds });
        showMessage("Sugestão global removida.", "success");
      }
    } catch (err: any) {
      console.error("Error removing related product:", err);
      showMessage("Erro ao remover: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const currentRelatedIds = activeTab === "product" 
    ? (baseProduct?.related_product_ids || []) 
    : (settings?.cart_recommendations || []);

  const relatedProducts = allProducts.filter(p => currentRelatedIds.includes(p.id));
  
  const availableProducts = allProducts.filter(p => {
    if (activeTab === "product") {
      return p.id !== baseProduct?.id && !currentRelatedIds.includes(p.id);
    }
    return !currentRelatedIds.includes(p.id);
  });

  if (loading && allProducts.length === 0) {
    return (
      <AdminLayout title="Relacionados">
        <div className="flex justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Relacionados">
      {message && (
        <div className={`mb-6 p-4 rounded-xl border animate-in fade-in slide-in-from-top duration-300 ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-8 bg-muted/30 p-1.5 rounded-xl border border-border w-fit shadow-sm">
        <button
          onClick={() => setActiveTab("product")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "product" 
              ? "bg-primary text-white shadow-lg shadow-primary/30" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Tag className="w-4 h-4" />
          Por Produto
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "global" 
              ? "bg-primary text-white shadow-lg shadow-primary/30" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Sugestões do Carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section */}
        {activeTab === "product" ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/20">
              <h3 className="text-sm font-semibold text-foreground mb-2">1. Selecione o Produto Base</h3>
              <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 focus-within:border-primary transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  placeholder="Filtrar produtos..." 
                  className="bg-transparent text-sm outline-none flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
              {allProducts
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => setBaseProduct(p)}
                    className={`w-full text-left p-4 flex items-center gap-4 transition-all ${
                      baseProduct?.id === p.id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <Tag className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${baseProduct?.id === p.id ? "text-primary" : "text-foreground"}`}>
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        {(p.related_product_ids || []).length} relacionados
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-10 text-center space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-xl font-bold text-foreground">Sugestões Globais</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Estes produtos aparecerão na seção "Você também pode gostar" do carrinho e checkout, independente do produto selecionado.
              </p>
            </div>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                ⚠️ Aparece no Checkout
              </div>
            </div>
          </div>
        )}

        {/* Right: Relationships Management */}
        <div className="space-y-6">
          {(activeTab === "product" && !baseProduct) ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground shadow-sm">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-10" />
              <p className="text-sm font-medium">Selecione um produto à esquerda para gerenciar seus relacionados.</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    {activeTab === "product" ? "Produtos Relacionados" : "Sugestões do Carrinho"}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  {activeTab === "product" 
                    ? `Gerenciando vínculos para: ${baseProduct?.name}`
                    : "Configure os produtos que serão recomendados globalmente no carrinho."}
                </p>
                
                <div className="flex gap-2 mb-8 bg-muted/20 p-2 rounded-xl border border-border">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-all bg-background shadow-sm"
                  >
                    <option value="">Selecione um produto...</option>
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAdd}
                    disabled={!selectedProductId || saving}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-primary/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {relatedProducts.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Nenhum produto adicionado ainda.</p>
                    </div>
                  ) : (
                    relatedProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded bg-white border border-border" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded border border-border" />
                          )}
                          <span className="text-sm font-medium text-foreground line-clamp-1">{p.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemove(p.id)}
                          disabled={saving}
                          className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
