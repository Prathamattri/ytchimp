import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "@/utils";

const Upload = () => {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("vidFile", file, file.name);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${BASE_URL}/workspace/${router.query.ws}/upload`,
        formData,
        config
      );
      console.log(res.data);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <input
          type="file"
          name="vidFile"
          onChange={(e) => {
            const fileList = e.target.files;
            if (!fileList) return;
            setFile(fileList[0]);
          }}
          id="vidFile"
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Upload;
