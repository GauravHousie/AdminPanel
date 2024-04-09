import styles from "@/styles/list.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Grid, Typography, TextField, Checkbox } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";
import ConfirmPopup from "@/components/ConfirmPopup";

export default function ViewCourt(props) {
  const court_id = props.id;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [courtData, setCourtData] = useState({});

  useEffect(() => {
    async function fetchCourtData(court_id) {
      console.log("inside function ", court_id);
      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ id: court_id }),
      };
      const courtsresp = await fetch("/api/fetchCourtData", requestOptions);
      const CourtsData = await courtsresp.json();

      console.log("data received is ", CourtsData);
      console.log("updated", CourtsData.data[0]);
      setLoader(false);
      setCourtData(CourtsData?.data[0]);

      return CourtsData?.data[0];
    }

    setLoader(true);
    fetchCourtData(court_id);
  }, []);


  const handleSubmit = async (status) => {

    setLoader(true);
    try {
      const response = await fetch("/api/updateCourtStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_of_court: status,
          courtData: courtData,
        }),
      });

      if (response.ok) {
        alert("Court Status Updated!!");
        window.location.reload();
      } else {
        console.error("Failed to insert data to MondaygoDB");
      }
      setLoader(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const keys = Object.keys(courtData);

  console.log("keys are", keys);

  const [popup, setPopup]= useState(false);
  const [status, setStatus] = useState("");

  function SubmitStatus(status){
    setPopup(true);
    setStatus(status)
  }

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
    <div className={styles.mndiv}>
      {popup && <ConfirmPopup handleSubmit={handleSubmit} popup={popup} setPopup={setPopup} status = {status} />}
      <div
        onClick={() => {
          router.push("/");
        }}
        className={styles.backBut}
      >
        Go Back
      </div>
      <h2>Court Details are:- </h2>
      <div className={styles.coldiv}>
        {keys.length > 0 &&
          keys.map((key) => (
            <div key={key}>
              {key} has Value: {JSON.stringify(courtData[key])}
            </div>
          ))}
      </div>

      {courtData.Status === "Under Review" && (
        <div className={styles.StatusBut}>
          <div onClick={()=>{SubmitStatus("Approved")}} className={styles.approve}>Approve</div>
          <div onClick={()=>{SubmitStatus("Rejected")}} className={styles.reject}>Reject</div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = context.query;
  console.log("session value is", session);
  return { props: { id: session.court_id } };
}
