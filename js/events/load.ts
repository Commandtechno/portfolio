import { Dir } from "../constants";
import { $ } from "../util/$";
import { move } from "../util/move";
import { connect } from "../ws";

window.addEventListener("load", () => {
  $<HTMLParagraphElement>("guide").innerText =
    "ontouchstart" in window
      ? "Swipe left, right, up, or down to navigate"
      : "Use your arrow keys to navigate";

  switch (window.location.hash) {
    case "#top":
      move(Dir.Up);
      break;

    case "#contact":
      move(Dir.Down);
      break;

    case "#gfx":
      move(Dir.Left);
      break;

    case "#dev":
      move(Dir.Right);
      break;
  }

  const submitElement = $<HTMLButtonElement>("form-submit");
  const emailElement = $<HTMLInputElement>("form-email");
  const subjectElement = $<HTMLInputElement>("form-subject");
  const contentElement = $<HTMLTextAreaElement>("form-content");

  submitElement.addEventListener("click", async () => {
    const email = emailElement.value;
    const subject = subjectElement.value;
    const content = contentElement.value;

    submitElement.style.backgroundColor = null;
    submitElement.style.color = null;
    submitElement.innerText = "Sending...";
    submitElement.disabled = true;

    try {
      const res = await fetch("/contact", {
        method: "POST",
        body: JSON.stringify({ email, subject, content }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw await res.text();
      }

      emailElement.value = "";
      subjectElement.value = "";
      contentElement.value = "";

      submitElement.style.backgroundColor = "#439543";
      submitElement.style.color = "white";
      submitElement.innerText = "Message Sent!";
      submitElement.disabled = false;
    } catch (err) {
      submitElement.style.backgroundColor = "#ed4444";
      submitElement.style.color = "white";
      submitElement.innerText = typeof err === "string" ? err : "Unknown Error";
      submitElement.disabled = false;
    }
  });

  connect();
});