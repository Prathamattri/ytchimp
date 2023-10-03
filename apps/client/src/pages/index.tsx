import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import Loader from "@/components/loader";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { AuthButtons } from "@/components/navbar";

export default function Home() {
  const user = useRecoilValue(userState);
  return (
    <>
      <section>
        {user.isLoading ? (
          <Loader />
        ) : user.isAuthenticated ? (
          <h4>Welcome {user.userEmail}</h4>
        ) : (
          <Landing />
        )}
      </section>
    </>
  );
}

function Landing() {
  return (
    <>
      <Box
        sx={{
          // display: "flex",
          height: "calc(100% - 5rem)",
          width: "100%",
          padding: { md: " 0 1rem 1rem", xs: " 0 5px 5px" },
          justifyContent: "space-around",
        }}
      >
        <Typography
          variant="h2"
          fontWeight={"bold"}
          textAlign={"right"}
          maxWidth={"40rem"}
          sx={{
            position: "absolute",
            right: "1rem",
          }}
        >
          WORRIED ABOUT YOUR{" "}
          <span style={{ color: "rgb(245 118 118)" }}>YouTube</span> CHANNEL?
        </Typography>
        <Box
          sx={{
            position: "absolute",
            top: "55%",
          }}
        >
          <Typography
            variant="h5"
            color={"#635f5f"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            textAlign={"left"}
          >
            Manage your uploads with us
          </Typography>
          {/* <AuthButtons /> */}
        </Box>
        {/* <Box
          sx={{
            display: { xs: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component={"img"}
            alt="Landing Image"
            src={"/landing.webp"}
            sx={{
              height: { xs: "50%", sm: "80%", md: "100%" },
              position: "relative",
              right: 0,
            }}
          />
        </Box> */}
      </Box>
    </>
  );
}
