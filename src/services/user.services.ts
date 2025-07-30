import knex from '../db/connection';
import logger from '../utils/logger';
import { isUserBlacklisted } from '../utils/karma';
import { CreateUserDTO } from '../interfaces/user.interface';

export class UserService {
  static async createUser(payload: CreateUserDTO) {
    const trx = await knex.transaction();
    try {
      const { karma_id } = payload;
      logger.info(`Checking blacklist for karma_id: ${karma_id}`);

      const blacklisted = await isUserBlacklisted(karma_id);
      if (blacklisted) {
        logger.warn(`Blacklisted user attempted signup: ${karma_id}`);
        throw new Error('User is blacklisted');
      }

      const [user] = await trx('users').insert(payload).returning('*');
      await trx.commit();
      logger.info(`User created with ID ${user.id}`);
      return user;
    } catch (err) {
      await trx.rollback();
      logger.error(`Error creating user: ${err||{}}`);
      throw err;
    }
  }
}
