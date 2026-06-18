const signup = async (req, res) => {
  try {
    console.log("SIGNUP REQUEST BODY:", req.body);

    const {
      name,
      email,
      password,
      role,
      aadhaarNumber,
      licenseNumber,
      vehicleType,
      vehicleCapacity
    } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });

    if (!['buyer','seller','transporter'].includes(role))
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });

    if (await User.findOne({ email }))
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    console.log("USER CREATED:", user);

    res.status(201).json({
      success: true,
      token: sign(user._id),
      user: safeUser(user)
    });

  } catch (e) {
    console.error("SIGNUP ERROR:", e);

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};