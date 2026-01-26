import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PersonService } from '../../../../core/services/person.service';
import { IdentificationTypeService } from '../../../../core/services/identification-type.service';
import { GenderService } from '../../../../core/services/gender.service';
import { BloodTypeService } from '../../../../core/services/blood-type.service';
import { JobTitleService } from '../../../../core/services/job-title.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Person } from '../../../../core/models/person.model';
import { IdentificationType } from '../../../../core/models/identification-type.model';
import { Gender } from '../../../../core/models/gender.model';
import { BloodType } from '../../../../core/models/blood-type.model';
import { JobTitle } from '../../../../core/models/job-title.model';

@Component({
  selector: 'app-person-master',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    CheckboxModule,
    TableModule,
    PanelModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule
],
  templateUrl: './person-master.view.html',
})
export class PersonMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly identificationTypeService = inject(IdentificationTypeService);
  private readonly genderService = inject(GenderService);
  private readonly bloodTypeService = inject(BloodTypeService);
  private readonly jobTitleService = inject(JobTitleService);
  private readonly toastService = inject(ToastService);

  protected readonly persons = signal<Person[]>([]);
  protected readonly identificationTypes = signal<IdentificationType[]>([]);
  protected readonly genders = signal<Gender[]>([]);
  protected readonly bloodTypes = signal<BloodType[]>([]);
  protected readonly jobTitles = signal<JobTitle[]>([]);
  protected readonly selectedPerson = signal<Person | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  // Pagination
  protected readonly totalRecords = signal(0);
  protected readonly rows = signal(10);
  protected readonly first = signal(0);
  protected readonly search = signal('');

  protected readonly form = this.fb.nonNullable.group({
    identificationTypeId: ['', Validators.required],
    identification: ['', Validators.required],
    names: ['', Validators.required],
    surnames: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: [null as Date | null, Validators.required],
    address: [''],
    isClient: [false],
    isEmployee: [false],
    genderId: [''],
    bloodTypeId: [''],
    jobTitleId: [''],
  });

  ngOnInit(): void {
    this.loadIdentificationTypes();
    this.loadGenders();
    this.loadBloodTypes();
    this.loadJobTitles();
  }

  private loadPersons(page: number = 1, itemsPerPage: number = 10, search?: string): void {
    this.loadingTable.set(true);
    this.personService.getPaged({ page, itemsPerPage, search }).subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.persons.set(response.value.items);
          this.totalRecords.set(response.value.totalCount);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar las personas');
      },
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;

    this.first.set(first);
    this.rows.set(rows);
    this.loadPersons(page, rows, this.search() || undefined);
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.first.set(0);
    this.loadPersons(1, this.rows(), value || undefined);
  }

  private loadIdentificationTypes(): void {
    this.identificationTypeService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.identificationTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los tipos de identificación');
      },
    });
  }

  private loadGenders(): void {
    this.genderService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.genders.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los géneros');
      },
    });
  }

  private loadBloodTypes(): void {
    this.bloodTypeService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.bloodTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los tipos de sangre');
      },
    });
  }

  private loadJobTitles(): void {
    this.jobTitleService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.jobTitles.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los cargos');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Person>): void {
    const person = selectionEvent.data;

    if (!person || Array.isArray(person)) {
      return;
    }

    this.selectedPerson.set(person);
    this.form.patchValue({
      identificationTypeId: person.identificationTypeId,
      identification: person.identification,
      names: person.names,
      surnames: person.surnames,
      phone: person.phone,
      email: person.email,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      address: person.address ?? '',
      isClient: person.isClient,
      isEmployee: person.isEmployee,
      genderId: person.genderId ?? '',
      bloodTypeId: person.bloodTypeId ?? '',
      jobTitleId: person.jobTitleId ?? '',
    });
  }

  onClear(): void {
    this.selectedPerson.set(null);
    this.form.reset({
      identificationTypeId: '',
      identification: '',
      names: '',
      surnames: '',
      phone: '',
      email: '',
      birthDate: null,
      address: '',
      isClient: false,
      isEmployee: false,
      genderId: '',
      bloodTypeId: '',
      jobTitleId: '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedPerson();

    const birthDateStr = formValue.birthDate
      ? formValue.birthDate.toISOString().split('T')[0]
      : '';

    if (selected) {
      this.personService
        .update({
          id: selected.id,
          identificationTypeId: formValue.identificationTypeId,
          identification: formValue.identification,
          names: formValue.names,
          surnames: formValue.surnames,
          phone: formValue.phone,
          email: formValue.email,
          birthDate: birthDateStr,
          address: formValue.address,
          isClient: formValue.isClient,
          isEmployee: formValue.isEmployee,
          genderId: formValue.isClient ? formValue.genderId || undefined : undefined,
          bloodTypeId: formValue.isClient ? formValue.bloodTypeId || undefined : undefined,
          jobTitleId: formValue.isEmployee ? formValue.jobTitleId || undefined : undefined,
          active: true,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Persona actualizada exitosamente');
              this.reloadCurrentPage();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar la persona');
          },
        });
    } else {
      this.personService
        .create({
          identificationTypeId: formValue.identificationTypeId,
          identification: formValue.identification,
          names: formValue.names,
          surnames: formValue.surnames,
          phone: formValue.phone,
          email: formValue.email,
          birthDate: birthDateStr,
          address: formValue.address,
          isClient: formValue.isClient,
          isEmployee: formValue.isEmployee,
          genderId: formValue.isClient ? formValue.genderId || undefined : undefined,
          bloodTypeId: formValue.isClient ? formValue.bloodTypeId || undefined : undefined,
          jobTitleId: formValue.isEmployee ? formValue.jobTitleId || undefined : undefined,
          active: true,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Persona creada exitosamente');
              this.reloadCurrentPage();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear la persona');
          },
        });
    }
  }

  private reloadCurrentPage(): void {
    const page = Math.floor(this.first() / this.rows()) + 1;
    this.loadPersons(page, this.rows(), this.search() || undefined);
  }

  get isEditMode(): boolean {
    return this.selectedPerson() !== null;
  }

  get isClient(): boolean {
    return this.form.controls.isClient.value;
  }

  get isEmployee(): boolean {
    return this.form.controls.isEmployee.value;
  }
}
