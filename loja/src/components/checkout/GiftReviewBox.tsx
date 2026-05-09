import type { GiftItem } from '../../types/cart'

interface GiftReviewBoxProps {
  gift: GiftItem
}

export default function GiftReviewBox({ gift }: GiftReviewBoxProps) {
  return (
    <div className="mx-3 my-2 border border-dashed border-amber-300 rounded-xl px-3 py-2.5 bg-amber-50 flex items-center gap-3 shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 border border-amber-100 flex items-center justify-center p-1">
        {gift.image_url ? (
          <img src={gift.image_url} alt={gift.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-2xl">🎁</span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-amber-700 uppercase tracking-tight">🎁 BRINDE EXCLUSIVO!</p>
        <p className="text-[11px] text-amber-600 leading-tight">Comprando hoje, você recebe</p>
        <p className="text-xs font-bold text-amber-700 leading-tight">{gift.name}</p>
      </div>
    </div>
  )
}
