import Contect from "../model/contect.model.js"; 

/*export const contectControler = async (req, res) => {
    try {
        const { fullname, email, message } = req.body;

        const existingUser = await Contect.findOne({ email });
        if (!name || !email || !message) {
            return res.status(400).json({ message: "User already exists" });
        }

        const createdUser = new Contect({
            fullname,
            email,
            message,
        });

        await createdUser.save();

        res.status(201).json({
            message: "Contect created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            },
        });

    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};*/
export const contectControler = async (req, res) => {
    try {
      const { fullname, email, message } = req.body;
      
      if (!fullname || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Optionally save to DB here
      const createdContect = new Contect({
        fullname,
        email,
        message,
    });

    await createdContect.save();
  
      return res.status(200).json({ message: "Contact submitted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
