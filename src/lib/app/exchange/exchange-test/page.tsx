"use client"

import { useState } from "react"

export default function TestExchange() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Test Exchange Page</h1>
        
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-6"
        >
          {isVisible ? 'Nascondi' : 'Mostra'} Componente
        </button>

        {isVisible && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Exchange Component</h2>
            <p className="text-green-600">Il componente è visibile!</p>
            <div className="mt-4 p-4 bg-gray-200 rounded">
              <p>API Key: a46c5806-341b-46d0-906b-ab5ac5a64663.6375d829-f6f2-465f-aede-ba59bc4bae64</p>
              <p>Status: Connesso a LI.FI</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
