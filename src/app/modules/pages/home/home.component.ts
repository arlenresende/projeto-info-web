import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Dialog } from '@angular/cdk/dialog'
import { SidebarComponent } from '../../../components/sidebar/sidebar.component'
import { CardComponent } from '../../../components/card/card.component'
import { VehicleDetailModalComponent } from '../../../components/vehicle-detail-modal/vehicle-detail-modal.component'
import { VehicleService } from '../../../core/services/vehicle/vehicle.service'
import { LoadingService } from '../../../core/services/loading/loading.service'
import { ToastrService } from 'ngx-toastr'
import { Vehicle, VehiclesResponse } from '../../../core/DTO/vehicle.dto'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private vehicleService = inject(VehicleService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  private dialog = inject(Dialog)

  vehicles: Vehicle[] = []
  currentPage = 1
  totalPages = 1
  isLoading = false

  ngOnInit(): void {
    this.loadVehicles()
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
      maxHeight: '90vh',
      panelClass: 'vehicle-detail-modal',
    })
  }
}
