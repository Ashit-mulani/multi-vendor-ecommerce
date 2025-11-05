const parseEnvTime = (timeStr) => {
  if (!timeStr) return 7 * 24 * 60 * 60 * 1000; // default 7d
  const value = parseInt(timeStr);
  if (timeStr.endsWith("d")) return value * 24 * 60 * 60 * 1000;
  if (timeStr.endsWith("h")) return value * 60 * 60 * 1000;
  if (timeStr.endsWith("m")) return value * 60 * 1000;
  return value * 1000;
};

export const cookieOption = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: parseEnvTime(process.env.TOKEN_EXPIRY),
  };
};
