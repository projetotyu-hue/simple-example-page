import type { LucideIcon } from 'lucide-react'

interface ContactCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  content: string
  href?: string
}

export default function ContactCard({ icon: Icon, iconColor, iconBg, title, content, href }: ContactCardProps) {
  const cardContent = (
    <div className="flex items-center px-4 py-4" style={{ padding: '16px' }}>
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: iconBg,
          marginRight: '12px',
        }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-[#333333]">{title}</p>
        <p className="text-[13px] text-[#777777] truncate">{content}</p>
      </div>
    </div>
  )

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EEEEEE',
    borderRadius: '12px',
  }

  if (href) {
    return (
      <a href={href} className="block" style={cardStyle}>
        {cardContent}
      </a>
    )
  }

  return <div style={cardStyle}>{cardContent}</div>
}
