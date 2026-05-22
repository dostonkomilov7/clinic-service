import { AppointmentStatus } from "@/core/constants/constants";
import { IsInt, IsString } from "class-validator";

export class CreateAppointmentDto{
    @IsInt()
    patient_id: number;
    
    @IsInt()
    doctor_id: number;
    
    @IsString()
    appointment_date: Date;
    
    @IsString()
    status: AppointmentStatus;

}
