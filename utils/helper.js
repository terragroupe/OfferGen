import axios from "axios";

// Call PDF.CO API and generate pdf FROM HTML document
export const CreateHtmltoPDF = async (printContent) => {
  // Formating for PDF.CO With tailwind CSS
  // Tailwind Intellisense Bug ->
  const htmlContent = `
      <html>
      <head>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
          }
          .rdtPicker {
            display: none;
          }          
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  tgbrown: {
                    50: "#fbfaeb",
                    100: "#f6f3cb",
                    200: "#efe599",
                    300: "#e6d05e",
                    400: "#484b56",
                    500: "#cda525",
                    600: "#b0811e",
                    700: "#8d5e1b",
                    800: "#764c1d",
                    900: "#65401e",
                  },
                },
              },
            },
          };
        </script>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
      `;

  const apiKey =
    "wael.bouabda@terra-groupe.fr_d05cc87580ad746ef3713c247bd1434aab733a611508e2a96ca230770302b99ea2d38a79";
  const endpoint = "https://api.pdf.co/v1/pdf/convert/from/html";

  const response = await axios.post(
    endpoint,
    {
      html: htmlContent,
      name: "TerraGroupe - d'Offres-Gaz.pdf",
      margins: "20px 8px 8px 8px",
      paperSize: "A3",
      orientation: "Portrait",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    }
  );
  return response.data.url;
};

// The function downloads a file from a URL by fetching its content as a Blob,
// creating a new URL object from the Blob, and initiating a download
// using a dynamically created anchor element.
export const MakeDownloadFromURL = (url) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a new URL object from the blob
      const url = URL.createObjectURL(blob);

      // Create a new anchor element to download the file
      const a = document.createElement("a");
      a.href = url;
      a.download = "TerraGroupe - d'Offres-Gaz.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
};
