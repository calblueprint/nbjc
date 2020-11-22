import { useState, ChangeEvent } from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import { PrismaClient, Organization } from '@prisma/client';
import {
  Tabs,
  Tab,
  Button,
  InputAdornment,
  TextField,
  Drawer,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import styles from 'styles/Moderator.module.css';

type Props = {
  items: Organization[];
};

const prisma = new PrismaClient();

interface appStatus {
  status: string;
}

const ModeratorDashBoard: React.FunctionComponent<Props> = ({ items }) => {
  const [card, setCard] = useState<Organization>(items[0]);
  const clickCard = (newCard: Organization): void => {
    setCard(newCard);
  };

  const [selected, setSelected] = useState<number>(0);
  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const [openLeft, setOpenLeft] = useState<boolean>(false);

  const handleDrawerOpenLeft = (): void => {
    setOpenLeft(true);
  };

  const handleDrawerCloseLeft = (): void => {
    setOpenLeft(false);
  };

  const [openRight, setOpenRight] = useState<boolean>(false);

  const handleDrawerOpenRight = (): void => {
    setOpenRight(true);
  };

  const handleDrawerCloseRight = (): void => {
    setOpenRight(false);
  };

  const handleSubmit = async (status: appStatus): Promise<void> => {
    // Make post request
    if (status.status === 'reject') {
      try {
        await fetch('/api/app/orgs/reject', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: status.status }),
        });
      } catch (ex) {
        console.error('ex:', ex);
      }
    } else {
      try {
        await fetch('/api/app/orgs/approve', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: status.status }),
        });
      } catch (ex) {
        console.error('ex:', ex);
      }
    }
  };

  return (
    <Layout title="Moderator Dashboard">
      <div className={styles.root}>
        <div className={styles.leftCol}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenLeft}
              edge="start"
              className={clsx(styles.menuButton, openLeft && styles.hide)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Toolbar>
          <Drawer
            className={styles.drawer}
            variant="persistent"
            anchor="left"
            open={openLeft}
            classes={{
              paper: styles.drawerPaperLeft,
            }}
          >
            <div className={styles.tabs}>
              <Tabs value={selected} onChange={handleChange}>
                <Tab label="Orgs" />
                <Tab label="Events" />
              </Tabs>
              <IconButton onClick={handleDrawerCloseLeft}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <div className={styles.textField}>
              <TextField
                fullWidth
                id="search"
                type="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </div>
            {selected === 0 && (
              <div className={styles.content}>
                {items &&
                  items.map((item) => (
                    // TODO: Add accessibility support
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                    <div key={item.id} onClick={() => clickCard(item)}>
                      <OrgCard items={item} />
                    </div>
                  ))}
              </div>
            )}
            {selected === 1 &&
              'Event list, mimic the Org mapping on first tab?'}
          </Drawer>
        </div>
        <main
          className={clsx(styles.main, {
            [styles.mainShift]: openLeft,
          })}
        >
          <div className={styles.rightCol}>
            <div className={styles.header}>
              <div>
                <div className={styles.large}>{card && card.name}</div>
                {card.workType && card.organizationType && (
                  <div className={styles.med}>
                    {card.workType} {card.organizationType}
                  </div>
                )}
              </div>
              <div>
                <Button variant="outlined" color="primary">
                  Rejection history
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDrawerOpenRight}
                  className={styles.menuButton}
                >
                  Notepad
                </Button>
              </div>
            </div>
            <Drawer
              className={styles.drawer}
              variant="persistent"
              anchor="right"
              open={openRight}
              classes={{
                paper: styles.drawerPaperRight,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerCloseRight}>
                  <ChevronRightIcon />
                </IconButton>
              </div>
              <div className={styles.textField}>
                notes for {card && card.name}
              </div>
            </Drawer>
            <div className={styles.content}>
              <OrgDetail items={card} />
            </div>
            <form
              onSubmit={(values) => {
                handleSubmit(values);
              }} /* need buttons to submit either approve or reject, not values */
              noValidate
              autoComplete="off"
            >
              <div className={styles.footer}>
                <Button variant="contained" color="secondary" type="submit">
                  Decline
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Accept
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res: Organization[] = await prisma.organization.findMany({
    where: { AND: [{ active: false }, { applicationStatus: 'submitted' }] },
  });
  const items = JSON.parse(JSON.stringify(res)) as Organization[];
  return { props: { items } };
};

export default ModeratorDashBoard;
