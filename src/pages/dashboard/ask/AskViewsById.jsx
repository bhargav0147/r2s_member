import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { AskHelps } from 'src/sections/ask/view';




const AskHelp = () => {
  

  
   return( <>
      <Helmet>
        <title> Ask </title>
      </Helmet>
      <AskHelps />
    </>
  );
}

export default AskHelp;
