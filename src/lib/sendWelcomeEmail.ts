export async function sendWelcomeEmail(
  email: string
) {
  try {
    const response =
      await fetch(
        "http://localhost:3001/send-email",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

    const data =
      await response.json();

    console.log(
      data
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      error
    );

    return {
      success: false,
    };
  }
}