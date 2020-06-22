import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { Repository, getRepository, Not } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDto';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = getRepository(User);
	}

	public async findAllProviders({
		except_id,
	}: IFindAllProvidersDTO): Promise<User[]> {
		let users: User[];
		if (except_id) {
			users = await this.ormRepository.find({
				where: { id: Not(except_id) },
			});
		} else {
			users = await this.ormRepository.find();
		}
		return users;
	}

	public async findById(id: string): Promise<User | undefined> {
		const findUser = await this.ormRepository.findOne(id);
		return findUser;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const findUser = await this.ormRepository.findOne({
			where: { email },
		});
		return findUser;
	}

	public async create({
		name,
		email,
		password,
	}: ICreateUserDTO): Promise<User> {
		const user = this.ormRepository.create({ name, email, password });
		await this.ormRepository.save(user);
		return user;
	}

	public async save(user: User): Promise<User> {
		const updatedUser = await this.ormRepository.save(user);
		return updatedUser;
	}
}

export default UsersRepository;
