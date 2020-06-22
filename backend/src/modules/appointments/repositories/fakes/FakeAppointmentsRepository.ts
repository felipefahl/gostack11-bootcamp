import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateApointmentDTO from '@modules/appointments/dtos/ICreateApointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findAllInMonthFromProvider({
		provider_id,
		month,
		year,
	}: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
		return this.appointments.filter(
			appointment =>
				appointment.provider_id === provider_id &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year,
		);
	}

	public async findAllInDayFromProvider({
		provider_id,
		month,
		year,
		day,
	}: IFindAllInDayProviderDTO): Promise<Appointment[]> {
		return this.appointments.filter(
			appointment =>
				appointment.provider_id === provider_id &&
				getDate(appointment.date) === day &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year,
		);
	}

	public async findByDate(
		date: Date,
		provider_id: string,
	): Promise<Appointment | undefined> {
		return this.appointments.find(
			appointment =>
				isEqual(appointment.date, date) &&
				appointment.provider_id === provider_id,
		);
	}

	public async create({
		provider_id,
		user_id,
		date,
	}: ICreateApointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), provider_id, user_id, date });

		this.appointments.push(appointment);
		return appointment;
	}
}

export default FakeAppointmentsRepository;
