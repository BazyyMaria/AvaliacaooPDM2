import { openDB } from 'idb'

export const dbPromise = openDB('humor-db', 1, {
  upgrade(db) {
    db.createObjectStore('humores', { keyPath: 'id', autoIncrement: true })
  }
})

export async function salvarHumor(dado) {
  const db = await dbPromise
  return db.add('humores', dado)
}

export async function listarHumores() {
  const db = await dbPromise
  return db.getAll('humores')
}

export async function removerHumor(id) {
  const db = await dbPromise
  return db.delete('humores', id)
}
