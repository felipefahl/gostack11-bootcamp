"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _User = _interopRequireDefault(require("../entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_User.default);
  }

  async findAllProviders({
    except_id
  }) {
    let users;

    if (except_id) {
      users = await this.ormRepository.find({
        where: {
          id: (0, _typeorm.Not)(except_id)
        }
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  async findById(id) {
    const findUser = await this.ormRepository.findOne(id);
    return findUser;
  }

  async findByEmail(email) {
    const findUser = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return findUser;
  }

  async create({
    name,
    email,
    password
  }) {
    const user = this.ormRepository.create({
      name,
      email,
      password
    });
    await this.ormRepository.save(user);
    return user;
  }

  async save(user) {
    const updatedUser = await this.ormRepository.save(user);
    return updatedUser;
  }

}

var _default = UsersRepository;
exports.default = _default;