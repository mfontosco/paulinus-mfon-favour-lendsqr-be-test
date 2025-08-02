import knex from '../src/db/connection';
import { UserService } from '../src/services/user.services';
import { isUserBlacklisted } from '../src/utils/karma';

jest.mock('../src/utils/karma');

describe('UserService.createUser', () => {
  const testEmail = 'test@example.com';
  const userPayload = {
    first_name: 'Test',
    last_name: 'User',
    email: testEmail,
    karma_id: 'valid-karma-id',
  };

  beforeEach(async () => {
    await knex('wallets').del();
    await knex('users').del();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should create a user and wallet successfully', async () => {
    const result = await UserService.createUser(userPayload);

    expect(result.user).toBeDefined();
    expect(result.wallet).toBeDefined();
    expect(result.user.email).toBe(testEmail);
   expect(result.wallet.balance.toString()).toBe('0');

  });

  it('should throw if user already exists', async () => {
    await UserService.createUser(userPayload);

    await expect(UserService.createUser(userPayload)).rejects.toThrow('User already exists');
  });

  it('should throw if user is blacklisted', async () => {
  (isUserBlacklisted as jest.Mock).mockResolvedValue(true);

  const blacklistedPayload = {
    ...userPayload,
    email: 'blacklisted@example.com',
    karma_id: 'blacklisted-user',
  };

  await expect(UserService.createUser(blacklistedPayload)).rejects.toThrow('User is blacklisted');
});

});
