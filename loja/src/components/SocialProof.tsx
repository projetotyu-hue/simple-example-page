import { useEffect, useState } from "react";
import { useProduct } from '../context/ProductContext'

const nomes = [
  "Fernanda C.", "Carlos M.", "Juliana S.", "Rafael O.", "Amanda L.",
  "Bruno S.", "Mariana P.", "Lucas F.", "Patrícia R.", "Thiago A.",
  "Camila T.", "Diego N.", "Larissa M.", "Gustavo H.", "Beatriz C.",
  "Mateus V.", "Ana Paula S.", "Leonardo D.", "Isabella F.", "Otávio R."
];

const cidades = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza",
  "Brasília", "Curitiba", "Recife", "Goiânia", "Porto Alegre",
  "Manaus", "Belém", "Vitória", "Campinas", "Santos"
];

interface Popup {
  id: number;
  nome: string;
  cidade: string;
  produto: string;
  tempo: string;
  avatar: string;
}

let idCounter = 0;

function gerarPopup(produtos: string[]): Popup {
  idCounter += 1;
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const cidade = cidades[Math.floor(Math.random() * cidades.length)];
  // Usa produto atual ou sorteia da lista real
  const produto = produtos.length > 0
    ? produtos[Math.floor(Math.random() * produtos.length)]
    : "Produto";
  const tempos = ["há 1 minuto", "há 2 minutos", "há 3 minutos", "agora há pouco", "há instantes"];
  const tempo = tempos[Math.floor(Math.random() * tempos.length)];
  const avatarIndex = Math.floor(Math.random() * 20) + 1;
  const avatar = `https://i.pravatar.cc/150?img=${avatarIndex}`;
  return { id: idCounter, nome, cidade, produto, tempo, avatar };
}

export default function SocialProof() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const { currentProductName, allProducts } = useProduct();

  // Lista de nomes de produtos reais
  const produtoNomes = allProducts.map(p => p.name);
  // Se estiver vendo um produto, prioriza ele 50% das vezes
  const produtosParaSorteio = currentProductName
    ? [currentProductName, ...produtoNomes.filter(n => n !== currentProductName)]
    : produtoNomes;

  useEffect(() => {
    const interval = setInterval(() => {
      // Só gera novo se não houver nenhum popup visível
      if (popups.length === 0) {
        const novo = gerarPopup(produtosParaSorteio);
        setPopups([novo]);
        setVisible(new Set([novo.id]));

        setTimeout(() => {
          setVisible(prev => {
            const next = new Set(prev);
            next.delete(novo.id);
            return next;
          });
          setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== novo.id));
          }, 500);
        }, 10000 + Math.random() * 5000);
      }
    }, 20000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, [produtosParaSorteio, popups.length]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none items-center">
      {popups.map(popup => (
        <div
          key={popup.id}
          className={`transition-all duration-500 ${
            visible.has(popup.id)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 max-w-[280px] pointer-events-auto">
            <img
              src={popup.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-800 truncate">
                <span className="font-medium">{popup.nome}</span> em{" "}
                <span className="text-gray-500">{popup.cidade}</span>
              </p>
              <p className="text-[10px] text-gray-400">
                acabou de comprar: {popup.produto} • {popup.tempo}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
