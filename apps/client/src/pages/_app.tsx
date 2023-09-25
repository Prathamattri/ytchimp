import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { BASE_URL } from "@/utils";
import axios from "axios";
import { useEffect } from "react";
import { userLoadingState } from "@/store/selectors";
import Loader from "@/components/loader";
// import cookieCutter from "cookie-cutter";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <InitUser />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}

function InitUser() {
  const setUser = useSetRecoilState(userState);
  const init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({
        isAuthenticated: false,
        userEmail: null,
        userName: null,
        isLoading: false,
      });
      return <></>;
    }
    try {
      const res = await axios.get(`${BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.data;
      if (resData.user.email) {
        setUser({
          isAuthenticated: true,
          userEmail: resData.user.email,
          userName: resData.user.name,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      setUser({
        isAuthenticated: false,
        userEmail: null,
        userName: null,
        isLoading: false,
      });
    }
  };
  useEffect(() => {
    init();
  }, []);
  return <></>;
}
