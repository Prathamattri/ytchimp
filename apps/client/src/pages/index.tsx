import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import Loader from "@/components/loader";

export default function Home() {
  const user = useRecoilValue(userState);
  return (
    <>
      <main>
        {user.isLoading ? (
          <Loader />
        ) : user.isAuthenticated ? (
          <h4>Welcome {user.userEmail}</h4>
        ) : (
          <h4>Not Autenticated</h4>
        )}
      </main>
    </>
  );
}
