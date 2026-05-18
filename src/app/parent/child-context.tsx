'use client'

import { createContext, useContext, useState } from 'react'

export interface Child {
  id: string
  name: string
  kelas: string
  umur: string
  avatar: string
  color: string
}

export const CHILDREN: Child[] = [
  { id: 'alia',  name: 'Nur Alia',  kelas: 'Kelas Ceria',   umur: '4 Tahun', avatar: 'A', color: 'bg-pink-500' },
  { id: 'haziq', name: 'Nur Haziq', kelas: 'Kelas Pelangi', umur: '3 Tahun', avatar: 'H', color: 'bg-blue-500' },
]

interface ChildContextType {
  children: Child[]
  activeChild: Child
  setActiveChild: (child: Child) => void
}

const ChildContext = createContext<ChildContextType>({
  children: CHILDREN,
  activeChild: CHILDREN[0],
  setActiveChild: () => {},
})

export function ChildProvider({ children: nodes }: { children: React.ReactNode }) {
  const [activeChild, setActiveChild] = useState<Child>(CHILDREN[0])
  return (
    <ChildContext.Provider value={{ children: CHILDREN, activeChild, setActiveChild }}>
      {nodes}
    </ChildContext.Provider>
  )
}

export const useChild = () => useContext(ChildContext)
