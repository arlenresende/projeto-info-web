import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
import { Vehicle } from '../../core/DTO/vehicle.dto'

@Component({
  selector: 'app-vehicle-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-detail-modal.component.html',
  styleUrl: './vehicle-detail-modal.component.css',
})
export class VehicleDetailModalComponent {
  constructor(
    public dialogRef: DialogRef<VehicleDetailModalComponent>,
    @Inject(DIALOG_DATA) public vehicle: Vehicle,
  ) {}

  closeModal(): void {
    this.dialogRef.close()
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
