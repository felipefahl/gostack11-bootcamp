import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateApointmentDTO from '@modules/appointments/dtos/ICreateApointmentDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		return this.appointments.find(appointment =>
			isEqual(appointment.date, date),
		);
	}

	public async create({
		provider_id,
		date,
	}: ICreateApointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), provider_id, date });

		this.appointments.push(appointment);
		return appointment;
	}
}

export default FakeAppointmentsRepository;
