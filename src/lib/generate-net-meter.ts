import jsPDF from "jspdf";
import { format } from "date-fns";
import type { FormData } from "./types";

const addImageWithFixedSize = async (
  doc: jsPDF,
  imgData: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) => {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = imgData;

    img.onload = () => {
      let imgWidth = img.width;
      let imgHeight = img.height;
      const aspectRatio = imgWidth / imgHeight;

      // Resize while maintaining aspect ratio
      if (imgWidth > imgHeight) {
        imgWidth = maxWidth;
        imgHeight = maxWidth / aspectRatio;
      } else {
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }

      // Add image to PDF without compression
      doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
      resolve();
    };

    img.onerror = () => resolve(); // Continue without breaking if image fails
  });
};

export const generateNetMeter = async (
  data: FormData,
  download = false
) => {
  const doc = new jsPDF();

  // Set default font
  doc.setFont("helvetica");

  // Function to add a section title
  const addSectionTitle = (text: string, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(text, 20, y);
  };

  // Function to add a paragraph
  const addParagraph = (text: string, y: number, maxWidth = 170) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Handle line breaks
    const lines = text.split('\n');
    let currentY = y;
    
    for (const line of lines) {
      const splitText = doc.splitTextToSize(line, maxWidth);
      doc.text(splitText, 20, currentY);
      currentY += splitText.length * 5;
    }

    // Return the new Y position after the text
    return currentY;
  };

  // Function to add a subsection
  const addSubsection = (
    number: string,
    text: string,
    y: number,
    maxWidth = 160
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(number, 20, y);
    
    // Handle line breaks
    const lines = text.split('\n');
    let currentY = y;
    
    for (const line of lines) {
      const splitText = doc.splitTextToSize(line, maxWidth);
      doc.text(splitText, 30, currentY);
      currentY += splitText.length * 5;
    }

    // Return the new Y position after the text
    return currentY;
  };

  // Function to format date as string
  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return format(new Date(), "do 'day of' MMMM yyyy");
    }
    return format(date, "do 'day of' MMMM yyyy");
  };

  // ===== PAGE 1 =====

  // Title - centered with proper spacing as in original
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Net Metering Connection Agreement", 105, 240, { align: "center" });

  // Agreement introduction - starting lower on the page as in original
  let yPos = 250;
  const introText = `This Agreement is made and entered into on the ${formatDate(
    new Date(data.agreementDate)
  )} at Dhule, between the Eligible Consumer, ${data.consumerName}, residing ${
    data.consumerAddress
  } and holding Consumer No: ${
    data.consumerNumber
  } (hereinafter referred to as the "First Party").`;
  yPos = addParagraph(introText, yPos) + 5;

  const andText = "AND";
  doc.setFont("helvetica", "bold");
  doc.text(andText, 105, yPos -2 , { align: "center" });

  const secondPartyText = `The Distribution Licensee- Maharashtra State Electricity Distribution Co. Ltd;and having its Registered Office at USD_II S/DN as second Party of this Agreement;`;
  yPos = addParagraph(secondPartyText, yPos + 5);

  // ===== PAGE 2 =====
  doc.addPage();

  yPos = 20;

  const whereasText = `Whereas, the Eligible Consumer has applied to the Licensee for approval of a Net Metering Arrangement under the provisions of the Maharashtra Electricity Regulatory Commission (Grid Interactive Renewable Energy Systems) Regulations, 2019 (Grid Interactive Renewable Energy Systems') and sought its connectivity to the Licensee's Distribution Network;`;
  yPos = addParagraph(whereasText, yPos) ;

  const andWhereasText = `And whereas, the Licensee has agreed to provide Network connectivity to the Eligible Consumer for injection of electricity generated from its Roof-top Solar PV System of ${data.systemCapacity} kilowatt;`;
  yPos = addParagraph(andWhereasText, yPos) + 5 ;

  doc.setFont("helvetica", "bold");
  doc.text("Both Parties hereby agree as follows:-", 20, yPos);
  yPos += 10;

  const Point1 = `1. Eligibility\nThe Roof-top Solar PV System meets the applicable norms for being integrated into the Distribution Network, and that the Eligible Consumer shall maintain the System accordingly for the duration of this Agreement.`;
  yPos = addParagraph(Point1, yPos) + 5;

  // Add Section 2: Technical and Inter-connection Requirements
  addSectionTitle("2. Technical and Inter-connection Requirements:", yPos);
  yPos += 10;

  const techReq1 = `     1. The metering arrangement and the inter-connection of the Roof-top Solar PV System with\nthe Network of the Licensee shall be as per the provisions of the Grid Interactive Renewable\nEnergy Systems Regulations and the technical standards and norms specified by the Central\nElectricity Authority for connectivity of distributed generation resources and for the\ninstallation and operation of meters.`;
  yPos = addParagraph(techReq1, yPos) + 3;

  const techReq2 = `     2. The Eligible Consumer agrees, that he shall install, prior to connection of the Roof-top Solar\nPV System to the Network of the Licensee, an isolation device (both automatic and in built\nwithin inverter and external manual relays); and the`;
  yPos = addParagraph(techReq2, yPos) + 2;

  const techReq2a = `          a. Licensee shall have access to it if required for the repair and maintenance of the\nDistribution Network.`;
  yPos = addParagraph(techReq2a, yPos) + 3;

  const techReq3 = `     3. The Licensee shall specify the interface/inter-connection point and metering point.`;
  yPos = addParagraph(techReq3, yPos) + 3;

  const techReq4 = `     4. The Eligible Consumer shall furnish all relevant data, such as voltage, frequency, circuit\nbreaker, isolator position in his System, as and when required by the Licensee.`;
  yPos = addParagraph(techReq4, yPos) + 5;

  // Add Section 3: Safety
  addSectionTitle("3. Safety:", yPos);
  yPos += 10;

  const safetyText1 = `The equipment connected to the Licensee's Distribution System shall be compliant\nwith relevant International (IEEE/IEC) or Indian Standards (BIS), as the case may be, and\nthe installation of electrical equipment shall comply with the requirements specified by\nthe Central Electricity Authority regarding safety and electricity supply.`;
  yPos = addParagraph(safetyText1, yPos) + 2;

  const safetyText2 = `The design, installation, maintenance and operation of the Roof-top Solar PV System shall be\nundertaken in a manner conducive to the safety of the Roof-top Solar PV System as well\nas the Licensee's Network.`;
  yPos = addParagraph(safetyText2, yPos) + 2;

  const safetyText3 = `If, at any time, the Licensee determines that the Eligible Consumer's Roof-top Solar PV\nSystem is causing or may cause damage to and/or results in the Licensee's other\nconsumers or its assets, the Eligible Consumer shall disconnect the Roof-top Solar PV\nSystem from the distribution Network upon direction from the Licensee, and Shall\nundertake corrective measures at his own expense prior to re-connection.`;
  yPos = addParagraph(safetyText3, yPos) + 5;
  addSectionTitle("4. Other Clearances and Approvals:", yPos);
  yPos += 10;

  const clearancesText =
    "The Eligible Consumer shall obtain any statutory approvals and clearances that maybe required, such as from the Electrical Inspector or the municipal or other authorities, before connecting the Roof-top Solar PV System to the distribution Network.";
  yPos = addParagraph(clearancesText, yPos) + 5;

  // Add page break before Section 4
  doc.addPage();
  yPos = 220;

  // Section 4


  // Section 5
  addSectionTitle("5. Period of Agreement, and Termination:", yPos);
  yPos += 5;

  const periodText = `This Agreement shall be for a period for 20 years, but may be terminated prematurely`;
  yPos = addParagraph(periodText, yPos) + 2;

  yPos = addSubsection("(a)", "By mutual consent; or", yPos);
  yPos = addSubsection("(b)", "By the Eligible Consumer, by giving 30 days' notice to the Licensee;", yPos) ;
  yPos = addSubsection(
    "(c)",
    "By the Licensee, by giving 30 days' notice, if the Eligible Consumer breaches any terms of this Agreement or the provisions of the Grid Interactive Renewable Energy Systems Regulations and does not remedy such breach within 30 days, or such other reasonable period as may be provided, of receiving notice of such breach, or for any other valid reason communicated by the Licensee in writing.",
    yPos
  ) + 5;
  addSectionTitle("6. Access and Disconnection:", yPos - 6);
  yPos += 0;

  yPos = addSubsection(
    "6.1",
    "The Eligible Consumer shall provide access to the Licensee to the metering equipment and disconnecting devices of Roof-top Solar PV System, both automatic and manual, by the Eligible Consumer.",
    yPos
  ) ;

  yPos = addSubsection(
    "6.2",
    "If, in an emergent or outage situation, the Licensee cannot access the disconnecting devices of the Roof-top Solar PV System, both automatic and manual, it may disconnect power supply to the premises.",
    yPos
  ) ;


  // Add page break before Section 6
  doc.addPage();
  yPos = 20;

  // Section 6
  

  // Section 7
  addSectionTitle("7. Liabilities:", yPos);
  yPos += 5;

  const liabilitiesText1 =
    "The Parties shall indemnify each other for damages or adverse effects of either Party's negligence or misconduct during the installation of the Roof-top Solar PV System, connectivity with the distribution Network and operation of the System.";
  yPos = addParagraph(liabilitiesText1, yPos) ;

  const liabilitiesText2 =
    "The Parties shall not be liable to each other for any loss of profits or revenues, business interruption losses, loss of contract or goodwill, or for indirect, consequential, incidental or special damages including, but not limited to, punitive or exemplary damages, whether any of these liabilities, losses or damages arise in contract, or otherwise.";
  yPos = addParagraph(liabilitiesText2, yPos) + 5;

  // Section 8
  addSectionTitle("8. Commercial Settlement:", yPos - 6);
  yPos += 0;

  yPos = addSubsection(
    "8.1",
    "The commercial settlements under this Agreement shall be in accordance with the Grid Interactive Renewable Energy Systems Regulations.",
    yPos
  ) + 2;

  yPos = addSubsection(
    "8.2",
    "The Licensee shall not be liable to compensate the Eligible Consumer if his Rooftop Solar PV System is unable to inject surplus power generated into the Licensee's Network on account of failure of power supply in the grid/Network.",
    yPos
  ) + 2;

  yPos = addSubsection(
    "8.3",
    "The existing metering System, if not in accordance with the Grid Interactive Renewable Energy Systems Regulations, shall be replaced by a bi-directional meter (whole current/CT operated) or a pair of meters (as per the definition of 'Net Meter' in the Regulations), and a separate generation meter may be provided to measure Solar power generation. The bi-directional meter (whole current/CT operated) or pair of meters shall be installed at the inter-connection point to the Licensee's Network for recording export and import of energy.",
    yPos
  ) + 2;

  yPos = addSubsection(
    "8.4",
    "The uni-directional and bi-directional or pair of meters shall be fixed in separate meter boxes in the same proximity.",
    yPos
  ) + 2;

  yPos = addSubsection(
    "8.5",
    "The Licensee shall issue monthly electricity bill for the net metered energy on the scheduled date of meter reading. If the exported energy exceeds the imported energy, the Licensee shall show the net energy exported as credited Units of electricity as specified in the Grid Interactive Renewable Energy Systems Regulations, 2019. If the exported energy is less than the imported energy, the Eligible Consumer shall pay the Distribution Licensee for the net energy imported at the prevailing tariff approved by the Commission for the consumer category to which he belongs.",
    yPos
  ) + 5;

  // Section 9
  addSectionTitle("9. Connection Costs:", yPos - 6);
  yPos += 0;

  yPos =
    addSubsection(
      "9.1",
      "The Eligible Consumer shall bear all costs related to the setting up of the Roof-top Solar PV System, excluding the Net Metering Arrangement costs.",
      yPos
    ) + 2;

  // Section 10
  addSectionTitle("10. Dispute Resolution:", yPos);
  yPos += 5;

  yPos =
    addSubsection(
      "10.1",
      "Any dispute arising under this Agreement shall be resolved promptly, in good faith and in an equitable manner by both the Parties.",
      yPos
    ) + 2;

  yPos =
    addSubsection(
      "10.2",
      "The Eligible Consumer shall have recourse to the concerned Consumer Grievance Redressal Forum constituted under the relevant Regulations in respect of any grievance regarding billing which has not been redressed by the Licensee.",
      yPos
    ) + 2;

  // Add witness section
  const witnessText = `In witness whereof ${data.vendorName} - (S) (VENDOR NAME) for and on behalf of Eligible Consumer and ${data.consumerName} for and on behalf of MSEDCL agree to this agreement.`;
  yPos = addParagraph(witnessText, yPos) + 5;

  // Add signature boxes
  const boxWidth = 60;
  const boxHeight = 30;
  const leftBoxX = 20;
  const rightBoxX = 140;
  

  // Add signature labels
  doc.setFont("helvetica", "bold");
  doc.text("For Eligible Consumer", leftBoxX, yPos + 20);
  doc.text("for and on behalf of MSEDCL", rightBoxX, yPos + 20);
  yPos += 5;



  // Add witness labels
  doc.setFont("helvetica", "normal");
  doc.text("Witness 1(VENDOR):", leftBoxX, yPos + 20);
  doc.text("Witness 1:", rightBoxX, yPos + 20);
  yPos += 30;

  // Add signature images if available
  const imagePromises = [];
  
  // Add customer signature in the first left box
  if (data.customerSignature) {
    imagePromises.push(addImageWithFixedSize(doc, data.customerSignature, leftBoxX, yPos - 40, 50, 25));
  }
  
  // Add company stamp in the first right box
  if (data.companyStamp) {
    imagePromises.push(addImageWithFixedSize(doc, data.companyStamp, leftBoxX, yPos - 5 , 50, 25));
  }
  

  // Wait for all images to be added
  await Promise.all(imagePromises);

  // Save the PDF
  if (download) {
    doc.save("net_metering_agreement.pdf");
  } else {
    return doc.output("blob");
  }
};
