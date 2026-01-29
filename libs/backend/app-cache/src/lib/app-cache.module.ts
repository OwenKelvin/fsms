import { Global, Module } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

const generateRedisURIFromEnv = () => {
  const host = process.env['TAHINIWA_REDIS_HOST'] || 'localhost';
  const port = process.env['TAHINIWA_REDIS_PORT'] || '6379';
  const password = process.env['TAHINIWA_REDIS_PASSWORD'] || '';
  return password
    ? `redis://:${password}@${host}:${port}`
    : `redis://${host}:${port}`;
};

@Global() // Makes the KeyvRedis provider available globally
@Module({
  providers: [
    {
      provide: 'KEYV_REDIS', // You can name this anything
      useFactory: () => {
        return new Keyv({
          store: new KeyvRedis(generateRedisURIFromEnv()), // Configure Redis URL as needed
        });
      },
    },
  ],
  exports: ['KEYV_REDIS'],
})
export class KeyvRedisModule {}
