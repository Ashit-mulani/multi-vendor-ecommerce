import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = ({ children }) => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [user]);

  if (checking) {
    return null;
  }

  if (!user) {
    return navigate("/");
  }

  return children;
};

export default Auth;
