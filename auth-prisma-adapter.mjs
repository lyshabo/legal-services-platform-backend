import { getPrisma } from "./prisma-client.mjs";

function cleanUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, field]) => field !== undefined));
}

export async function createPrismaAuthAdapter() {
  const prisma = await getPrisma();

  return {
    async createUser(user) {
      return prisma.user.create({
        data: {
          email: user.email,
          name: user.name ?? null,
          emailVerified: user.emailVerified ?? null,
          image: user.image ?? null,
          role: "PUBLIC_USER"
        }
      });
    },
    async getUser(id) {
      return prisma.user.findUnique({ where: { id } });
    },
    async getUserByEmail(email) {
      return prisma.user.findUnique({ where: { email } });
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true }
      });
      return account?.user ?? null;
    },
    async updateUser(user) {
      return prisma.user.update({
        where: { id: user.id },
        data: cleanUndefined({
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image
        })
      });
    },
    async deleteUser(id) {
      return prisma.user.delete({ where: { id } });
    },
    async linkAccount(account) {
      return prisma.account.create({ data: account });
    },
    async unlinkAccount({ provider, providerAccountId }) {
      return prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } }
      });
    },
    async createSession(session) {
      return prisma.session.create({
        data: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        }
      });
    },
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      });
      return session ? { session, user: session.user } : null;
    },
    async updateSession(session) {
      const existing = await prisma.session.findUnique({
        where: { sessionToken: session.sessionToken }
      });
      if (!existing) return null;
      return prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: cleanUndefined({ expires: session.expires, userId: session.userId })
      });
    },
    async deleteSession(sessionToken) {
      const existing = await prisma.session.findUnique({ where: { sessionToken } });
      if (!existing) return null;
      return prisma.session.delete({ where: { sessionToken } });
    }
  };
}
