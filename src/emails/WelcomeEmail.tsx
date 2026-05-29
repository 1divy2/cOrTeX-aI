import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Img,
} from "@react-email/components";

export default function WelcomeEmail() {
  return (
    <Html>

      <Head />

      <Body
        style={{
          background:
            "#05010a",

          fontFamily:
            "Inter, sans-serif",

          color: "white",
        }}
      >

        <Container
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >

          <Img
            src="https://i.postimg.cc/Zn1nGDmG/Screenshot-2026-05-24-at-20-47-37.png"
            width="700"
            style={{
              borderRadius: "28px",
              marginBottom: "40px",
            }}
          />

          <Section>

            <Text
              style={{
                color:
                  "#a1a1aa",

                letterSpacing:
                  "0.25em",

                fontSize: "12px",

                textTransform:
                  "uppercase",
              }}
            >

              OPEN BETA · FREE FOREVER

            </Text>

            <Heading
              style={{
                fontSize: "54px",
                lineHeight: "1",
                fontWeight: 900,
                marginBottom: "24px",
              }}
            >

              Welcome to corTeX.ai

            </Heading>

            <Text
              style={{
                color:
                  "#d4d4d8",

                fontSize: "18px",

                lineHeight: "1.8",
              }}
            >

              You’re officially in.

              <br />
              <br />

              corTeX.ai is being built for
              students, researchers,
              creators and builders who
              want a workspace that
              thinks alongside them.

              <br />
              <br />

              We’re shipping aggressively
              and improving the platform
              daily.

              <br />
              <br />

              Thanks for being early.

            </Text>

            <Button
              href="http://localhost:8080"
              style={{
                marginTop: "32px",
                background:
                  "linear-gradient(90deg,#a855f7,#ec4899,#22d3ee)",

                padding:
                  "18px 32px",

                borderRadius:
                  "18px",

                color: "white",

                fontWeight: 700,

                textDecoration:
                  "none",

                display:
                  "inline-block",
              }}
            >

              Launch Workspace

            </Button>

            <Text
              style={{
                marginTop: "40px",
                color:
                  "#71717a",

                fontSize: "14px",
              }}
            >

              — Divy
              <br />
              Founder, corTeX.ai

            </Text>

          </Section>

        </Container>

      </Body>

    </Html>
  );
}