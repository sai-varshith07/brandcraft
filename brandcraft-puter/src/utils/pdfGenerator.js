import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generateBrandPDF(selectedOutputs, brandProfile, outputs) {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add title page
    pdf.setFontSize(32);
    pdf.setTextColor(124, 77, 255);
    pdf.text("BRAND GUIDE", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Brand Name: ${brandProfile?.brandName || "Your Brand"}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );

    yPosition += 10;
    pdf.setFontSize(11);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, {
      align: "center",
    });

    // Add separator line
    yPosition += 20;
    pdf.setDrawColor(78, 205, 196);
    pdf.line(15, yPosition, pageWidth - 15, yPosition);

    // Add content sections
    const sections = [
      {
        title: "Brand Name",
        key: "Brand Names",
        emoji: "📝",
        format: (val) => val,
      },
      {
        title: "Color Palette",
        key: "Color Palette",
        emoji: "🎨",
        format: (val) => (typeof val === "string" ? val : JSON.stringify(val)),
      },
      {
        title: "Typography",
        key: "Font Pairing",
        emoji: "🔤",
        format: (val) => (typeof val === "string" ? val : JSON.stringify(val)),
      },
      {
        title: "Logo Design",
        key: "Logo Creator",
        emoji: "🎭",
        format: (val) => (typeof val === "string" ? val : "Logo Generated"),
      },
      {
        title: "Ad Copy",
        key: "Ad Copy",
        emoji: "📢",
        format: (val) => (typeof val === "string" ? val : JSON.stringify(val)),
      },
      {
        title: "Social Media Bio",
        key: "Social Bio",
        emoji: "📱",
        format: (val) => (typeof val === "string" ? val : JSON.stringify(val)),
      },
      {
        title: "Email Template",
        key: "Email Template",
        emoji: "📧",
        format: (val) => (typeof val === "string" ? val : JSON.stringify(val)),
      },
    ];

    for (const section of sections) {
      if (selectedOutputs?.[section.key]) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Add section title
        pdf.setFontSize(14);
        pdf.setTextColor(78, 205, 196);
        pdf.text(`${section.emoji} ${section.title}`, 15, yPosition);

        yPosition += 10;

        // Add separator
        pdf.setDrawColor(78, 205, 196);
        pdf.setLineWidth(0.5);
        pdf.line(15, yPosition, pageWidth - 15, yPosition);

        yPosition += 8;

        // Add content
        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        const outputId = selectedOutputs[section.key];
        const output = outputs?.find((o) => o.preview?.includes(outputId) || o.id === outputId);
        const content = section.format(outputId);

        const lines = pdf.splitTextToSize(
          typeof content === "string" ? content : JSON.stringify(content),
          pageWidth - 30
        );

        lines.forEach((line, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 15, yPosition);
          yPosition += 6;
        });

        yPosition += 8;
      }
    }

    // Add footer
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "Created with BrandCraft | Your Brand, Perfectly Crafted",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Download PDF
    const brandName = brandProfile?.brandName?.replace(/\s+/g, "_") || "Brand";
    pdf.save(`${brandName}_Brand_Guide.pdf`);

    return true;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

// Alternative: Generate PDF from HTML content
export async function generateBrandPDFFromHTML(htmlElement, brandName = "Brand") {
  try {
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let remainingHeight = imgHeight;
    let imgYOffset = 0;

    while (remainingHeight > 0) {
      const canvasHeightForPage = Math.min(
        remainingHeight,
        (pageHeight - 20) * (canvas.width / imgWidth)
      );

      const srcY = imgYOffset;
      const srcHeight = canvasHeightForPage * (imgWidth / canvas.width);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.ceil(srcHeight);

      const pageCtx = pageCanvas.getContext("2d");
      pageCtx.drawImage(
        canvas,
        0,
        srcY,
        canvas.width,
        srcHeight,
        0,
        0,
        canvas.width,
        srcHeight
      );

      const pageImgData = pageCanvas.toDataURL("image/png");
      const pageImgHeight = (pageCanvas.height * imgWidth) / canvas.width;

      pdf.addImage(pageImgData, "PNG", 10, yPosition, imgWidth, pageImgHeight);

      remainingHeight -= canvasHeightForPage;
      imgYOffset += canvasHeightForPage;

      if (remainingHeight > 0) {
        pdf.addPage();
        yPosition = 10;
      }
    }

    pdf.save(`${brandName}_Brand_Guide.pdf`);
    return true;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}
