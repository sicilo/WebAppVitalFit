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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerService } from '../../../../services/customer.service';
import { IdentificationTypeService } from '../../../../services/identification-type.service';
import { BloodTypeService } from '../../../../services/blood-type.service';
import { Customer } from '../../../../interfaces/customer.interface';
import { IdentificationType } from '../../../../interfaces/identification-type.interface';
import { BloodType } from '../../../../interfaces/blood-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  private customerService = inject(CustomerService);
  private identificationTypeService = inject(IdentificationTypeService);
  private bloodTypeService = inject(BloodTypeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  customerForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  customerId: string | null = null;
  identificationTypes: IdentificationType[] = [];
  bloodTypes: BloodType[] = [];
  loadingIdentificationTypes = false;
  loadingBloodTypes = false;

  constructor() {
    this.customerForm = this.fb.group({
      identificationTypeId: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(3)]],
      names: ['', [Validators.required, Validators.minLength(2)]],
      surnames: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      email: ['', Validators.email],
      bloodTypeId: [''],
      birthDate: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadIdentificationTypes();
    this.loadBloodTypes();
    
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer(this.customerId);
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

  loadBloodTypes(): void {
    this.loadingBloodTypes = true;
    this.bloodTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingBloodTypes = false;
        if (response.isSuccess) {
          this.bloodTypes = response.value;
        }
      },
      error: (error) => {
        this.loadingBloodTypes = false;
        console.error('Error al cargar tipos de sangre:', error);
      }
    });
  }

  loadCustomer(id: string): void {
    this.isLoading = true;
    this.customerService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          const customer = response.value;
          this.customerForm.patchValue({
            identificationTypeId: customer.identificationTypeId,
            identification: customer.identification,
            names: customer.names,
            surnames: customer.surnames,
            phone: customer.phone,
            email: customer.email,
            bloodTypeId: customer.bloodTypeId,
            birthDate: customer.birthDate ? new Date(customer.birthDate) : null,
            address: customer.address
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el cliente',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
          this.goBack();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar cliente:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo cargar el cliente',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.customerForm.getRawValue();

    if (this.isEditMode && this.customerId) {
      const customerData: Customer = {
        id: this.customerId,
        ...formValue
      };

      this.customerService.update(this.customerId, customerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Cliente actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar cliente',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar cliente',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.customerService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Cliente creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear cliente',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear cliente',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/customers']);
  }
}
