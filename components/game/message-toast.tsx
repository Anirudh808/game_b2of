"use client"

interface MessageToastProps {
  message: string | null
  type?: "info" | "error" | "success"
}

export function MessageToast({ message, type = "info" }: MessageToastProps) {
  if (!message) return null

  const bgColor = {
    info: "bg-blue-500",
    error: "bg-red-500",
    success: "bg-emerald-500",
  }[type]

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        px-6 py-3 rounded-full shadow-lg
        text-white text-xl font-bold
        animate-fade-in-down
        ${bgColor}
      `}
    >
      {message}
    </div>
  )
}
