import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class VehicleUpdateService {
  private vehicleUpdatedSubject = new Subject<void>()

  // Observable que outros componentes podem escutar
  vehicleUpdated$ = this.vehicleUpdatedSubject.asObservable()

  // Método para notificar que um veículo foi adicionado/atualizado
  notifyVehicleUpdated(): void {
    this.vehicleUpdatedSubject.next()
  }
}