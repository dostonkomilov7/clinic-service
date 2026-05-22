import { IsInt, IsString } from "class-validator";

export class CreateScheduleDto {
    @IsInt()
    work_day: number;

    @IsString()
    start_time: string;
    
    @IsString()
    end_time: string;
}