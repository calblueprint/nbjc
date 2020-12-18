/* eslint-disable no-console */
import {
  AgeDemographic,
  ApplicationStatus,
  LgbtqDemographic,
  OrganizationType,
  PrismaClient,
  RaceDemographic,
  User,
  UserCreateArgs,
  UserRole,
  WorkType,
} from '@prisma/client';
import Faker from 'faker';
import Ora from 'ora';
import hashPassword from '../utils/hashPassword';

const NUMBER_USERS = 10;
const NUMBER_ORGS = {
  rejected: 1,
  approved: 2,
  submitted: 3,
  draft: 2,
};

if (
  Object.values(NUMBER_ORGS).reduce((acc, curr) => acc + curr) > NUMBER_USERS
) {
  console.log(
    'Number of organizations specified greater than number of org users'
  );
  process.exit(1);
}

export default async function seedDatabase(): Promise<void> {
  const prisma = new PrismaClient();

  const orgStatus = Object.entries(NUMBER_ORGS).reduce<
    [ApplicationStatus, boolean][]
  >((acc, [status, num]) => {
    return [...acc, ...Array(num).fill([status, status === 'approved'])];
  }, []);

  const clearAllMessage = Ora('Cleaning up previous seeded information');
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: '@nbjc.dev',
        },
      },
    });

    await prisma.organization.deleteMany({
      where: {
        userId: {
          in: users.map((user: User) => user.id),
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@nbjc.dev',
        },
      },
    });

    clearAllMessage.text = 'Cleaned up previous seeded information';
    clearAllMessage.succeed();
  } catch (err) {
    clearAllMessage.fail(
      `Could not clean up previous seeded information\n\n${err.message}`
    );
    await prisma.$disconnect();
    process.exit(1);
  }

  const adminCreateMessage = Ora(`Creating admin user`).start();
  try {
    await prisma.user.create({
      data: {
        email: 'admin@nbjc.dev',
        hashedPassword: hashPassword('password'),
        role: 'admin',
      },
    });
    adminCreateMessage.text = 'Created the admin user.';
    adminCreateMessage.succeed();
  } catch (err) {
    adminCreateMessage.fail(`Creating the admin user failed\n\n${err.message}`);
  }

  const orgUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockOrgUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `org${index}@nbjc.dev`,
          hashedPassword: hashPassword('password'),
          role: UserRole.organization,
          organization: orgStatus[index]
            ? {
                create: {
                  applicationStatus: orgStatus[index][0],
                  active: orgStatus[index][1],
                  name: Faker.company.companyName(),
                  lat: parseFloat(Faker.address.latitude()),
                  long: parseFloat(Faker.address.longitude()),
                  address: Faker.address.streetAddress(true),
                  contactName: Faker.name.findName(),
                  contactEmail: Faker.internet.email(),
                  contactPhone: Faker.phone.phoneNumber('(!##) !##-####'),
                  missionStatement: Faker.lorem.lines(10),
                  shortHistory: Faker.lorem.lines(10),
                  is501c3: Faker.random.boolean(),
                  website: Faker.internet.url(),
                  organizationType: Faker.random.objectElement<
                    OrganizationType
                  >(OrganizationType),
                  workType: Faker.random.objectElement<WorkType>(WorkType),
                  lgbtqDemographic: Faker.random.arrayElements<
                    LgbtqDemographic
                  >(Object.values(LgbtqDemographic)),
                  raceDemographic: Faker.random.arrayElements<RaceDemographic>(
                    Object.values(RaceDemographic)
                  ),
                  ageDemographic: Faker.random.arrayElements<AgeDemographic>(
                    Object.values(AgeDemographic)
                  ),
                },
              }
            : undefined,
        },
      };
    });
  try {
    await Promise.all(mockOrgUsers.map(prisma.user.create));
    orgUsersCreateMessage.text = 'Created 10 org users.';
    orgUsersCreateMessage.succeed();
  } catch (err) {
    orgUsersCreateMessage.fail(`Creating org users failed\n\n${err.message}`);
  }

  const modUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockModUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `mod${index}@nbjc.dev`,
          hashedPassword: hashPassword('password'),
          role: UserRole.moderator,
        },
      };
    });
  try {
    await Promise.all(mockModUsers.map(prisma.user.create));
    modUsersCreateMessage.text = 'Created 10 mod users.';
    modUsersCreateMessage.succeed();
  } catch (err) {
    modUsersCreateMessage.fail(`Creating mod users failed\n\n${err.message}`);
  }

  await prisma.$disconnect();
  process.exit(0);
}

seedDatabase();