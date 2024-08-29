import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import Loader from "@/components/loader";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

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
          height: "calc(100% - 5rem)",
          width: "100%",
          padding: { md: " 0 1rem 1rem", xs: " 0 5px 5px" },
          display: "grid",
          gridTemplateAreas: `
              " landerImg . "
              " landerImg heading1 "
              " landerImg heading2 "
              " landerImg . "
            `,
          rowGap: "1rem"
        }}
      >
        <Box
          sx={{
            gridArea: "heading1",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              textAlign: "right",
              maxWidth: "40rem",
              display: "block",
            }}
          >
            WORRIED ABOUT YOUR
            <span style={{ color: "rgb(245 118 118)" }}> YouTube</span> CHANNEL?
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "heading2",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#635f5f",
              textAlign: "right",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Manage your uploads with us
          </Typography>
        </Box>
        <Box
          sx={{
            gridArea: "landerImg",
            aspectRatio: "3/4",
            width: "30rem",
            position: "relative"
          }}
        >
          <Image
            alt="Landing Image"
            fill
            src={"/landing.webp"}
            style={{
              objectFit: "contain"
            }}
          />
        </Box>
      </Box>
    </>
  );
}
