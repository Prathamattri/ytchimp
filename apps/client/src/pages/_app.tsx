import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { useEffect } from "react";
import Loader from "@/components/loader";
import { api } from "@/utils";
import "dotenv/config";

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
    try {
      const res = await api.get(`/user/me`);
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
