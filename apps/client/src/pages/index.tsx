import { useRecoilValue } from "recoil";
import { UserStateType, userState } from "@/store/atoms/user";
import Loader from "@/components/loader";
import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import { BackgroundCanvas } from "@/utils/CanvasBackground";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useRecoilValue(userState);
  return (
    <>
      <section>{user.isLoading ? <Loader /> : <Landing user={user} />}</section>
    </>
  );
}

function Landing({ user }: { user: UserStateType }) {
  const router = useRouter();
  return (
    <main style={{}}>
      <BackgroundCanvas />
      <div className="center-grid-container landing-container ">
        <div className="center-grid-container">
          <div>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                "@media (min-width: 1200px)": {
                  fontSize: "6rem",
                },
              }}
            >
              SIMPLE YOUTUBE MANAGER
            </Typography>
          </div>
          <div>
            <Typography variant="h2" sx={{}}>
              MANAGE YOUR <span className="youtube">YouTube</span> UPLOADS WITH
              US
            </Typography>
          </div>
          {user.isAuthenticated ? (
            <div>
              <button onClick={() => router.push("/user/workspaces")}>
                Workspaces
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => router.push("/user/register")}>
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
