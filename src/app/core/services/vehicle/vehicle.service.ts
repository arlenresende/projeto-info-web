import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../api/api.service'
import { VehiclesResponse } from '../../DTO/vehicle.dto'

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private api = inject(ApiService)

  getVehicles(page: number = 1, limit: number = 10): Observable<VehiclesResponse> {
    return this.api.get(`vehicles?page=${page}&limit=${limit}`)
  }

  getVehicleById(id: string): Observable<any> {
    return this.api.get(`vehicles/${id}`)
  }
}
