import { ManageEventScreen } from 'app/screens/manage-event/manage-event-screen';
import Head from 'next/head';
import { NextPageWithLayout } from 'pages/_app';

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Manage Event</title>
      </Head>
      <ManageEventScreen />
    </>
  );
};

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export default Page;
