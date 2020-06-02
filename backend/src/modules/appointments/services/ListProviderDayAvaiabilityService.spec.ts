import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvaiabilityService from './ListProviderDayAvaiabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvaiability: ListProviderDayAvaiabilityService;
describe('ListProviderDayAvaiability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderDayAvaiability = new ListProviderDayAvaiabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month avaiability from provider', async () => {
		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user_id',
			date: new Date(2020, 4, 20, 12, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user_id',
			date: new Date(2020, 4, 20, 15, 0, 0),
		});

		jest.spyOn(Date, 'now').mockImplementation(() => {
			const customDate = new Date(2020, 4, 20, 11).getTime();
			return customDate;
		});

		const avaiability = await listProviderDayAvaiability.execute({
			provider_id: 'provider_id',
			year: 2020,
			month: 5,
			day: 20,
		});

		expect(avaiability).toEqual(
			expect.arrayContaining([
				{ hour: 8, avaiable: false },
				{ hour: 9, avaiable: false },
				{ hour: 10, avaiable: false },
				{ hour: 11, avaiable: false },
				{ hour: 12, avaiable: false },
				{ hour: 13, avaiable: true },
				{ hour: 14, avaiable: true },
				{ hour: 15, avaiable: false },
			]),
		);
	});
});
