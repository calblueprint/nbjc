// TODO: instead of creating another list component, can I use the List.tsx file?

import { OrgApp } from 'interfaces';
import OrgCard from './OrgCard';

type Props = {
  items: OrgApp[];
};

const List: React.FunctionComponent<Props> = ({ items }) => (
  <li>
    {items.map((item) => (
      <OrgCard data={item} />
    ))}
  </li>
);

export default List;
