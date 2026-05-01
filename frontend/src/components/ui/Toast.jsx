import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const icons = {
    success: <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />,
    error: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0" />,
  }

  return (
    <div className={`fixed bottom-5 right-5 z-[99999] 
      flex items-center gap-3 px-4 py-3 rounded-xl 
      border shadow-lg text-sm font-medium max-w-sm
      ${styles[type]}`}
      style={{animation: 'slideUp 0.3s ease-out'}}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button 
        type="button"
        onClick={onClose}
        className="flex-shrink-0 opacity-50 hover:opacity-100 
          transition-opacity ml-1">
        <X size={14} />
      </button>
    </div>
  )
}
