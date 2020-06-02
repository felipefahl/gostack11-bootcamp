import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersServices';

let fakeRepository: FakeUsersRepository;
let listProvider: ListProvidersService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeRepository = new FakeUsersRepository();
		listProvider = new ListProvidersService(fakeRepository);
	});

	it('should be able to list providers', async () => {
		const provider1 = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const provider2 = await fakeRepository.create({
			name: 'Teste ts2',
			email: 'email2@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const user = await fakeRepository.create({
			name: 'Teste ts3',
			email: 'email3@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const providers = await listProvider.execute({
			user_id: user.id,
		});

		expect(providers).toEqual([provider1, provider2]);
	});
});
