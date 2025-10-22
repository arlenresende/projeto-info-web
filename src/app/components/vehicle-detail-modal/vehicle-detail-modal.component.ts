import { Component, Inject, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
import { VehicleService } from '../../core/services/vehicle/vehicle.service'
import { LoadingService } from '../../core/services/loading/loading.service'
import { ToastrService } from 'ngx-toastr'
import { VehicleUpdateService } from '../../core/services/vehicle-update/vehicle-update.service'
import { Vehicle } from '../../core/DTO/vehicle.dto'

@Component({
  selector: 'app-vehicle-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-detail-modal.component.html',
  styleUrl: './vehicle-detail-modal.component.css',
})
export class VehicleDetailModalComponent {
  private vehicleService = inject(VehicleService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  private vehicleUpdateService = inject(VehicleUpdateService)

  constructor(
    public dialogRef: DialogRef<VehicleDetailModalComponent>,
    @Inject(DIALOG_DATA) public vehicle: Vehicle,
  ) {}

  closeModal(): void {
    this.dialogRef.close()
  }

  removeVehicle(): void {
    if (
      confirm(
        `Tem certeza que deseja remover o veículo ${this.vehicle.modelo} ${this.vehicle.marca}?`,
      )
    ) {
      this.loadingService.show()

      this.vehicleService.deleteVehicle(this.vehicle.id).subscribe({
        next: () => {
          this.loadingService.hide()
          this.toastr.success('Veículo removido com sucesso!')
          this.vehicleUpdateService.notifyVehicleUpdated()
          this.dialogRef.close()
        },
        error: (error) => {
          this.loadingService.hide()
          this.toastr.error('Erro ao remover veículo. Tente novamente.')
          console.error('Erro ao remover veículo:', error)
        },
      })
    }
  }

  formatYear(year: number): string {
    return year ? year.toString() : 'N/A'
  }

  truncateDescription(description: string, maxLength: number = 150): string {
    if (!description) return 'Sem descrição disponível'
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description
  }
}
