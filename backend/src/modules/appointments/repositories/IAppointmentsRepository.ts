import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateApointmentDTO from '@modules/appointments/dtos/ICreateApointmentDTO';

export default interface IAppointmentsRepository {
	create(data: ICreateApointmentDTO): Promise<Appointment>;
	findByDate(date: Date): Promise<Appointment | undefined>;
}
