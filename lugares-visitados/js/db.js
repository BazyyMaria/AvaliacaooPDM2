import { openDB } from 'idb'

// Banco de dados
export const dbPromise = openDB('lugares-db', 1, {
  upgrade(db) {
    db.createObjectStore('lugares', { keyPath: 'id', autoIncrement: true })
  }
})

// Salvar um lugar
export async function salvarLugar(dado) {
  const db = await dbPromise
  return db.add('lugares', dado)
}

// Listar todos os lugares
export async function listarLugares() {
  const db = await dbPromise
  return db.getAll('lugares')
}

// Remover um lugar pelo id
export async function removerLugar(id) {
  const db = await dbPromise
  return db.delete('lugares', id)
}

// Limpar todos os lugares
export async function limparLugares() {
  const db = await dbPromise
  const tx = db.transaction('lugares', 'readwrite')
  await tx.store.clear()
  return tx.done
}
