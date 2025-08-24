import { AuthKitProvider as AuthKitProviderBase } from '@farcaster/auth-kit';

const config = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  siweUri: process.env.NEXTAUTH_URL,
  domain: process.env.NEXTAUTH_URL,
};

export function AuthKitProvider({ children }: { children: React.ReactNode }) {
  return <AuthKitProviderBase config={config}>{children}</AuthKitProviderBase>;
}
