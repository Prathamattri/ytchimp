import { userState } from "@/store/atoms/user";
import { userAuthState, userLoadingState } from "@/store/selectors";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Loader from "./loader";
import api from "@/utils";

const Navbar: React.FC = () => {
  const authenticated = useRecoilValue(userAuthState);
  const loading = useRecoilValue(userLoadingState);
  return (
    <Box position="static" sx={{ background: "transparent" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          height: "5rem",
        }}
      >
        <Link href={"/"} style={{ flexGrow: "1" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <YouTubeIcon
              color="error"
              sx={{
                fontSize: "2rem",
                display: { xs: "none", md: "flex" },
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              YTCHIMP
            </Typography>
            <YouTubeIcon
              color="error"
              sx={{
                fontSize: "2rem",
                display: { xs: "flex", md: "none" },
                mr: 1,
              }}
            />
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              YTCHIMP
            </Typography>
          </Box>
        </Link>
        {loading ? (
          <Loader />
        ) : authenticated ? (
          <Workspaces />
        ) : (
          <AuthButtons />
        )}
      </Box>
    </Box>
  );
};

export const AuthButtons: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: "0",
        display: "flex",
        gap: { xs: "0.5rem", md: "1rem" },
      }}
    >
      <Link href={"/user/login"}>
        <Button variant="text">Login</Button>
      </Link>
      <Link href={"/user/register"}>
        <Button variant="contained">Register</Button>
      </Link>
    </Box>
  );
};

const Workspaces: React.FC = () => {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  async function handleLogout() {
    try {
      await api.post(`/user/logout`);
      setUser({
        isAuthenticated: false,
        isLoading: false,
        userEmail: null,
        userName: null,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Box
      sx={{
        flexGrow: "0",
        display: "flex",
        gap: { xs: "0.5rem", md: "1rem" },
      }}
    >
      <Link href={"/user/workspaces"}>
        <Button variant="text">Workspaces</Button>
      </Link>

      <Button
        variant="contained"
        sx={{
          mr: 1,
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Navbar;
