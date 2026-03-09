import { PagedResult } from "./api.model";

export interface AppointmentBody {
    id: string;
    roomId: string;
    roomName: string;
    companionId: string;
    companionFullName: string;
    professionalId: string;
    professionalFullName: string;
    patientId: string;
    patientFullName: string;
    appointmentHeaderId: string;
    notes: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentBodyRequest {
    roomId: string;
    professionalId: string;
    patientId: string;
    startDate: string;
    endDate: string;
    companionId: string;
    appointmentHeaderId: string;
    notes: string;
}

export interface UpdateAppointmentBodyRequest {
    id: string;
    roomId: string;
    professionalId: string;
    patientId: string;
    startDate: string;
    endDate: string;
    companionId: string;
    appointmentHeaderId: string;
    notes: string;
}

export interface GetFilteredAppointmentsRequest {
  professionalName?: string;
  patientName?: string;
  professionalIdentification?: string;
  patientIdentification?: string;
  roomName?: string;
}

export interface AppointmentBodyPagedResult extends PagedResult<AppointmentBody> {
}
