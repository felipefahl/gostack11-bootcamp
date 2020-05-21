import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
	it('should be able to update user avatar', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeStorage = new FakeStorageProvider();
		const updateUserAvatar = new UpdateUserAvatarService(
			fakeRepository,
			fakeStorage,
		);

		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpg',
		});

		expect(user.avatar).toEqual('avatar.jpg');
	});

	it('should be able to update user avatar that already have an avatar - deleting the old one', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeStorage = new FakeStorageProvider();

		const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeRepository,
			fakeStorage,
		);

		const user = await fakeRepository.create({
			name: 'Teste ts',
			email: 'email@email.com',
			password: 'HASdASDHJasAHSDdashewhrh',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar2.jpg',
		});

		expect(user.avatar).toEqual('avatar2.jpg');
		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
	});

	it('should not be able to update user avatar with inexisting id', async () => {
		const fakeRepository = new FakeUsersRepository();
		const fakeStorage = new FakeStorageProvider();
		const updateUserAvatar = new UpdateUserAvatarService(
			fakeRepository,
			fakeStorage,
		);
		expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFileName: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
