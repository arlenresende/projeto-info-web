import { Component, inject, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
import { VehicleService } from '../../core/services/vehicle/vehicle.service'
import { LoadingService } from '../../core/services/loading/loading.service'
import { ToastrService } from 'ngx-toastr'
import { Vehicle } from '../../core/DTO/vehicle.dto'

@Component({
  selector: 'app-add-vehicle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle-modal.component.html',
  styleUrl: './add-vehicle-modal.component.css',
})
export class AddVehicleModalComponent {
  private fb = inject(FormBuilder)
  private vehicleService = inject(VehicleService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  public dialogRef = inject(DialogRef<any>)

  vehicleForm: FormGroup
  isEditMode: boolean = false
  vehicleId: string | null = null

  constructor(@Inject(DIALOG_DATA) public data: { vehicle?: Vehicle } = {}) {
    this.vehicleForm = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-?[0-9]{4}$/)]],
      chassi: ['', [Validators.minLength(17), Validators.maxLength(17)]],
      renavam: ['', [Validators.pattern(/^[0-9]{11}$/)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)],
      ],
      descricao: ['', [Validators.maxLength(500)]],
      photo: [''],
    })

    if (this.data.vehicle) {
      this.isEditMode = true
      this.vehicleId = this.data.vehicle.id
      this.populateForm(this.data.vehicle)
    }
  }

  closeModal(): void {
    this.dialogRef.close()
  }

  get photoUrl(): string {
    return this.vehicleForm.get('photo')?.value || ''
  }

  clearPhoto(): void {
    this.vehicleForm.patchValue({ photo: '' })
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      this.loadingService.show()

      const formData = this.vehicleForm.value

      if (this.isEditMode && this.vehicleId) {
        this.vehicleService.updateVehicle(this.vehicleId, formData).subscribe({
          next: (updatedVehicle) => {
            this.loadingService.hide()
            this.toastr.success('Veículo atualizado com sucesso!')
            this.dialogRef.close()
          },
          error: (error) => {
            this.loadingService.hide()
            this.toastr.error('Erro ao atualizar veículo. Tente novamente.')
            console.error('Erro ao atualizar veículo:', error)
          },
        })
      } else {
        this.vehicleService.createVehicle(formData).subscribe({
          next: (newVehicle) => {
            this.loadingService.hide()
            this.toastr.success('Veículo adicionado com sucesso!')
            this.dialogRef.close()
          },
          error: (error) => {
            this.loadingService.hide()
            this.toastr.error('Erro ao adicionar veículo. Tente novamente.')
            console.error('Erro ao criar veículo:', error)
          },
        })
      }
    } else {
      this.markFormGroupTouched()
      this.toastr.error('Por favor, preencha todos os campos obrigatórios corretamente.')
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vehicleForm.controls).forEach((key) => {
      const control = this.vehicleForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.vehicleForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`
      if (field.errors['pattern']) {
        if (fieldName === 'placa') return 'Formato da placa deve ser ABC-1234'
        if (fieldName === 'renavam') return 'Renavam deve ter 11 dígitos'
      }
      if (field.errors['minlength'])
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${
          field.errors['minlength'].requiredLength
        } caracteres`
      if (field.errors['maxlength'])
        return `${this.getFieldLabel(fieldName)} deve ter no máximo ${
          field.errors['maxlength'].requiredLength
        } caracteres`
      if (field.errors['min']) return `Ano deve ser maior que ${field.errors['min'].min}`
      if (field.errors['max']) return `Ano deve ser menor que ${field.errors['max'].max}`
      if (field.errors['pattern'] && fieldName === 'photo')
        return 'URL da foto deve ser um link válido (jpg, jpeg, png, gif, webp)'
    }
    return ''
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      placa: 'Placa',
      chassi: 'Chassi',
      renavam: 'Renavam',
      modelo: 'Modelo',
      marca: 'Marca',
      ano: 'Ano',
      descricao: 'Descrição',
      photo: 'Foto',
    }
    return labels[fieldName] || fieldName
  }

  private populateForm(vehicle: Vehicle): void {
    this.vehicleForm.patchValue({
      placa: vehicle.placa,
      chassi: vehicle.chassi,
      renavam: vehicle.renavam,
      modelo: vehicle.modelo,
      marca: vehicle.marca,
      ano: vehicle.ano,
      descricao: vehicle.descricao,
      photo: vehicle.photo || '',
    })
  }
}
