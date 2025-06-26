import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from "../utils/auth.js";
import UserModel from "../models/usermodel.js";

const router = express.Router();

router.post("/register", async (req, res) => {

    try {
        const { username, role, password, firstname, lastname, phoneNo, module } = req.body;

        const data = {
            username,
            role,
            firstname,
            lastname,
            phoneNo,
            module,
            password: await bcrypt.hash(password, 10),
        };

        const user = await UserModel.create(data);

        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(user, null, 2));
            console.log(token);
            //send users details
            return res.status(201).json({ status: 'success', user });
        } else {
            return res.status(409).send("Details are not correct");
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await UserModel.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
                return res.status(201).json({ status: 'success', accessToken: token, user });
            } else {
                return res.status(401).send("Authentication failed");
            }
        } else {
            return res.status(401).send("Authentication failed");
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/me", Auth, async (req, res) => {
    const user = await UserModel.findByPk(req.user.id)
    try {
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.json(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const users = await UserModel.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
    const { password, ...fields } = req.body;

    try {
        if (password) {
            fields.password = await bcrypt.hash(password, 10);
        }

        const result = await UserModel.update(
            { ...fields, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        const note = await UserModel.findByPk(req.params.noteId);

        res.status(200).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const note = await UserModel.findByPk(req.params.id);

        if (!note) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await UserModel.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        res.status(204).json();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


export default router;