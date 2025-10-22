import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component'
import { AuthService } from '../../../core/services/auth/auth.service'
import { LoadingService } from '../../../core/services/loading/loading.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [AuthLayoutComponent, ReactiveFormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private loadingService = inject(LoadingService)
  private toastr = inject(ToastrService)
  private router = inject(Router)

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  )

  get isLoading() {
    return this.loadingService.isLoading
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }
    return null
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loadingService.show()

      const { confirmPassword, ...registerData } = this.registerForm.value

      this.authService.signUp(registerData).subscribe({
        next: (response) => {
          this.loadingService.hide()
          const token = response.data?.token || (response as any).token
          if (token) {
            sessionStorage.setItem('info-token', token)
            this.toastr.success('Cadastro realizado com sucesso!', 'Bem-vindo!')
            this.router.navigate(['/home'])
          } else {
            this.toastr.error('Erro: Token não encontrado na resposta', 'Erro no Cadastro')
          }
        },
        error: (error) => {
          this.loadingService.hide()
          const errorMessage = error.error?.message || 'Erro ao fazer cadastro. Tente novamente.'
          this.toastr.error(errorMessage, 'Erro no Cadastro')
        },
      })
    } else {
      this.markFormGroupTouched()
      this.toastr.warning('Por favor, preencha todos os campos corretamente.', 'Atenção')
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key)
      control?.markAsTouched()
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const fieldNames: { [key: string]: string } = {
          name: 'Nome',
          email: 'Email',
          password: 'Senha',
          confirmPassword: 'Confirmação de senha',
        }
        return `${fieldNames[fieldName]} é obrigatório`
      }
      if (field.errors['email']) {
        return 'Email inválido'
      }
      if (field.errors['minlength']) {
        if (fieldName === 'name') {
          return 'Nome deve ter pelo menos 2 caracteres'
        }
        return 'Senha deve ter pelo menos 6 caracteres'
      }
      if (field.errors['passwordMismatch']) {
        return 'As senhas não coincidem'
      }
    }
    return ''
  }
}
