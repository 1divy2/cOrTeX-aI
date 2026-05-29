import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import { Resend } from "resend";

dotenv.config();

const app =
  express();

app.use(cors());

app.use(
  express.json()
);

const resend =
  new Resend(
    process.env
      .RESEND_API_KEY
  );

app.post(
  "/send-email",

  async (
    req,
    res
  ) => {
    try {
      const {
        email,
      } = req.body;

      const response =
        await resend.emails.send({
          from:
            "corTeX <onboarding@resend.dev>",

          to: "YOUR_RESEND_ACCOUNT_EMAIL@gmail.com",

          subject:
            "Welcome to corTeX.ai",

          html: `
          <div style="background:#05010a;padding:40px;font-family:Inter,sans-serif;color:white;">
          <img
  src="https://i.postimg.cc/Zn1nGDmG/Screenshot-2026-05-24-at-20-47-37.png"
  style="
    width:100%;
    border-radius:28px;
    margin-bottom:32px;
    object-fit:cover;
  "
/>
            <h1>Welcome to corTeX.ai</h1>

            <p>
              You're officially in.
            </p>

            <p>
              corTeX.ai is being built for creators, researchers and builders who want a workspace that thinks alongside them.
            </p>

            <a 
              href="http://localhost:8080"
              style="
                display:inline-block;
                margin-top:24px;
                padding:16px 28px;
                border-radius:16px;
                background:linear-gradient(90deg,#a855f7,#ec4899,#22d3ee);
                color:white;
                text-decoration:none;
                font-weight:bold;
              "
            >
              Launch Workspace
            </a>
          </div>
          `,
        });

      res.json({
        success: true,
        response,
      });
    } catch (error) {
      console.error(
        error
      );

      res.status(
        500
      ).json({
        success: false,
        error,
      });
    }
  }
);

app.listen(
  3001,

  () => {
    console.log(
      "EMAIL SERVER RUNNING ON 3001"
    );
  }
);