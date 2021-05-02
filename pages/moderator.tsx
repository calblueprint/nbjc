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
import CloseIcon from '@material-ui/icons/Close';
import {
  Organization,
  ApplicationNote,
  ApplicationResponse,
  OrganizationApplicationReview,
  Prisma,
} from '@prisma/client';
import Toast from 'components/Toast';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Button,
  InputAdornment,
  TextField,
  Drawer,
  IconButton,
  LinearProgress,
  CircularProgress,
  Typography,
  ClickAwayListener,
} from '@material-ui/core';
import Router, { useRouter } from 'next/router';
import useSession from 'utils/useSession';
import getSession from 'utils/getSession';
import styles from '../styles/Moderator.module.css';

const orgArgs = Prisma.validator<Prisma.OrganizationArgs>()({
  include: {
    applicationNote: true,
    applicationResponses: {
      include: {
        applicationQuestion: {
          select: { question: true },
        },
      },
    },
    organizationApplicationReviews: true,
  },
});

type Props = {
  orgs: Prisma.OrganizationGetPayload<typeof orgArgs>[];
  searchValProp: string;
};

const ModeratorDashBoard: React.FunctionComponent<Props> = ({
  orgs,
  searchValProp,
}) => {
  const router = useRouter();
  const [session, sessionLoading] = useSession();

  const [lastText, setLastText] = useState('');
  const [text, setText] = useState('');
  const [declineText, setDeclineText] = useState('');

  const [index, setIndex] = useState<number>(-1);
  const [processingAction, setProcessingAction] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // MODAL ADDED
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => (): void => {
    setOpenModal(false);
  };

  const [openApprove, setOpenApprove] = useState(false);
  const approveToast = openApprove ? (
    <Toast showDismissButton>Organization successfully accepted.</Toast>
  ) : null;

  const [openDecline, setOpenDecline] = useState(false);
  const declineToast = openDecline ? (
    <Toast showDismissButton>Organization successfully declined.</Toast>
  ) : null;

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
      if (index !== -1) {
        setErrorBanner('Did not save.');
      }
    }
    router.replace(router.asPath);
    setText('');
    setLastText('');
    setOpenNote(false);
    setOpenReview(false);
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
            setOpenApprove(true);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: declineText }),
          });
          if (res.ok) {
            setSuccessBanner(
              `${orgs[index].name} has been successfully rejected.`
            );
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

  // FOR MODAL
  const declineOrg = () => (): void => {
    setOpenModal(false);
    setOpenDecline(true);
    approveApp(false);
  };
  //

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
        <div className={styles.contentApp}>
          {orgs && orgs.length > 0 ? (
            orgs.map((org, i) => (
              // TODO: Add accessibility support
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div key={org.id} onClick={() => clickCard(i)}>
                <OrgCard org={org} orgIndex={i} pageIndex={index} />
              </div>
            ))
          ) : (
            <div className={styles.noOrgs}>No organizations</div>
          )}
        </div>
      );
    }
    if (selected === 1) {
      return <div>Event list, mimic the Org mapping on first tab?</div>;
    }
    return null;
  };

  // Make this look nice
  const makeReview = (r: OrganizationApplicationReview): JSX.Element => {
    const date = new Date(r.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDay();
    const year = date.getFullYear();
    return (
      <>
        <p className={styles.reviewDate}>{`${month} ${day} ${year}`}</p>
        <p className={styles.reviewReason}>{r.reason}</p>
      </>
    );
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
        {openNote ? (
          <div>
            <IconButton onClick={handleDrawerCloseRight}>
              <ChevronRightIcon className={styles.rightIcon} />
            </IconButton>
            <div className={styles.rightCont}>
              <div className={styles.textField}>
                Notes for {orgs[index] && orgs[index].name}
              </div>
              <div className={styles.row}>
                <TextField
                  className={styles.textFieldNotes}
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  placeholder="Type your note here!"
                  name="orgName"
                  variant="outlined"
                  multiline
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <IconButton onClick={handleDrawerCloseRight}>
              <ChevronRightIcon className={styles.rightIcon} />
            </IconButton>
            <div className={styles.rightCont}>
              <div className={styles.textField}>Rejection History</div>
              <div className={styles.row}>
                {orgs[index].organizationApplicationReviews?.map((r) =>
                  // There is not necessarily a reason because sometimes you just want to reject someone and not give them a reason.
                  r.reason ? makeReview(r) : null
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className={styles.content} onClick={handleDrawerCloseRight}>
        {/* </div> onClick={handleDrawerCloseRight}> */}
        <OrgDetail org={app} />
      </div>
      <div className={styles.footer}>
        {errorBanner ? <Toast showDismissButton>{errorBanner}</Toast> : null}
        {successBanner ? (
          <Toast showDismissButton>{successBanner}</Toast>
        ) : null}
        <div className={`${styles.submitButton} ${styles.buttonSpace}`}>
          <Button
            onClick={() => setOpenModal(true)}
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

  const noteExists = orgs.length > 0 && orgs[index]?.applicationNote?.note;

  const [searchVal, setSearchVal] = useState(searchValProp);
  const [demographicFilters, setDemographicFilters] = useState<string[]>([]);
  const [backgroundFilters, setBackgroundFilters] = useState<string[]>([]);
  const [audienceFilters, setAudienceFilters] = useState<string[]>([]);

  const handleDemographicChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setDemographicFilters(event.target.value as string[]);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setBackgroundFilters(event.target.value as string[]);
  };

  const handleAudienceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    setAudienceFilters(event.target.value as string[]);
  };

  const handleSearch = (): void => {
    Router.push({
      pathname: 'moderator',
      query: {
        orgName: searchVal,
        ages: audienceFilters,
        ethnicity: backgroundFilters,
        orientation: demographicFilters,
      },
    });
  };

  if (
    !sessionLoading &&
    session &&
    (session.user.role === 'moderator' || session.user.role === 'admin')
  )
    return (
      <Layout
        title="Moderator Dashboard"
        handleClickSearch={() => handleSearch()}
        searchFilters={searchVal}
        handleSearchChange={(event) => setSearchVal(event.target.value)}
        pageTitle="Moderator Dashboard"
      >
        <div className={styles.entire}>
          {
            // MODAL ADDED
          }
          {approveToast}
          {declineToast}
          <Dialog
            onClose={closeModal()}
            fullWidth
            maxWidth={noteExists ? 'md' : 'sm'}
            open={openModal}
          >
            <DialogTitle>
              <div className={styles.dialogTitle}>
                Reason For Declining
                <IconButton aria-label="close" onClick={closeModal()}>
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className={styles.modContent}>
                {noteExists ? (
                  <div className={styles.modTab}>
                    <div className={styles.declineNotes}>Notes</div>
                    <div className={styles.declineNotesContent}>
                      {orgs[index]?.applicationNote?.note}
                    </div>
                  </div>
                ) : null}
                <div className={styles.declineBox}>
                  <TextField
                    id="outlined-basic"
                    label="Reasons for declining."
                    variant="outlined"
                    multiline
                    size="small"
                    rows={13}
                    onChange={(e) => setDeclineText(e.target.value)}
                    className={styles.declineReason}
                  />
                </div>
              </div>
              <div className={styles.send}>
                <Button
                  variant="outlined"
                  className={styles.editButtonStyles}
                  disableElevation
                  color="primary"
                  onClick={declineOrg()}
                >
                  Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {
            // MODAL ADDED
          }
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
                root: styles.drawerRoot,
              }}
            >
              <div className={styles.tabs}>
                <Typography className={styles.appTitle}>
                  Applications
                </Typography>
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
              {orgs[index] ? (
                orgApp(orgs[index])
              ) : (
                <div className={styles.selectApp}>
                  <div className={styles.selectAppText}>
                    Select an application to start reading!
                  </div>
                </div>
              )}
            </main>
          </div>
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
      const orgs = await prisma.organization.findMany({
        where: { AND: [{ active: false }, { applicationStatus: 'submitted' }] },
        include: orgArgs.include,
      });
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
