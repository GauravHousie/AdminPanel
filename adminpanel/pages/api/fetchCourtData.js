// pages/api/fetchKeys.js
import { GetCourtFromMongoDB } from "../../services/mongoDBMethod";

export default async function handler(req, res) {
    const ID  = req.body.id;
    
    try {
      const data = await GetCourtFromMongoDB(ID);
  
      if (data && data.length) {
        return res.status(200).json({ success: true, data: data });
      } else {
        return res.status(404).json({ success: false, message: "Data not found for the provided email" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
  }
