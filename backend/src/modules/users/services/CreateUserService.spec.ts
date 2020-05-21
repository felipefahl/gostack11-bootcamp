import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
	it('should be able to create a new user', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeRepository, fakeHashProvider);

		const user = await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(user).toHaveProperty('id');
		expect(user.email).toBe('email@email.com');
	});

	it('should not be able to create a new user with same email', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeRepository, fakeHashProvider);

		await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(
			createUser.execute({
				name: 'Teste ts',
				email: 'email@email.com',
				password: 'HASdASDHJasAHSDdashewhrh',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
