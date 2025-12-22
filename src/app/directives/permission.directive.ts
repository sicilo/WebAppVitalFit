// import {
//   Directive,
//   Input,
//   OnDestroy,
//   OnInit,
//   TemplateRef,
//   ViewContainerRef,
// } from '@angular/core';
// import { UsuarioService } from '../services/usuario.service';
// import { Subscription } from 'rxjs';

// @Directive({
//   selector: '[hasPermission]',
//   standalone: true,
// })
// export class PermissionDirective implements OnInit, OnDestroy {
//   private permission?: string;
//   private subscription?: Subscription;
//   private loadingSubscription?: Subscription;

//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private permissionService: UsuarioService
//   ) {
//   }

//   @Input() set hasPermission(permission: string) {
//     this.permission = permission;
//     this.updateView();
//   }

//   ngOnInit() {
//     this.subscription = this.permissionService.permissionsChanged$.subscribe(
//       () => {
//         this.updateView();
//       }
//     );

//     this.loadingSubscription = this.permissionService.loadingState$.subscribe(
//       () => {
//         this.updateView();
//       }
//     );

//     this.updateView();
//   }

//   private updateView() {
//     this.viewContainer.clear();

//     if (this.permission) {
//       if (this.permissionService.isLoading()) {
//         return;
//       }

//       if (this.permissionService.hasPermission(this.permission)) {
//         this.viewContainer.createEmbeddedView(this.templateRef);
//       }
//     }
//   }
//   ngOnDestroy() {
//     this.subscription?.unsubscribe();
//     this.loadingSubscription?.unsubscribe();
//   }
// }
