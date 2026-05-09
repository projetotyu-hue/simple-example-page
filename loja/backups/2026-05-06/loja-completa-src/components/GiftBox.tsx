import type { GiftItem } from '../types/cart'

interface GiftBoxProps {
  gift: GiftItem | null
}

export default function GiftBox({ gift }: GiftBoxProps) {
  if (!gift) return null

  const imageSrc = gift.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkY1RjVFIiByYWRpdXM9IjExMnB4Ii8+Cjwvc3ZnPg=='

  return (
    <div
      className="flex items-center gap-3"
      style={{
        backgroundColor: '#FFF7E6',
        border: '2px dashed #F59E0B',
        borderRadius: '12px',
        padding: '12px',
      }}
    >
      <img
        src={imageSrc}
        alt={gift.name}
        className="shrink-0 object-cover"
        style={{ width: '40px', height: '40px', borderRadius: '8px' }}
      />
      <div className="min-w-0">
        <p className="text-[12px] font-bold" style={{ color: '#333333' }}>
          🎁 BRINDE EXCLUSIVO!
        </p>
        <p className="text-[12px]" style={{ color: '#777777' }}>
          Comprando hoje, você recebe <span className="font-semibold">{gift.name}</span> GRÁTIS!
        </p>
      </div>
    </div>
  )
}
