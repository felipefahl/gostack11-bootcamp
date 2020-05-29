import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeRepository = new FakeAppointmentsRepository();
		createAppointment = new CreateAppointmentService(fakeRepository);
	});

	it('should be able to create a new appointment', async () => {
		const appointment = await createAppointment.execute({
			date: new Date(),
			provider_id: '4654654654',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('4654654654');
	});

	it('should not be able to create two appointments on the same schedule', async () => {
		const date = new Date(2020, 4, 10, 11);

		await createAppointment.execute({
			date,
			provider_id: '4654654654',
		});
		await expect(
			createAppointment.execute({
				date,
				provider_id: '4654654654',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
