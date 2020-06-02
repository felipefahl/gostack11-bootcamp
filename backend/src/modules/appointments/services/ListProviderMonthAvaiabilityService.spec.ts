import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvaiabilityService from './ListProviderMonthAvaiabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvaiability: ListProviderMonthAvaiabilityService;
describe('ListProviderMonthAvaiability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvaiability = new ListProviderMonthAvaiabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month avaiability from provider', async () => {
		const hourStart = 8;

		const promises = Array.from({ length: 10 }, (_, index) => {
			const hour = index + hourStart;
			return fakeAppointmentsRepository.create({
				provider_id: 'provider_id',
				user_id: 'user_id',
				date: new Date(2020, 4, 20, hour, 0, 0),
			});
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			user_id: 'user_id',
			date: new Date(2020, 4, 21, 8, 0, 0),
		});

		await Promise.all(promises);

		const avaiability = await listProviderMonthAvaiability.execute({
			provider_id: 'provider_id',
			year: 2020,
			month: 5,
		});

		expect(avaiability).toEqual(
			expect.arrayContaining([
				{ day: 19, avaiable: true },
				{ day: 20, avaiable: false },
				{ day: 21, avaiable: true },
				{ day: 22, avaiable: true },
			]),
		);
	});
});
