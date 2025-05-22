import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/system';
import { Card, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

const TermsCondition = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Term & Condition | Return 2 Success</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4">Terms & Condition</Typography>

          <Typography variant="h5" mt={4}>
            Membership
          </Typography>
          <ol style={{ color: '#637381', fontSize: '1.1rem' }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Voluntary Membership:</strong> Joining the club is a personal decision, and
              the membership fee is non-refundable.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Camaraderie:</strong> Members must maintain a friendly and brotherly
              relationship with each other.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Discounts in Business Transactions:</strong> Members are required to offer
              discounts to fellow members. Discounts for non-members referred by a member are
              optional.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Product Quality and Ethics:</strong> All products and services offered by
              members must be of high quality. Deceptive practices will result in the club taking
              appropriate actions after investigation.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Sponsorship and Marketing:</strong> Members wishing to sponsor the club must
              pay the stipulated fee. This allows them to market their posts throughout India on the
              club's high-ranking platform.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Sales Commission:</strong> A 2% commission on sales over ₹1,000 must be paid
              to the club if sold through its platform.
            </li>
          </ol>

          <Typography variant="h5" mt={4}>
            Legal and Financial Terms
          </Typography>
          <ol style={{ color: '#637381', fontSize: '1.1rem' }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Legal Officer Role:</strong> Members can become a legal officer by paying the
              designated fee, allowing them to create unlimited master levels and request
              withdrawals within the same month.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Earnings and Levels:</strong> Members can create up to 10 master levels per
              month, with any additional being counted in the following month. This also applies to
              earning requests.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Compliance with Laws:</strong> All members and the club must adhere to
              government regulations.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Unethical Conduct:</strong> Members engaging in unethical behavior towards the
              club will have their membership revoked.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Changes in Fees and Rules:</strong> Membership fees, referral earnings, and
              rules are subject to change as necessary. The club reserves all rights to make these
              changes.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Membership Fee:</strong> The fee is ₹1,000 plus GST.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Earnings Structure:</strong> Members earn ₹500 for each master level and ₹100
              for the remaining four levels.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Withdrawal of Earnings:</strong> Members may withdraw additional funds at a
              0.5% rate per month after referring 50 members to their team.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Adjustment of Withdrawn Funds:</strong> Withdrawn funds will be adjusted
              against the next year's earnings.
            </li>
          </ol>

          <Typography variant="h5" mt={4}>
            Renewal and Limitations
          </Typography>

          <ol style={{ color: '#637381', fontSize: '1.1rem' }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Membership Renewal:</strong> Members must renew their membership every 12
              months. Failure to do so results in the transfer of their team to their upline, and
              termination of their membership.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Membership Limit per PAN Card:</strong> Each member is limited to one ID per
              PAN card, and earnings are capped for teams up to 12,000 members.
            </li>

            <li style={{ marginBottom: 10 }}>
              <strong>Acceptance of Changes:</strong> Members must accept any changes made to the
              club's rules.
            </li>
          </ol>

          <p style={{ marginBottom: 10 }}>
            By applying for membership, I acknowledge that I have read, understood, and agree to
            abide by all the terms and conditions of the Return to Success Club. I commit to always
            acting in the best interest of the club.
          </p>
        </Card>
      </Container>
    </>
  );
};

export default TermsCondition;
