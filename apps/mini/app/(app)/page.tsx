'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Text, View } from '@my/ui';
import { useEffect } from 'react';

import App from './app';
import { FullPageSpinner } from '../_components/FullPageSpinner';

export default function HomePage() {
  const { context, setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady().then(() => console.log('Mini app loaded'));
    }
  }, [setFrameReady, isFrameReady]);
  console.log('HomePage');

  if (!isFrameReady) {
    return <FullPageSpinner />;
  }

  // Access user data from the `context.user` object
  const fid = context?.user?.fid;
  const username = context?.user?.username;
  const displayName = context?.user?.displayName;
  const pfpUrl = context?.user?.pfpUrl;

  // Access client-specific data from `context.client`
  const clientAdded = context?.client?.added; // Whether the user has added your Mini App

  if (!fid) {
    // User is not authenticated or context is not yet loaded
    return (
      <View>
        <p>Loading user session or please sign in with Farcaster.</p>
        {/* You might display a "Sign In" button here if authentication is not automatic */}
        {/* The signIn function is also available from useMiniKit if you need to trigger it manually */}
        {/* <button onClick={() => signIn()}>Sign In</button> */}
        <Text>Test</Text>
        <Text>FID: {fid}</Text>
        <Text>Username: {username}</Text>
        <Text>Display Name: {displayName}</Text>
        <Text>PFP URL: {pfpUrl}</Text>
        <Text>Client Added: {clientAdded}</Text>
      </View>
    );
  }

  return <App />;
}
