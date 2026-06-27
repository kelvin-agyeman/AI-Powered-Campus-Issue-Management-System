import bcrypt from "bcryptjs";
import crypto from "crypto";

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string | undefined | null,
): Promise<boolean> => {
  if (!hashedPassword) return false;

  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const hashPasswordToken = (passwordToken: string) => {
  return crypto.createHash("sha256").update(passwordToken).digest("hex");
};
