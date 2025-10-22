import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const isAuthEndpoint = req.url.endsWith('login')

  if (isAuthEndpoint) {
    return next(req)
  }

  const token = sessionStorage.getItem('info-token')

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req

  return next(authReq)
}
