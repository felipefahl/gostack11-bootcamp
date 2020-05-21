import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
	it('should be able to authenticate', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeRepository, fakeHashProvider);
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		const user = await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		const response = await authUser.execute({
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should not be able to authenticate with non exitent user', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		expect(
			authUser.execute({
				email: 'email@email.com',
				password: 'HASdASDHJasAHSDdashewhrh',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeRepository, fakeHashProvider);
		const authUser = new AuthenticateUserService(
			fakeRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		expect(
			authUser.execute({
				email: 'email@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
