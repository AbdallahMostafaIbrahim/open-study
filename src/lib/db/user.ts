import type { PrismaClient } from "@prisma/client";

/**
 * Deletes a user from the database if the user is not associated with any of the roles:
 * professor, student, or admin.
 * This function is useful when deleting a student, who isn't a professor or admin at the same time.
 *
 * @param prisma - An instance of the PrismaClient used to interact with the database.
 * @param id - The unique identifier of the user to be deleted.
 * @throws Will throw an error if the user does not exist or if the deletion fails.
 */
export async function deleteEmptyUser(prisma: PrismaClient, id: string) {
  try {
    await prisma.user.delete({
      where: {
        id,
        professor: {
          isNot: null,
        },
        student: {
          isNot: null,
        },
        admin: {
          isNot: null,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}
