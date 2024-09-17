import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { useEffect } from "react";
import { api } from "@/utils";
import "dotenv/config";
import ThemeProviderWrapper from "@/components/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <InitUser />
      <ThemeProviderWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProviderWrapper>
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
