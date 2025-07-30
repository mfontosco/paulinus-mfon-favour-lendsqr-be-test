import axios from 'axios';

export const isUserBlacklisted = async (karma_id: string): Promise<boolean> => {
  try {
    const { data } = await axios.get(`${process.env.KARMA_API}/${karma_id}`);
    return data?.blacklisted || false;
  } catch (err) {
    throw new Error('Unable to verify karma blacklist');
  }
};
