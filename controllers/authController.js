const User = require("../models/user");
const { signAccessToken } = require("../middlewares/jwtToken");
const FreelancerDetails = require("../models/freelancerDetails");
const EmployerDetails = require("../models/EmployerDetails");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "suryarathod315@gmail.com",
        pass: "dbrcksiitjnpjdjz",
    },
});

exports.signUp = async (req, res) => {
    try {
        const { firstname, lastname, email, password, startas, agree } =
            req.body;

        if (!firstname || !lastname || !email || !password)
            return res.json({ error: "Please provide Valid Details !!!" });

        if (!startas)
            return res.json({
                error: "Please Select how you want to Start !!!",
            });

        if (password.length < 5 || password.length > 13)
            return res.json({
                error: "Password minimum 6 characters long and maximium 12 characters !!!",
            });

        if (!agree) {
            return res.json({ error: "Please agree terms and conditions" });
        }

        const userEmail = await User.findOne({ email }).lean(); // Finding Email

        if (userEmail) return res.json({ error: "Email already exists !!!" }); // Checking Email Exits or Not

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash,
            startas: startas,
            login: false,
        }); // Creating New User

        await newUser.save(async (error) => {
            if (error) {
                res.json({ error });
            } else {
                if (newUser.startas === "Virtual Assistant") {
                    const freelancer = await FreelancerDetails.create({
                        firstname: firstname,
                        lastname: lastname,
                        displayname: firstname + " " + lastname,
                        email: email,
                        notifications: [
                            {
                                notificationType: "Registration",
                                notificationMessage:
                                    "You have successfully registered with Vame.io",
                                seen: false,
                                timeDate: new Date(),
                            },
                        ],
                    });
                    await freelancer.save();
                }
                if (newUser.startas === "Employer") {
                    const employerDetail = await EmployerDetails.create({
                        firstname: firstname,
                        lastname: lastname,
                        displayname: firstname + " " + lastname,
                        email: email,
                        notifications: [
                            {
                                notificationType: "Registration",
                                notificationMessage:
                                    "You have successfully registered with Vame.io",
                                timeDate: new Date(),
                                seen: false,
                            },
                        ],
                    });
                    await employerDetail.save();
                }

                let mailOptions = {
                    from: "suryarathod315@gmail.com",
                    to: email,
                    subject: "Register Successfully.",
                    html:
                        "<h4> You are successsfully registered on vame.io</h4>" +
                        "<p>Thanks for using Vame.io</p>",
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                res.json({
                    success:
                        "Your Account has created Successfully. Please Sign In !!!",
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "User Signup failed failed." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = await req.body;

        if (!email || !password)
            return res.json({ error: "Please Provide valid details !!!" });

        const user = await User.findOne({ email }).lean(); // Finding Email

        if (!user)
            return res.json({
                error: "Email does not exists. Please Sign Up !!!",
            }); // Checking Email

        const startas = user.startas;
        const login = user.login;
        const id = user._id;

        // const pass = (await password) === user.password; // Comparing
        const pass = await bcrypt.compare(password, user.password);

        if (!pass) return res.json({ error: "Email Id or Password Wrong !!!" }); // Checkinmg password

        const accessToken = await signAccessToken(user);

        res.json({
            success: "Logged in Successfully !!!",
            accessToken,
            startas,
            login,
            id,
        });
        if (user.login === false) {
            await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        login: true,
                    },
                }
            );
        }
    } catch (err) {
        res.status(400).json({ error: "Login failed." });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = req.body;
        const email = user.email;
        const userEmail = await User.find({ email }).lean();
        const id = userEmail[0]._id.toString();

        const text = `${process.env.FRONT_URL}/resetpassword/${id}` + "";

        let mailOptions = {
            from: "suryarathod315@gmail.com",
            to: email,
            subject: "Sending Email using Node.js",
            html:
                "<h4> Please click below link to reset your password. </h4>" +
                text +
                "<br /><br /><p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                res.json({
                    success:
                        "Password reset link has been sent on the registered email.",
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Forgot Password failed." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const user = req.body;
        const hash = await bcrypt.hash(user.newPassword, 10);
        const userEmail = await User.findOneAndUpdate(
            { _id: req.params.id },
            { password: hash }
        );

        if (userEmail) {
            res.json({ success: "Password has been reset successfully." });
        }
    } catch (err) {
        res.status(400).json({ error: "Reset Password failed." });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log(req.body);

        const userDetails = await User.findOne({ email });

        res.json({ userDetails });
    } catch (err) {
        res.status(400).json({ error: "Read Users failed." });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        if (password !== newPassword)
            return res.json({ error: "Password does not Matches" });

        const hash = await bcrypt.hash(password, 10);
        const updatePassword = await User.findOneAndUpdate(
            { _id: req.params.id },
            { password: hash }
        );

        if (updatePassword) {
            res.json({ success: "Password has been Updated" });
        } else {
            res.json({ success: "Password has not been Updated" });
        }
    } catch (err) {
        res.status(400).json({ error: "Update Password failed." });
    }
};
