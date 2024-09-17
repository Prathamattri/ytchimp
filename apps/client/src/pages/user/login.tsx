import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { useRouter } from "next/navigation";
import { userAuthState } from "@/store/selectors/userAuth";
import { api } from "@/utils";
import { alertUser } from "@/store/atoms/alert";
import { v4 as uuidv4 } from "uuid";
import { errorToJSON } from "next/dist/server/render";

export function Copyright(props: any) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://prathamattri.in">
        YTCHIMP
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const router = useRouter();
  const isAuthenticated = useRecoilValue(userAuthState);
  const setUser = useSetRecoilState(userState);
  const setAlert = useSetRecoilState(alertUser);

  if (isAuthenticated) {
    router.push("/");
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password"),
          }),
        },
      );
      const resData = await res.json();
      if (resData.type === "success") {
        setAlert([
          {
            id: uuidv4(),
            message: resData.msg,
            type: resData.type,
            markShown: false,
          },
        ]);
        setUser({
          userEmail: resData.user.email,
          userName: resData.user.name,
          isAuthenticated: true,
          isLoading: false,
        });
        router.push("/");
      } else {
        throw resData;
      }
    } catch (error: any) {
      setUser({
        userEmail: null,
        userName: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (error.msg instanceof Array) {
        let errorMessageArray = error.msg.map((message: string) => ({
          id: uuidv4(),
          message,
          type: error.type,
          markShown: false,
        }))
        setAlert((prevState) => [
          ...prevState,
          ...errorMessageArray
        ])
      } else {
        setAlert((prevState) => [
          ...prevState,
          {
            id: uuidv4(),
            message: error.msg,
            type: error.type,
            markShown: false,
          },
        ]);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: "transparent",
            color: "black",
          }}
        >
          <LockOutlinedIcon fontSize="large" sx={{ color: "#ffffff" }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome Back
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, paddingY: "1rem", fontSize: "1rem" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href={"/user/register"} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
