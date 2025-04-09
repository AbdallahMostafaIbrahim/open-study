import type { PrismaClient } from "@prisma/client";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";

export const PrismaAdapter = (db: PrismaClient): Adapter => ({
  async createUser(user: Omit<AdapterUser, "id">) {
    return db.user.create({ data: user }) as Promise<AdapterUser>;
  },
  createSession(session) {
    return db.session.create({ data: session });
  },
  deleteSession(sessionToken) {
    return db.session.delete({ where: { sessionToken } });
  },
  async deleteUser(userId: string) {
    db.user.delete({ where: { id: userId } });
  },
  getUser(id) {
    return db.user.findUnique({ where: { id } }) as Promise<AdapterUser>;
  },
  getUserByEmail(email) {
    return db.user.findUnique({ where: { email } }) as Promise<AdapterUser>;
  },
  updateSession(session) {
    return db.session.update({
      where: { sessionToken: session.sessionToken },
      data: session,
    });
  },
  updateUser(user) {
    return db.user.update({
      where: { id: user.id },
      data: user,
    }) as Promise<AdapterUser>;
  },
  async getSessionAndUser(sessionToken) {
    const session = await db.session.findUnique({
      where: { sessionToken },
    });
    if (!session) return null;
    const user = await db.user.findUnique({
      where: { id: session?.userId },
      include: { admin: true, professor: true, student: true },
    });
    if (!user) return null;

    return {
      session,
      user,
    };
  },
  getUserByAccount(providerAccountId) {
    return db.user.findFirst({
      where: {
        accounts: {
          some: { providerAccountId: providerAccountId.providerAccountId },
        },
      },
    }) as Promise<AdapterUser>;
  },
  linkAccount: (data: AdapterAccount) =>
    db.account.create({ data }) as unknown as AdapterAccount,
  unlinkAccount: (provider_providerAccountId) =>
    db.account.delete({
      where: { provider_providerAccountId },
    }) as unknown as AdapterAccount,
});
