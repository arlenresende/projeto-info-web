import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)

  const isLoggedIn = !!sessionStorage.getItem('info-token')

  return isLoggedIn ? true : router.createUrlTree(['/login'])
}
