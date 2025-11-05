import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import useUserApi from "./api/user-api";

const Layout = () => {
  const { getMe, singup } = useUserApi();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    const fetchUser = async () => {
      if (ref === import.meta.env.VITE_CLIENT_URL) {
        await singup().then(() => {
          params.delete("ref");
          navigate(
            {
              pathname: location.pathname,
              search: params.toString(),
            },
            { replace: true }
          );
        });
      } else {
        await getMe();
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/*" element={<AppLayout />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default Layout;
