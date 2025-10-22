import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../api/api.service'
import { VehiclesResponse, Vehicle } from '../../DTO/vehicle.dto'

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private api = inject(ApiService)

  getVehicles(page: number = 1, limit: number = 10): Observable<VehiclesResponse> {
    return this.api.get(`vehicles?page=${page}&limit=${limit}`)
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.api.get(`vehicles/${id}`)
  }

  createVehicle(vehicleData: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.api.post('vehicles', vehicleData)
  }

  updateVehicle(id: string, vehicleData: Partial<Vehicle>): Observable<Vehicle> {
    return this.api.put(`vehicles/${id}`, vehicleData)
  }

  deleteVehicle(id: string): Observable<void> {
    return this.api.delete(`vehicles/${id}`)
  }
}
