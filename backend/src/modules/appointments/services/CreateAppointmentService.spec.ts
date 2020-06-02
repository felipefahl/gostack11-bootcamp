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
		const date = new Date(2020, 4, 10, 16);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date(2020, 4, 10, 10).getTime();
			return customDate;
		});

		const appointment = await createAppointment.execute({
			date,
			user_id: '58585858',
			provider_id: '4654654654',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('4654654654');
	});

	it('should not be able to create two appointments on the same schedule', async () => {
		const date = new Date(2020, 4, 10, 16);

		jest.spyOn(Date, 'now').mockImplementation(() => {
			const customDate = new Date(2020, 4, 10, 10).getTime();
			return customDate;
		});

		await createAppointment.execute({
			date,
			user_id: '58585858',
			provider_id: '4654654654',
		});
		await expect(
			createAppointment.execute({
				date,
				user_id: '58585858',
				provider_id: '4654654654',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		const date = new Date(2020, 4, 10, 16);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date(2020, 4, 11, 10).getTime();
			return customDate;
		});
		await expect(
			createAppointment.execute({
				date,
				user_id: '58585858',
				provider_id: '4654654654',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with same user and provider', async () => {
		const date = new Date(2020, 4, 10, 16);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date(2020, 4, 10, 10).getTime();
			return customDate;
		});
		await expect(
			createAppointment.execute({
				date,
				user_id: '58585858',
				provider_id: '58585858',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8AM or after 5PM', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date(2020, 4, 10, 10).getTime();
			return customDate;
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				user_id: '58585858',
				provider_id: '4654654654',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 18),
				user_id: '58585858',
				provider_id: '4654654654',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
