import { Helmet } from 'react-helmet-async';
import { AskHelpView } from 'src/sections/ask/view';




const AskHelpself = ({isself}) => (
  <>
    <Helmet>
      <title> Ask </title>
    </Helmet>
    <AskHelpView isself={isself}/>
  </>
);

export default AskHelpself;
