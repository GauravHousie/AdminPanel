import {
  UpdateCourtStatusOnMongoDB,
  HandleLiveCourtInsertOnMongoDB,
} from "../../services/mongoDBMethod";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const courtData = req.body.courtData;
    const status_of_court = req.body.status_of_court;

    console.log("status received is", status_of_court)
    if (status_of_court === "Approved") {
      // Calculate the length of the array based on the number of available courts
      const courtsAvailable = parseInt(courtData.Courts_Available, 10);
      const bookedSlots = [];

      // Initialize bookedSlots with empty arrays for each court
      for (let i = 0; i < courtsAvailable; i++) {
        bookedSlots.push({ [`court${i + 1}`]: [] });
      }

      // Add the bookedSlots array to courtData before inserting/updating in MongoDB
      courtData.Booked_Slots = bookedSlots;
    }

    console.log("courtData received is", courtData);

    try {
      await UpdateCourtStatusOnMongoDB(status_of_court, courtData._id);

      if (status_of_court === "Approved") {
        courtData.Status = status_of_court;
        await HandleLiveCourtInsertOnMongoDB(courtData);
      }
      return res
        .status(200)
        .json({ success: true, message: "Data saved to MongoDB" });
    } catch (error) {
      console.error("Error saving data to MongoDB:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to save data to MongoDB" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
