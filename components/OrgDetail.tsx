import { Org } from 'interfaces';

type OrgDetailProps = {
  item: Org;
};

const OrgDetail: React.FunctionComponent<OrgDetailProps> = ({ item: org }) => (
  <div>
    <h1>Detail for {org.name}</h1>
    <p>ID: {org.id}</p>
  </div>
);

export default OrgDetail;
