import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useAuthContext } from 'src/auth/hooks';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  ask: icon('ic_menu_item')
};

// ----------------------------------------------------------------------


export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const data = useMemo(() => {
    // Initial items array
    const items = [
      {
        title: t('Find Bussiness'),
        path: paths.findBusiness,
        icon: ICONS.dashboard,
      },
      {
        title: t('Find Service'),
        path: paths.findService,
        icon: ICONS.label,
      },
      {
        title: t('Find Product'),
        path: paths.findProduct,
        icon: ICONS.product,
      },
      {
        title: t('Ecommerce'),
        path: paths.ecommerce,
        icon: ICONS.ecommerce,
      },
      {
        title: t('Order'),
        path: paths.order,
        icon: ICONS.order,
      },
      {
        title: t('Service'),
        path: paths.service,
        icon: ICONS.order,
      },
      {
        title: t('Withdrawal'),
        path: paths.withdrawl,
        icon: ICONS.invoice,
      },
      {
        title: t('Wallet'),
        path: paths.wallet,
        icon: ICONS.analytics,
      },
      {
        title: t('Membership'),
        path: paths.membership,
        icon: ICONS.user,
      },
      {
        title: t('Promotion'),
        path: paths.promotion,
        icon: ICONS.tour,
      },
      {
        title: t('Ask'),
        path: paths.ask,
        icon: ICONS.tour,
      },
      {
        title: t('My Ask'),
        path: paths.myask,
        icon: ICONS.tour,
      },
    ];

    // Array of menu items to hide
    const itemsToHide = [];

    // Add conditions for hiding menu items
    if (user?.is_sales_person) {
      itemsToHide.push(t('Ecommerce'), t('Order'), t('Service'), t('Withdrawal'), t('Promotion'));
    }

    // Example of other conditions
    // if (user?.some_other_condition) {
    //   itemsToHide.push(t('Find Product'), t('Wallet'));
    // }

    // Filter out items based on the itemsToHide array
    const filteredItems = items.filter(item => !itemsToHide.includes(item.title));

    return [
      {
        subheader: t('Menu'),
        items: filteredItems,
      },
    ];
  }, [t, user]);

  return data;
}
