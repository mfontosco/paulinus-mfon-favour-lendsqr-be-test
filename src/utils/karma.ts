import axios from 'axios';

export const isUserBlacklisted = async (karma_id: string): Promise<boolean> => {

  if (process.env.NODE_ENV === 'development' || process.env.MOCK_KARMA === 'true') {
    console.log(`[Mock] Checking karma_id: ${karma_id}`);
    
   
    if (karma_id === 'blacklisted-id-123') return true;
    return false;
  }

  try {
    const { data } = await axios.get(`${process.env.KARMA_API}/${karma_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.KARMA_API_KEY}`,
      },
    });

    return data?.blacklisted || false;
  } catch (err) {
    throw new Error('Unable to verify karma blacklist');
  }
};
