'use client'

import React from 'react'
import { Button } from '@/shared/ui/Button'
import { deletePerson } from '../actions'
import { useRouter } from 'next/navigation'

interface PersonListProps {
  people: Array<{
    id: string
    name: string
  }>
}

export const PersonList: React.FC<PersonListProps> = ({ people }) => {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      await deletePerson(id)
      router.refresh()
    }
  }

  if (people.length === 0) {
    return <p className="text-gray-500">Nenhuma pessoa cadastrada</p>
  }

  return (
    <ul className="space-y-2">
      {people.map((person) => (
        <li key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span>{person.name}</span>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDelete(person.id)}
          >
            Excluir
          </Button>
        </li>
      ))}
    </ul>
  )
}