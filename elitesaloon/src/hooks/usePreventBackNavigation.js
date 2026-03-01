import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const usePreventBackNavigation = (redirectPath = "/") => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate(redirectPath, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, redirectPath]);
};

export default usePreventBackNavigation;