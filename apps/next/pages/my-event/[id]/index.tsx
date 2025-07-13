import { MyEventScreen } from 'app/screens/my-event/my-event-screen';
import Head from 'next/head';

import { NextPageWithLayout } from 'pages/_app';

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>My Event</title>
      </Head>
      <MyEventScreen />
    </>
  );
};

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export default Page;
