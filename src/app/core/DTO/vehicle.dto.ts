export interface Vehicle {
  id: string
  placa: string
  chassi: string
  renavam: string
  modelo: string
  marca: string
  ano: number
  descricao: string
  photo: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface VehiclesResponse {
  vehicles: Vehicle[]
  pagination: Pagination
}
