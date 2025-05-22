import { Helmet } from 'react-helmet-async';
import { WithdrawListView } from 'src/sections/withdraw/view';


// ----------------------------------------------------------------------

export default function WithdrawListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <WithdrawListView />
    </>
  );
}
