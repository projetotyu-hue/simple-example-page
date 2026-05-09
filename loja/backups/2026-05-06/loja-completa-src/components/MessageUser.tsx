interface MessageUserProps {
  text: string
}

export default function MessageUser({ text }: MessageUserProps) {
  return (
    <div className="flex justify-end px-4 py-1">
      <div
        className="py-3 px-4 text-white"
        style={{
          backgroundColor: '#FF2D55',
          borderRadius: '16px',
          padding: '12px',
          maxWidth: '85%',
        }}
      >
        <p className="text-[14px] leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
