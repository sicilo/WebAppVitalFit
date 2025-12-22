// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth.service';

// // import { AuthStatus } from '../interfaces/auth';

// export const hasRoleGuard: CanActivateFn = (route, state) => {
//   const allowedRoles = route.data?.['allowedRoles'];
//   const token = localStorage.getItem('token');
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const role = authService.getRole();

 
//   if (token !== undefined || token !== null) {
//     if (!allowedRoles || allowedRoles.length === 0) {
//       return false;
//     }
//     if (allowedRoles.includes(role)) {
//       return true;
//     }
//   } else {
//     router.navigateByUrl('/');
//   }
//   return false;
// };
