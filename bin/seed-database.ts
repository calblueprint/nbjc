/* eslint-disable no-console */
import {
  Prisma,
  AgeDemographic,
  ApplicationStatus,
  LgbtqDemographic,
  OrganizationType,
  PrismaClient,
  RaceDemographic,
  User,
  UserRole,
  WorkType,
  // OrganizationApplicationReviews,
} from '@prisma/client';
import Faker, { lorem } from 'faker';
import Ora from 'ora';
import hashPassword from '../utils/hashPassword';

const NUMBER_USERS = 10;
const NUMBER_ORGS = {
  rejected: 1,
  approved: 2,
  submitted: 3,
  draft: 2,
};
const SAMPLE_QUESTIONS = [
  {
    question: 'Why does your organization want to join this platform?',
    required: true,
  },
  {
    question: 'How can your organization benefit from joining this platform?',
    required: true,
  },
  {
    question: 'Have you heard of Blueprint?',
    required: false,
  },
];

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

  const clearAllMessage = Ora(
    'Cleaning up previous seeded information'
  ).start();
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: '@nbjc.dev',
        },
      },
    });

    await prisma.applicationResponse.deleteMany({
      where: {
        organization: {
          userId: {
            in: users.map((user: User) => user.id),
          },
        },
      },
    });

    await prisma.applicationNote.deleteMany({
      where: {
        organization: {
          userId: {
            in: users.map((user: User) => user.id),
          },
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

    await prisma.applicationQuestion.deleteMany({
      where: {
        question: {
          in: SAMPLE_QUESTIONS.map((q) => q.question),
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

  const appQuestionsCreateMessage = Ora(
    `Creating custom application questions`
  ).start();
  const mockAppQuestions: Prisma.ApplicationQuestionCreateArgs[] = SAMPLE_QUESTIONS.map(
    (q) => ({
      data: q,
    })
  );
  try {
    await Promise.all(mockAppQuestions.map(prisma.applicationQuestion.create));
    appQuestionsCreateMessage.text = `Created ${SAMPLE_QUESTIONS.length} custom application questions.`;
    appQuestionsCreateMessage.succeed();
  } catch (err) {
    appQuestionsCreateMessage.fail(
      `Creating custom application questions failed\n\n${err.message}`
    );
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

  const appQuestions = await prisma.applicationQuestion.findMany();

  const orgUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockOrgUsers: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
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
                  // organizationApplicationReviews: new Array(
                  //   Faker.random.number(3)
                  // )
                  //   .fill(null)
                  //   .map((i) => ({
                  //     reason: Faker.lorem.lines(10),
                  //   })),
                  applicationResponses: {
                    create: appQuestions.map((q) => ({
                      answer: Faker.lorem.lines(10),
                      applicationQuestion: { connect: { id: q.id } },
                    })),
                  },
                },
              }
            : undefined,
        },
      };
    });

  // Creating seeding data for demos
  const demoOrg: Prisma.UserCreateArgs = {
    data: {
      email: `demo@nbjc.dev`,
      hashedPassword: hashPassword('password'),
      role: UserRole.organization,
      organization: {
        create: {
          applicationStatus: 'approved',
          active: true,
          name: 'Blueprint',
          lat: 40,
          long: 40,
          address: '1234 Fake Street, Berkeley CA, 94709',
          contactName: 'Frederick Chen',
          contactPhone: '(123) 456-7890',
          contactEmail: 'blue@print.com',
          missionStatement: Faker.lorem.lines(10),
          shortHistory: Faker.lorem.lines(10),
          is501c3: true,
          website: 'https://www.nbjc.org',
          organizationType: 'national',
          workType: 'advocacy',
          lgbtqDemographic: [
            'asexualAromantic',
            'lesbianSgl',
            'straightHeterosexual',
          ],
          raceDemographic: ['arab', 'black', 'native'],
          ageDemographic: ['adult', 'child'],
          organizationProjects: {
            create: [
              {
                title: 'Our First Project!',
                description:
                  'This is a description of what our first project is.',
              },
              {
                title: 'Our First Resource!',
                description:
                  'This is a descriptoin of what our first resource is.',
              },
            ],
          },
          applicationResponses: {
            create: [
              {
                answer: 'Response 1',
                applicationQuestion: { connect: { id: appQuestions[0].id } },
              },
              {
                answer: 'Response 2',
                applicationQuestion: { connect: { id: appQuestions[1].id } },
              },
              {
                answer: 'Response 3',
                applicationQuestion: { connect: { id: appQuestions[2].id } },
              },
            ],
          },
        },
      },
    },
  };

  try {
    await Promise.all(mockOrgUsers.map(prisma.user.create));
    await prisma.user.create(demoOrg);
    orgUsersCreateMessage.text = `Created ${NUMBER_USERS} org users and created demo org.`;
    orgUsersCreateMessage.succeed();
  } catch (err) {
    orgUsersCreateMessage.fail(`Creating org users failed\n\n${err.message}`);
  }

  const modUsersCreateMessage = Ora(
    `Creating ${NUMBER_USERS} org users`
  ).start();
  const mockModUsers: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
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
    modUsersCreateMessage.text = `Created ${NUMBER_USERS} mod users.`;
    modUsersCreateMessage.succeed();
  } catch (err) {
    modUsersCreateMessage.fail(`Creating mod users failed\n\n${err.message}`);
  }

  await prisma.$disconnect();
  process.exit(0);
}

seedDatabase();
