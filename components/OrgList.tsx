// TODO: instead of creating another list component, can I use the List.tsx file?

import { OrgApp } from 'interfaces';
import OrgCard from './OrgCard';

type Props = {
  items: OrgApp[];
};

const List: React.FunctionComponent<Props> = ({ items }) => (
  <>
    {items.map((item) => (
      <OrgCard data={item} key={item.id} />
    ))}
  </>
);

export default List;
