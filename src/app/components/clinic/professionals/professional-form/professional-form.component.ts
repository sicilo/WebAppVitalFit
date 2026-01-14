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
import { ProfessionalService } from '../../../../services/professional.service';
import { IdentificationTypeService } from '../../../../services/identification-type.service';
import { Professional } from '../../../../interfaces/professional.interface';
import { IdentificationType } from '../../../../interfaces/identification-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-professional-form',
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
  templateUrl: './professional-form.component.html',
  styleUrl: './professional-form.component.scss'
})
export class ProfessionalFormComponent implements OnInit {
  private professionalService = inject(ProfessionalService);
  private identificationTypeService = inject(IdentificationTypeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  professionalForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  professionalId: string | null = null;
  identificationTypes: IdentificationType[] = [];
  loadingIdentificationTypes = false;

  constructor() {
    this.professionalForm = this.fb.group({
      identificationTypeId: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(3)]],
      names: ['', [Validators.required, Validators.minLength(2)]],
      surnames: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      email: ['', Validators.email]
    });
  }

  ngOnInit(): void {
    this.loadIdentificationTypes();
    
    this.professionalId = this.route.snapshot.paramMap.get('id');
    if (this.professionalId) {
      this.isEditMode = true;
      this.loadProfessional(this.professionalId);
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

  loadProfessional(id: string): void {
    this.isLoading = true;
    this.professionalService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          const professional = response.value;
          this.professionalForm.patchValue({
            identificationTypeId: professional.identificationTypeId,
            identification: professional.identification,
            names: professional.names,
            surnames: professional.surnames,
            phone: professional.phone,
            email: professional.email
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el profesional',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
          this.goBack();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar profesional:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo cargar el profesional',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.professionalForm.getRawValue();

    if (this.isEditMode && this.professionalId) {
      const professionalData: Professional = {
        id: this.professionalId,
        ...formValue
      };

      this.professionalService.update(this.professionalId, professionalData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Profesional actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar profesional',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar profesional',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.professionalService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Profesional creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear profesional',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear profesional',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/professionals']);
  }
}
