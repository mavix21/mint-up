import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import Head from 'next/head';
import { NextPageWithLayout } from 'pages/_app';

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Create Event</title>
      </Head>
      <CreateEventScreen />
    </>
  );
};

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export default Page;
