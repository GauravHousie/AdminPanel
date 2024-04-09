import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid, Typography, TextField, Checkbox } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";

export default function Home() {
  const [courtArr, setCourtArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        // Fetch data from your API
        const response = await fetch("/api/fetchData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: [],
        });
        if (response.ok) {
          const dataReceived = await response.json();
          const dataReceivedFromApi = dataReceived.data;
          setLoader(false)
          setCourtArr(dataReceivedFromApi);
          console.log("data recieved from api is", dataReceivedFromApi);
        } else {
          console.error("Failed to fetch data from API");
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    // if (user) {
      setLoader(true)
    fetchDataFromApi();
    // } else setLoader(true);
  }, []);

  if (loader) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "30vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress size={100} />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {courtArr.map((court) => (
        <div onClick={()=>{router.push(`viewCourt/${court._id}`)}} className={styles.box}>
          <div>{court.Name}</div>
          <div>{court.Address}</div>
          <div>{court.HostName}</div>
          <div>{court.ContactNumber}</div>
          <div>{court.EmailAddress}</div>
          <div>Status is:- {court.Status}</div>
        </div>
      ))}
    </>
  );
}
