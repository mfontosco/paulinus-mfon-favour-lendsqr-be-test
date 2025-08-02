import knex from '../db/connection';
import logger from '../utils/logger';
import { isUserBlacklisted } from '../utils/karma';
import { CreateUserDTO } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  static async createUser(payload: CreateUserDTO) {
    const trx = await knex.transaction();
    try {
      const { email, karma_id } = payload;

   
      const existingUser = await trx('users').where({ email }).first();
      if (existingUser) {
        logger.warn(`User already exists with email: ${email}`);
        throw new Error('User already exists');
      }

      // Check blacklist
      const blacklisted = await isUserBlacklisted(karma_id);
      if (blacklisted) {
        logger.warn(`Blacklisted user attempted signup: ${karma_id}`);
        throw new Error('User is blacklisted');
      }

      //  Create user
      const userId = uuidv4();
      const userPayload = { id: userId, ...payload };

      await trx('users').insert(userPayload);

      // Create wallet with default balance
      const walletId = uuidv4();
      const walletPayload = {
        id: walletId,
        user_id: userId,
        currency: 'NGN',
        balance: 0.00,
        credit: 0.00,
        debit: 0.00,
        metadata: null,
      };

      await trx('wallets').insert(walletPayload);

      const user = await trx('users').where({ id: userId }).first();
      const wallet = await trx('wallets').where({ user_id: userId }).first();

      await trx.commit();

      logger.info(`User and wallet created for ${user.email}`);
      return {
        user,
        wallet,
      };
    } catch (err) {
      await trx.rollback();
      logger.error(`Error creating user: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
  }
}