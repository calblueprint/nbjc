import { FunctionComponent, useState } from 'react';
import Layout from 'components/Layout';
import styles from 'styles/users/SettingsEdit.module.css';
import { Button, Link } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SettingsSave from 'components/user/save';
import SettingsEdit from '../../components/user/edit';
import SampleUser from './sample';

const UserProfSettings: FunctionComponent<{ initial?: string }> = ({
  initial = 'edit',
}) => {
  const [setting, setSetting] = useState(initial);
  const hiddenPassword: string = '*'.repeat(SampleUser.Password.length);
  function editing(): React.ReactElement {
    if (setting === 'edit') {
      return (
        <div className={styles.box}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div>{SampleUser.ProfileType} Profile</div>
              <div className={styles.edit}>
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  startIcon={<CreateIcon />}
                  onClick={() => setSetting('save')}
                >
                  Edit
                </Button>
              </div>
            </div>
            <div className={styles.settings}>Settings</div>
          </div>

          <SettingsEdit
            userType={SampleUser.ProfileType}
            email={SampleUser.Email}
            password={hiddenPassword}
          />

          <div className={styles.delete}>
            <Link>Delete User Account</Link>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.box}>
        <div className={styles.top}>
          <div className={styles.title}>{SampleUser.ProfileType} Profile</div>
          <div className={styles.settings}>User Account Settings</div>
        </div>
        <SettingsSave
          userType={SampleUser.ProfileType}
          email={SampleUser.Email}
          password={SampleUser.Password}
        />
        <div className={styles.delete}>
          <div>
            <Link>Delete User Account</Link>
          </div>
          <div>
            <Button
              onClick={() => setSetting('edit')}
              variant="contained"
              color="primary"
              disableElevation
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout title="User Profile Settings">
      <div className={styles.content}>{editing()}</div>
    </Layout>
  );
};

export default UserProfSettings;
