import { useState, ChangeEvent, useEffect } from 'react';
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

  const [card, setCard] = useState<OrgWithNote | null>(
    orgs && orgs.length > 0 ? orgs[0] : null
  );
  const clickCard = (newCard: OrgWithNote): void => {
    setCard(newCard);
  };

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

  const handleDrawerOpenRight = (): void => {
    setOpenRight(true);
  };

  const handleDrawerCloseRight = (): void => {
    setOpenRight(false);
  };

  const [processingAction, setProcessingAction] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const [open, setOpen] = useState(false);

  const handleClick = (): void => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = (): void => {
    setOpen(false);
  };
  useEffect(() => {
    setCard(orgs && orgs.length > 0 ? orgs[0] : null);
  }, [orgs]);

  const approveApp = async (approve: boolean): Promise<void> => {
    setProcessingAction(true);
    if (card) {
      if (approve) {
        /** put in form of const res so you can say if res === ok then display this banner */
        try {
          const res = await fetch(`/api/app/orgs/approve/${card.id}`, {
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
          const res = await fetch(`/api/app/orgs/reject/${card.id}`, {
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
  const [lastText, setLastText] = useState('');
  const [text, setText] = useState('');
  useEffect(() => {
    if (card) {
      const updateContent = async (): Promise<void> => {
        try {
          await fetch(`/api/app/orgs/note/${card.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });
          console.log('putted');
        } catch (ex) {
          setErrorBanner('Failed to auto-save');
          console.log('did not put');
        }
      };
      const timer = setTimeout(() => {
        if (lastText !== text) {
          updateContent();
          setLastText(text);
          console.log('autosaved');
        }
      }, AUTOSAVE_INTERVAL);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [text, lastText, card]);
  const tab = (): JSX.Element | null => {
    if (selected === 0) {
      return (
        <div className={styles.content}>
          {orgs && orgs.length > 0 ? (
            orgs.map((org) => (
              // TODO: Add accessibility support
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={org.id} onClick={() => clickCard(org)}>
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
            onClick={handleDrawerOpenRight}
            className={styles.menuButton}
          >
            Notepad
          </Button>
        </div>
      </div>
      <ClickAwayListener onClickAway={handleClickAway}>
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
          <div className={styles.textField}>notes for {card && card.name}</div>
          <div className={styles.row}>
            <p className={styles.descriptor}>Notes</p>
            {console.log(card)}
            <TextField
              className={styles.textField}
              onChange={(e) => setText(e.target.value)}
              /** This is buggy becuase you can't assign to a potentially null value
               * Currently, card.applicationNote && prevents the value fr  */
              value={text}
              name="orgName"
              variant="outlined"
              multiline
              /** defaultValue={card && card.applicationNote.note}
               * write a function that checks if it note exists
               */
            />
          </div>
        </Drawer>
      </ClickAwayListener>
      <div className={styles.content}>
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
            {card ? orgApp(card) : 'No application selected'}
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
