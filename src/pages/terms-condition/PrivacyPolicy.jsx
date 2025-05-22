import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/system';
import { Card, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

const PrivacyPolicy = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Privacy Policy | Return 2 Success</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4">Privacy Policy</Typography>

          <ol style={{ color: '#637381', fontSize: '1.1rem' }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Information Collection and Use:</strong> For a better experience while using
              our Service, we may require you to provide us with certain personally identifiable
              information, including but not limited to your name, phone number, and postal address.
              The information that we collect will be used to contact or identify you.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Log Data: </strong>
              We want to inform you that whenever you visit our Service, we collect information that
              your browser sends to us that is called Log Data. This Log Data may include
              information such as your computer's Internet Protocol ("IP") address, browser version,
              pages of our Service that you visit, the time and date of your visit, the time spent
              on those pages, and other statistics.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Cookies: </strong>
              Cookies are files with small amount of data that is commonly used an anonymous unique
              identifier. These are sent to your browser from the website that you visit and are
              stored on your computer's hard drive. Our website uses these "cookies" to collect
              information and to improve our Service. You have the option to either accept or refuse
              these cookies, and know when a cookie is being sent to your computer. If you choose to
              refuse our cookies, you may not be able to use some portions of our Service.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Service Providers:</strong> We may employ third-party companies and
              individuals due to the following reasons:
              <ul>
                <li>To facilitate our Service;</li>
                <li>To provide the Service on our behalf;</li>
                <li>To perform Service-related services; or</li>
                <li>To assist us in analyzing how our Service is used.</li>
              </ul>
              We want to inform our Service users that these third parties have access to your
              Personal Information. The reason is to perform the tasks assigned to them on our
              behalf. However, they are obligated not to disclose or use the information for any
              other purpose.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Cookies: </strong>
              Cookies are files with small amount of data that is commonly used an anonymous unique
              identifier. These are sent to your browser from the website that you visit and are
              stored on your computer's hard drive. Our website uses these "cookies" to collect
              information and to improve our Service. You have the option to either accept or refuse
              these cookies, and know when a cookie is being sent to your computer. If you choose to
              refuse our cookies, you may not be able to use some portions of our Service.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Security:</strong> We value your trust in providing us your Personal
              Information, thus we are striving to use commercially acceptable means of protecting
              it. However, no method of transmission over the internet or electronic storage is 100%
              secure and reliable. We cannot guarantee absolute security.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Links to Other Sites:</strong> Our Service may contain links to other sites.
              If you click on a third-party link, you will be directed to that site. Note that these
              external sites are not operated by us. We strongly advise you to review the Privacy
              Policy of these websites. We have no control over, and assume no responsibility for
              the content, privacy policies, or practices of any third-party sites or services.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Children's Privacy:</strong> Our Services do not address anyone under the age
              of 13. We do not knowingly collect personal identifiable information from children
              under 13. If we discover that a child under 13 has provided us with personal
              information, we immediately delete it from our servers. If you are a parent or
              guardian and you are aware that your child has provided us with personal information,
              please contact us so that we can take necessary actions.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Changes to This Privacy Policy:</strong> We may update our Privacy Policy from
              time to time. Thus, we advise you to review this page periodically for any changes. We
              will notify you of any changes by posting the new Privacy Policy on this page. These
              changes are effective immediately after they are posted on this page.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Contact Us:</strong> If you have any questions or suggestions about our
              Privacy Policy, do not hesitate to contact us.
            </li>
          </ol>
        </Card>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
