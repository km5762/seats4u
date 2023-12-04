export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `token=; HttpOnly; SameSite=None; Secure`,
    },
    // body: JSON.stringify({"msg": "Logged out successfully"}),
  };
};
