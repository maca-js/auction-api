import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  async setString(key: string, value: string, table: string): Promise<void> {
    await this.redisClient.set(`${table}:${key}`, value);
  }

  async deleteKey(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async getKeys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }
}
