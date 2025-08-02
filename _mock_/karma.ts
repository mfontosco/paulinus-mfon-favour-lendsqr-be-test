

export const isUserBlacklisted = jest.fn((karma_id: string) => {
  if (karma_id === 'blacklisted-user') return Promise.resolve(true);
  return Promise.resolve(false);
});
