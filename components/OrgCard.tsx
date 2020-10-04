import Link from 'next/link';
// import Head from 'next/head';
import { Org } from 'interfaces';

/** A React.Element<typeof Component> takes a single type argument, typeof Component
 * typeof Component is the component type of the React element
 * For an intrinsic element, typeof Component will be the string literal for the intrinsic you used. */

// TODO: each card should have a logo, date, name, spot for text
// TODO: how to add the logo??

type Props = {
  data: Org;
};

const OrgCard: React.FunctionComponent<Props> = ({ data }) => (
  <Link href="/admin/[id]" as={`/admin/${data.id}`}>
    <a>
      {data.logo}
      {data.date}
      {data.id}: {data.name}
    </a>
  </Link>
);

export default OrgCard;
