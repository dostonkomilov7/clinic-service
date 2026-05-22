import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateDoctorDto {
    @IsOptional()
    @IsString()
    specialization: string;
    
    @IsOptional()
    @IsString()
    department: string;
    
    @IsOptional()
    @IsString()
    experience: string;
    
    @IsOptional()
    @IsInt()
    room_number: number;
}