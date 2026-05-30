import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Appointment } from "./model/appointments.model";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
    imports: [SequelizeModule.forFeature([Appointment])],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})

export class AppointmentModule {}