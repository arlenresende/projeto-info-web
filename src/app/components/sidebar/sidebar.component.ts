import { Component, inject } from '@angular/core'
import { Dialog } from '@angular/cdk/dialog'
import { AddVehicleModalComponent } from '../add-vehicle-modal/add-vehicle-modal.component'
import { VehicleUpdateService } from '../../core/services/vehicle-update/vehicle-update.service'

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private dialog = inject(Dialog)
  private vehicleUpdateService = inject(VehicleUpdateService)

  openAddVehicleModal(): void {
    const dialogRef = this.dialog.open(AddVehicleModalComponent, {
      width: '1000px',
      maxWidth: '95vw',
      height: '800px',
      maxHeight: '95vh',
      panelClass: 'add-vehicle-modal',
      data: {},
    })
  }
}
