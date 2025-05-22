import { Helmet } from 'react-helmet-async';

import { PostListHomeView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostListHomePage() {
  return (
    <>
      <Helmet>
        <title> Find Business</title>
      </Helmet>

      <PostListHomeView />
    </>
  );
}
