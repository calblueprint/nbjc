import { useState, ChangeEvent, cloneElement } from 'react';
import { GetStaticProps } from 'next';
import { OrgApp } from 'interfaces';
import Layout from 'components/Layout';
import {
  Tabs,
  Tab,
  AppBar,
  Button,
  Toolbar,
  useScrollTrigger,
  Container,
  Typography,
  Paper,
  Box,
  Card,
} from '@material-ui/core';
import clsx from 'clsx';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import OrgCard from 'components/moderator/OrgCard';
import OrgDetail from 'components/moderator/OrgDetail';
import { sampleOrgAppData } from 'utils/sample-data';
import styles from '../styles/Moderator.module.css';

type Props = {
  items: OrgApp[];
};

const drawerWidth = 340;
const test = 100;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      zIndex: 50,
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

const ModeratorDashBoard: React.FunctionComponent<Props> = ({ items }) => {
  const classes = useStyles();

  const [card, setCard] = useState<OrgApp>(items[0]);
  const clickCard = (newCard: OrgApp): void => {
    setCard(newCard);
  };

  const [selected, setSelected] = useState<number>(0);
  const handleChange = (
    _event: ChangeEvent<unknown>,
    newValue: number
  ): void => {
    setSelected(newValue);
  };

  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Layout title="Moderator Dashboard">
      <h1>Moderator Dash</h1>
      <Card className={classes.root}>
        <CssBaseline />
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
        </Toolbar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <div>
            <AppBar position="static" color="default" className={styles.appBar}>
              <Tabs value={selected} onChange={handleChange}>
                <Tab label="Orgs" />
                <Tab label="Events" />
              </Tabs>
            </AppBar>
            {selected === 0 && (
              <div>
                {items.map((item) => (
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
          </div>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <div>
            <div className="stick">Header</div>
            <OrgDetail items={card} />
          </div>
        </main>
      </Card>
      <div className={styles.root}>
        <div className={styles.leftCol}>here</div>
        <div className={styles.rightCol}>
          <div className={styles.acceptDecline}>
            <Button variant="contained" color="primary">
              Accept
            </Button>
            <Button variant="contained" color="secondary">
              Decline
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const items: OrgApp[] = sampleOrgAppData;
  return { props: { items } };
};

export default ModeratorDashBoard;
