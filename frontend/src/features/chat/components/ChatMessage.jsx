import { Brain } from 'lucide-react'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'}`}>
        {message.content}
      </div>
    </div>
  )
}
