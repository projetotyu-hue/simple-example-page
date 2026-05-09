import React from 'react';

export default function ShopInfo() {
  return (
    <div className="px-4 py-4 border-b border-gray-50">
      <p className="text-sm font-medium text-gray-700 mb-3">Informações da Loja</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-rose-100 overflow-hidden flex items-center justify-center shrink-0 relative">
          {/* Substitua o src pela URL da imagem da loja quando disponível */}
          <img
            alt="Achadinhos do Momento 123"
            loading="lazy"
            decoding="async"
            className="object-cover"
            src="/placeholder-shop.png"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Achadinhos do Momento 123</p>
          <p className="text-xs text-gray-400">Online • Responde rápido</p>
        </div>
      </div>
      <div className="flex items-center justify-around border border-gray-100 rounded-xl px-4 py-3">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">98%</p>
          <p className="text-[10px] text-gray-400">Avaliação</p>
        </div>
        <div className="w-px h-8 bg-gray-100"></div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">120</p>
          <p className="text-[10px] text-gray-400">Produtos</p>
        </div>
        <div className="w-px h-8 bg-gray-100"></div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">3.2M</p>
          <p className="text-[10px] text-gray-400">Seguidores</p>
        </div>
      </div>
    </div>
  );
}
