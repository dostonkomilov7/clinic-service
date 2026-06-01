import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Appointment } from "./model/appointments.model";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update.appointment.dto";
import { User } from "../users/model/user.model";
import { Doctor } from "../doctors/model/doctors.model";
import { AppointmentStatus } from "@/core/constants/constants";
import { Op } from "sequelize";

@Injectable()
export class AppointmentService {
    constructor(@InjectModel(Appointment) private readonly appointmentModel: typeof Appointment) { }

    async getAppointment() {
        const appointments = await this.appointmentModel.findAll()

        return {
            appointments
        }
    }
    async getAppointments(id: string) {
        try {
            const appointments = await this.appointmentModel.findAndCountAll({
                include: [
                    {
                        model: User,
                        where: { id }
                    },
                    {
                        model: Doctor,
                        include: [User]
                    }
                ]
            })

            const totalUpcoming = await this.appointmentModel.count({
                where: {
                    [Op.and]: [
                        { id: id },
                        { status: 'Confirmed' }
                    ]
                }
            });
            const totalPending = await this.appointmentModel.count({
                where: {
                    [Op.and]: [
                        { id: id },
                        { status: 'Pending' }
                    ]
                }
            });
            const totalCompleted = await this.appointmentModel.count({
                where: {
                    [Op.and]: [
                        { id: id },
                        { status: 'Completed' }
                    ]
                }
            });
            const totalCancelled = await this.appointmentModel.count({
                where: {
                    [Op.and]: [
                        { id: id },
                        { status: 'Cancelled' }
                    ]
                }
            });

            return {
                success: true,
                appointments,
                totalUpcoming,
                totalPending,
                totalCompleted,
                totalCancelled,
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createAppointment(dto: CreateAppointmentDto) {
        try {
            await this.appointmentModel.create({
                patient_id: dto.patient_id,
                doctor_id: dto.doctor_id,
                appointment_date: dto.appointment_date,
                appointment_time: dto.appointment_time,
                status: AppointmentStatus.PENDING
            })
            return {
                success: true,
                message: "Successfully created"
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async updateAppointment(id: string) {
        try {
            const existing = await this.appointmentModel.findByPk(id)

            if (!existing) {
                throw new NotFoundException("Appointment is not found")
            }

            if (existing.dataValues.status === 'Pending') {
                await this.appointmentModel.update({ status: AppointmentStatus.CONFIRMED }, { where: { id } })
            } else {
                await this.appointmentModel.update({ status: AppointmentStatus.COMPLETED }, { where: { id } })
            }

            return {
                success: true,
                message: "Appointment has been successfully updated"
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async deleteAppointment(id: string) {
        try {
            const existing = await this.appointmentModel.findByPk(id)

            if (!existing) {
                throw new NotFoundException("Appointment is not found")
            }

            await this.appointmentModel.update({ status: AppointmentStatus.CANCELLED }, { where: { id } })

            return {
                success: true,
                message: "Appointment has been successfully cancelled"
            }

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}