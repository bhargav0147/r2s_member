import { Helmet } from 'react-helmet-async';

// import { PostListView } from 'src/sections/blog/view';
import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function PostListPage() {
  return (
    <>
      <Helmet>
        <title> Find business</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
