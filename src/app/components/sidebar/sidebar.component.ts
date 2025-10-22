import { Component, inject, Input } from '@angular/core'
import { Dialog } from '@angular/cdk/dialog'
import { Router } from '@angular/router'
import { AddVehicleModalComponent } from '../add-vehicle-modal/add-vehicle-modal.component'
import { VehicleUpdateService } from '../../core/services/vehicle-update/vehicle-update.service'

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isOpen: boolean = false
  private dialog = inject(Dialog)
  private router = inject(Router)
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

  logout(): void {
    localStorage.clear()
    sessionStorage.clear()
    this.router.navigate(['/'])
  }
}
