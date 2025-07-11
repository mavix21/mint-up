import { MyEventsScreen } from 'app/features/events/my-events-screen';
import Head from 'next/head';
import { NextPageWithLayout } from 'pages/_app';

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>My Events</title>
      </Head>
      <MyEventsScreen />
    </>
  );
};

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export default Page;
