import { useState, useEffect, ChangeEvent } from 'react';
import { GetServerSideProps } from 'next';

import Layout from 'components/Layout';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import { PrismaClient, Organization, ApplicationNote } from '@prisma/client';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// https://stackoverflow.com/questions/54060096/close-persistent-material-ui-drawer-on-clicking-outside
import {
  Tabs,
  Tab,
  Button,
  InputAdornment,
  TextField,
  Drawer,
  Toolbar,
  IconButton,
  CardActions,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import styles from '../styles/Moderator.module.css';

type OrgWithNote = Organization & {
  applicationNote: ApplicationNote | null;
};

/** fix orgdetail props */
type Props = {
  orgs: OrgWithNote[];
};

const prisma = new PrismaClient();

const ModeratorDashBoard: React.FunctionComponent<Props> = ({ orgs }) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();

  const [lastText, setLastText] = useState('');
  const [text, setText] = useState('');

  const [index, setIndex] = useState<number>(0);
  const [processingAction, setProcessingAction] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const [selected, setSelected] = useState<number>(0);
  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const [openLeft, setOpenLeft] = useState<boolean>(true);

  const handleDrawerOpenLeft = (): void => {
    setOpenLeft(true);
  };

  const handleDrawerCloseLeft = (): void => {
    setOpenLeft(false);
  };

  const [openRight, setOpenRight] = useState<boolean>(false);

  const handleDrawerOpenRight = (card: OrgWithNote): void => {
    setText(
      card.applicationNote && card.applicationNote.note
        ? card.applicationNote.note
        : ''
    );
    setLastText(
      card.applicationNote && card.applicationNote.note
        ? card.applicationNote.note
        : ''
    );
    setOpenRight(true);
  };

  const handleDrawerCloseRight = async (): Promise<void> => {
    try {
      await fetch(`/api/app/orgs/note/${orgs[index].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: text }),
      });
    } catch (ex) {
      setErrorBanner('Did not save.');
    }
    router.replace(router.asPath);
    setText('');
    setLastText('');
    setOpenRight(false);
  };

  const clickCard = (newIndex: number): void => {
    handleDrawerCloseRight();
    setIndex(newIndex);
  };

  useEffect(() => {
    setIndex((prevIndex) => {
      if (orgs.length - 1 >= 0) {
        if (prevIndex >= orgs.length) {
          return orgs.length - 1;
        }
        return prevIndex;
      }
      return 0;
    });
  }, [orgs.length]);

  const approveApp = async (approve: boolean): Promise<void> => {
    setProcessingAction(true);
    if (orgs[index]) {
      if (approve) {
        /** put in form of const res so you can say if res === ok then display this banner */
        try {
          const res = await fetch(`/api/app/orgs/approve/${orgs[index].id}`, {
            method: 'POST',
          });
          if (res.ok) {
            setSuccessBanner('Successfully approved.');
            // Refresh data without full page reload
            router.replace(router.asPath);
          } else {
            setErrorBanner('Failed to process approval');
          }
        } catch (err) {
          setErrorBanner('Failed to process approval');
        }
      } else {
        try {
          const res = await fetch(`/api/app/orgs/reject/${orgs[index].id}`, {
            method: 'POST',
          });
          if (res.ok) {
            setSuccessBanner('Successfully rejected.');
            // Refresh data without full page reload
            router.replace(router.asPath);
          } else {
            setErrorBanner('Failed to process rejection');
          }
        } catch (err) {
          setErrorBanner('Failed to process rejection');
        }
      }
    } else {
      setErrorBanner('An organization app must be selected first');
    }
    setProcessingAction(false);
  };

  /** For auto-saving a moderator's notes */
  const AUTOSAVE_INTERVAL = 3000;

  useEffect(() => {
    if (orgs[index]) {
      const updateContent = async (): Promise<void> => {
        try {
          await fetch(`/api/app/orgs/note/${orgs[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: text }),
          });
        } catch (ex) {
          setErrorBanner('Failed to auto-save');
        }
      };
      const timer = setTimeout(() => {
        if (lastText !== text) {
          updateContent();
          setLastText(text);
        }
      }, AUTOSAVE_INTERVAL);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [text, lastText, orgs, index]);
  const tab = (): JSX.Element | null => {
    if (selected === 0) {
      return (
        <div className={styles.content}>
          {orgs && orgs.length > 0 ? (
            orgs.map((org, i) => (
              // TODO: Add accessibility support
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={org.id} onClick={() => clickCard(i)}>
                <OrgCard org={org} />
              </div>
            ))
          ) : (
            <div>No organizations</div>
          )}
        </div>
      );
    }
    if (selected === 1) {
      return <div>Event list, mimic the Org mapping on first tab?</div>;
    }
    return null;
  };

  const orgApp = (app: Organization): JSX.Element => (
    <div className={styles.rightCol}>
      <div className={styles.header}>
        <div>
          <div className={styles.large}>{app.name}</div>
          {app.workType && app.organizationType && (
            <div className={styles.med}>
              {app.workType} {app.organizationType}
            </div>
          )}
        </div>
        <div>
          <Button variant="outlined" color="primary">
            Rejection history
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleDrawerOpenRight(orgs[index])}
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
          notes for {orgs[index] && orgs[index].name}
        </div>
        <div className={styles.row}>
          <p className={styles.descriptor}>Notes</p>
          <TextField
            className={styles.textField}
            onChange={(e) => setText(e.target.value)}
            value={text}
            name="orgName"
            variant="outlined"
            multiline
          />
        </div>
      </Drawer>
      <div className={styles.content} onClick={handleDrawerCloseRight}>
        <OrgDetail org={app} />
      </div>
      <div className={styles.footer}>
        {/* TODO: Replace with toasts */}
        {errorBanner ? (
          <div className={styles.banner}>{errorBanner}</div>
        ) : null}
        {successBanner ? (
          <div className={styles.banner}>{successBanner}</div>
        ) : null}
        <div className={styles.submitButton}>
          <Button
            onClick={() => approveApp(false)}
            variant="outlined"
            color="primary"
            disabled={processingAction}
          >
            Decline
          </Button>
          {processingAction && (
            <CircularProgress size={24} className={styles.submitProgress} />
          )}
        </div>
        <div className={styles.submitButton}>
          <Button
            onClick={() => approveApp(true)}
            variant="contained"
            color="primary"
            disabled={processingAction}
          >
            Approve
          </Button>
          {processingAction && (
            <CircularProgress size={24} className={styles.submitProgress} />
          )}
        </div>
      </div>
    </div>
  );

  if (!sessionLoading && !session) router.push('/');
  if (!sessionLoading && session)
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
              {tab()}
            </Drawer>
          </div>
          <main
            className={clsx(styles.main, {
              [styles.mainShift]: openLeft,
            })}
          >
            {orgs[index] ? orgApp(orgs[index]) : 'No application selected'}
          </main>
        </div>
      </Layout>
    );
  return <LinearProgress />;
};

/** TODO: #insert applicationNote */
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await prisma.organization.findMany({
    where: { AND: [{ active: false }, { applicationStatus: 'submitted' }] },
    include: { applicationNote: true },
  });
  const orgs = JSON.parse(JSON.stringify(res)) as Organization[];
  return { props: { orgs } };
};

export default ModeratorDashBoard;
