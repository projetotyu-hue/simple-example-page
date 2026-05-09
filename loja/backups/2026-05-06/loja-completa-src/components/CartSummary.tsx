interface CartSummaryProps {
  totalItems: number
  totalPrice: number
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',')
}

export default function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  return (
    <div
      className="sticky bottom-0 z-30 bg-white"
      style={{ borderTop: '1px solid #EEEEEE' }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[14px] text-[#333333]">
            Total ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </p>
        </div>
        <p className="text-[18px] font-bold" style={{ color: '#FF2D55' }}>
          R$ {formatPrice(totalPrice)}
        </p>
      </div>
      <div className="px-4 pb-4">
        <button
          className="w-full text-white font-bold transition-colors hover:opacity-90"
          style={{
            backgroundColor: '#FF2D55',
            borderRadius: '10px',
            height: '48px',
            fontSize: '15px',
          }}
        >
          Finalizar Compra ({totalItems})
        </button>
      </div>
    </div>
  )
}
