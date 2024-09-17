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
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { useRouter } from "next/navigation";
import { userAuthState } from "@/store/selectors/userAuth";
import { api } from "@/utils";
import { Copyright } from "./login";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const isAuthenticated = useRecoilValue(userAuthState);

  if (isAuthenticated) {
    router.push("/");
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") == data.get("confirmPassword")) {
      const res = await api.post(`/user/register`, {
        data: {
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        },
      });
      const resData = await res.data;
      if (resData.type === "success") {
        setUser({
          userEmail: resData.user.email,
          userName: resData.user.name,
          isAuthenticated: true,
          isLoading: false,
        });
        router.push("/");
      } else {
        setUser({
          userEmail: null,
          userName: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      alert("Passwords do not match");
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
            color: "white",
          }}
        >
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome To The Platform
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Name"
            name="name"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="text"
            id="confirmPassword"
            autoComplete="current-password"
            // onChange={}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href={"/user/login"} variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
