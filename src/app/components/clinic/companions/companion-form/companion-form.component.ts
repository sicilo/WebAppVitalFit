import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CompanionService } from '../../../../services/companion.service';
import { IdentificationTypeService } from '../../../../services/identification-type.service';
import { Companion } from '../../../../interfaces/companion.interface';
import { IdentificationType } from '../../../../interfaces/identification-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './companion-form.component.html',
  styleUrl: './companion-form.component.scss'
})
export class CompanionFormComponent implements OnInit {
  private companionService = inject(CompanionService);
  private identificationTypeService = inject(IdentificationTypeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  companionForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  companionId: string | null = null;
  identificationTypes: IdentificationType[] = [];
  loadingIdentificationTypes = false;

  constructor() {
    this.companionForm = this.fb.group({
      identificationTypeId: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(3)]],
      names: ['', [Validators.required, Validators.minLength(2)]],
      surnames: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      email: ['', Validators.email],
      relationship: ['']
    });
  }

  ngOnInit(): void {
    this.loadIdentificationTypes();
    
    this.companionId = this.route.snapshot.paramMap.get('id');
    if (this.companionId) {
      this.isEditMode = true;
      this.loadCompanion(this.companionId);
    }
  }

  loadIdentificationTypes(): void {
    this.loadingIdentificationTypes = true;
    this.identificationTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingIdentificationTypes = false;
        if (response.isSuccess) {
          this.identificationTypes = response.value;
        }
      },
      error: (error) => {
        this.loadingIdentificationTypes = false;
        console.error('Error al cargar tipos de identificación:', error);
      }
    });
  }

  loadCompanion(id: string): void {
    this.isLoading = true;
    this.companionService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          const companion = response.value;
          this.companionForm.patchValue({
            identificationTypeId: companion.identificationTypeId,
            identification: companion.identification,
            names: companion.names,
            surnames: companion.surnames,
            phone: companion.phone,
            email: companion.email,
            relationship: companion.relationship
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el acompañante',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
          this.goBack();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar acompañante:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo cargar el acompañante',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.companionForm.invalid) {
      this.companionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.companionForm.getRawValue();

    if (this.isEditMode && this.companionId) {
      const companionData: Companion = {
        id: this.companionId,
        ...formValue
      };

      this.companionService.update(this.companionId, companionData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Acompañante actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar acompañante',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar acompañante',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.companionService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Acompañante creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear acompañante',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear acompañante',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/companions']);
  }
}
