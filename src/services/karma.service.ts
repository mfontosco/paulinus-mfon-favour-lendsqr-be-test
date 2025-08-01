import axios from "axios";
import logger from "../utils/logger";

export class KarmaService {
  static async isBlacklisted(email: string): Promise<boolean> {
    try {
      const { data } = await axios.get(`${process.env.KARMA_API_URL}/blacklist`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${process.env.KARMA_API_KEY}`,
        },
      });
      console.log("data--------",data)
      return data?.blacklisted === true;
    } catch (error) {
      logger.error("Karma API error", { error });
      throw new Error("Could not verify blacklist status");
    }
  }
}
