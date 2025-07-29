import { config } from '@my/ui';

export type Conf = typeof config;

declare module '@my/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

declare module 'next-auth' {
  interface Session {
    convexToken: string;
    user: {
      id: Id<'users'>;
      fid: number;
      username: string;
      image: string;
      currentWalletAddress: `0x${string}`;
    };
  }
}
