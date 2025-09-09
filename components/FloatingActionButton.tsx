'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/exchange"
        className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
        aria-label="Vai all'Exchange"
      >
        <ArrowRight className="h-6 w-6" />
      </Link>
    </div>
  )
}
