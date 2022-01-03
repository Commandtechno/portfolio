window.addEventListener("load", () => {
  const tab = new URL(window.location).searchParams.get("tab");

  switch (tab) {
    case "socials":
      move(D.Up);
      break;

    case "contact":
      move(D.Down);
      break;

    case "gfx":
      move(D.Left);
      break;

    case "dev":
      move(D.Right);
      break;
  }

  const images = document.getElementsByTagName("img");
  for (const image of images) {
    if (!image.alt) alert("Missing alt attribute on image: " + image.src);
    tippy(image, {
      content: image.alt
      // placement: image.getAttribute("tooltip-placement") || "top"
    });
  }

  const submit = document.getElementById("form-submit");
  submit.onclick = event => {
    const email = document.getElementById("form-email").value;
    const subject = document.getElementById("form-subject").value;
    const content = document.getElementById("form-content").value;
    console.log({ email, subject, content });
  };

  fetch("http://localhost:3001")
    .then(res => res.json())
    .then(presence => {
      console.log(presence);
    });
});