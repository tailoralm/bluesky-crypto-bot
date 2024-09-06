import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

export const myCache = new CacheContainer(new MemoryStorage());

export interface ITimePost {
    btc: number;
    eth: number;
    sol: number;
}