import { useState, useEffect, ChangeEvent } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'utils/prisma';

import Layout from 'components/Layout';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import {
  Organization,
  ApplicationNote,
  ApplicationResponse,
  OrganizationApplicationReviews,
} from '@prisma/client';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

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
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import getSession from 'utils/getSession';
import styles from '../styles/Moderator.module.css';

type Props = {
  orgs: (Organization & {
    organizationApplicationReviews: OrganizationApplicationReviews[] | null;
    applicationNote: ApplicationNote | null;
    applicationResponses: (ApplicationResponse & {
      applicationQuestion: { question: string };
    })[];
  })[];
};

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

  const [openNote, setOpenNote] = useState<boolean>(false);
  const [openReview, setOpenReview] = useState<boolean>(false);

  const handleDrawerOpenRight = (
    isNote: boolean,
    note?: ApplicationNote | null
  ): void => {
    if (isNote) {
      setText(note && note.note ? note.note : '');
      setLastText(note && note.note ? note.note : '');
      setOpenNote(true);
    } else {
      setOpenReview(true);
    }
  };

  const handleDrawerCloseRight = async (): Promise<void> => {
    try {
      await fetch(`/api/app/orgs/${orgs[index].id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: text }),
      });
    } catch (ex) {
      setErrorBanner('Did not save.');
    }
    router.replace(router.asPath);
    setText('');
    setLastText('');
    setOpenNote(false);
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
          const res = await fetch(`/api/app/orgs/${orgs[index].id}/approve`, {
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
          const res = await fetch(`/api/app/orgs/${orgs[index].id}/reject`, {
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

        // Add to rejection history
        try {
          const res = await fetch('/api/app/question/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //   review,
            // }),
          });
        } catch (err) {
          setErrorBanner('Failed to add rejection history');
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
          await fetch(`/api/app/orgs/${orgs[index].id}/note`, {
            method: 'POST',
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

  const orgApp = (
    app: Organization & {
      applicationResponses: (ApplicationResponse & {
        applicationQuestion: { question: string };
      })[];
    }
  ): JSX.Element => (
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
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleDrawerOpenRight(false)}
            className={styles.buttonSpace}
          >
            Rejection history
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              handleDrawerOpenRight(true, orgs[index].applicationNote)
            }
            className={styles.buttonSpace}
          >
            Notepad
          </Button>
        </div>
      </div>
      <Drawer
        className={styles.drawer}
        variant="persistent"
        anchor="right"
        open={openNote || openReview}
        classes={{
          paper: styles.drawerPaperRight,
        }}
      >
        {/* HERE CALVIN HERE */}
        {openNote ? (
          <div>
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
          </div>
        ) : (
          <div>
            <div className={styles.textField}>
              reviews for {orgs[index] && orgs[index].name}
            </div>
            <div className={styles.row}>
              <p className={styles.descriptor}>Reviews</p>
              {orgs[index].organizationApplicationReviews?.map((r) => {
                <p>{r.reason}</p>;
              })}
            </div>
          </div>
        )}
      </Drawer>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
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
        <div className={`${styles.submitButton} ${styles.buttonSpace}`}>
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
        <div className={`${styles.submitButton} ${styles.buttonSpace}`}>
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

  if (sessionLoading || !session || session.user.role === 'organization')
    router.push('/');
  if (
    !sessionLoading &&
    session &&
    (session.user.role === 'moderator' || session.user.role === 'admin')
  )
    return (
      <Layout title="Moderator Dashboard">
        <div className={styles.root}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpenLeft}
            edge="start"
            className={clsx(styles.menuButton, openLeft && styles.hide)}
          >
            <ChevronRightIcon />
          </IconButton>
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
              <Typography className={styles.appTitle}>Applications</Typography>
              <IconButton onClick={handleDrawerCloseLeft}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            {tab()}
          </Drawer>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (
      session &&
      (session.user.role === 'moderator' || session.user.role === 'admin')
    ) {
      const res = await prisma.organization.findMany({
        where: { AND: [{ active: false }, { applicationStatus: 'submitted' }] },
        include: {
          applicationNote: true,
          organizationApplicationReviews: true,
          applicationResponses: {
            include: {
              applicationQuestion: {
                select: { question: true },
              },
            },
          },
        },
      });

      const orgs = JSON.parse(JSON.stringify(res)) as (Organization & {
        applicationNote: ApplicationNote | null;
        organizationApplicationReviews: OrganizationApplicationReviews[] | null;
        applicationResponses: (ApplicationResponse & {
          applicationQuestion: { question: string };
        })[];
      })[];
      return { props: { orgs } };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch (err) {
    console.log('error');
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};

export default ModeratorDashBoard;
