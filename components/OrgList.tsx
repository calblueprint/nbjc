// TODO: instead of creating another list component, how can I use the List.tsx file?

import { Org } from 'interfaces';
import OrgCard from './OrgCard';

type Props = {
  items: Org[];
};

const List: React.FunctionComponent<Props> = ({ items }) => (
  items.map((item) => <OrgCard data={item} />);

export default List;
