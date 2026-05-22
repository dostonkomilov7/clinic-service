import { IsInt, IsString } from "class-validator";

export class CreateDoctorDto {
    @IsString()
    specialization: string;
    
    @IsString()
    department: string;
    
    @IsString()
    experience: string;

    @IsInt()
    room_number: number;
    
    @IsInt()
    user_id: number
}