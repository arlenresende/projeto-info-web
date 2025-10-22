import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Dialog } from '@angular/cdk/dialog'
import { Subscription } from 'rxjs'
import { SidebarComponent } from '../../../components/sidebar/sidebar.component'
import { CardComponent } from '../../../components/card/card.component'
import { VehicleDetailModalComponent } from '../../../components/vehicle-detail-modal/vehicle-detail-modal.component'
import { AddVehicleModalComponent } from '../../../components/add-vehicle-modal/add-vehicle-modal.component'
import { VehicleService } from '../../../core/services/vehicle/vehicle.service'
import { LoadingService } from '../../../core/services/loading/loading.service'
import { ToastrService } from 'ngx-toastr'
import { VehicleUpdateService } from '../../../core/services/vehicle-update/vehicle-update.service'
import { Vehicle, VehiclesResponse } from '../../../core/DTO/vehicle.dto'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private vehicleService = inject(VehicleService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  private dialog = inject(Dialog)
  private vehicleUpdateService = inject(VehicleUpdateService)
  private vehicleUpdateSubscription?: Subscription

  vehicles: Vehicle[] = []
  currentPage = 1
  totalPages = 1
  isLoading = false
  isSidebarOpen = false

  ngOnInit(): void {
    this.loadVehicles(1)

    // Escuta notificações de atualização de veículos
    this.vehicleUpdateSubscription = this.vehicleUpdateService.vehicleUpdated$.subscribe(() => {
      this.loadVehicles(this.currentPage)
    })
  }

  ngOnDestroy(): void {
    this.vehicleUpdateSubscription?.unsubscribe()
  }

  loadVehicles(page: number = 1): void {
    this.isLoading = true
    this.loadingService.show()

    this.vehicleService.getVehicles(page).subscribe({
      next: (response: VehiclesResponse) => {
        this.vehicles = response.vehicles
        this.currentPage = response.pagination.page
        this.totalPages = response.pagination.totalPages
        this.isLoading = false
        this.loadingService.hide()
      },
      error: (error) => {
        this.isLoading = false
        this.loadingService.hide()
        const errorMessage = error.error?.message || 'Erro ao carregar veículos'
        this.toastr.error(errorMessage, 'Erro')
      },
    })
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadVehicles(page)
    }
  }

  formatYear(year: number): string {
    return year.toString()
  }

  truncateDescription(description: string, maxLength: number = 100): string {
    if (description.length <= maxLength) {
      return description
    }
    return description.substring(0, maxLength) + '...'
  }

  openVehicleDetails(vehicle: Vehicle): void {
    this.dialog.open(VehicleDetailModalComponent, {
      data: vehicle,
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'vehicle-detail-modal',
    })
  }

  openAddVehicleModal(): void {
    const dialogRef = this.dialog.open(AddVehicleModalComponent, {
      width: '1000px',
      maxWidth: '95vw',
      height: '800px',
      maxHeight: '95vh',
      panelClass: 'add-vehicle-modal',
    })

    dialogRef.closed.subscribe(() => {
      this.loadVehicles(this.currentPage)
    })
  }

  openEditVehicleModal(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(AddVehicleModalComponent, {
      width: '1000px',
      maxWidth: '95vw',
      height: '800px',
      maxHeight: '95vh',
      panelClass: 'add-vehicle-modal',
      data: { vehicle },
    })

    dialogRef.closed.subscribe(() => {
      this.loadVehicles(this.currentPage)
    })
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
