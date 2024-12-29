export const useAuth = () => {
  const user = {
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    email: localStorage.getItem("userEmail"),
  };

  return { user };
};
