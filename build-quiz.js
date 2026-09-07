const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Full 30-question dataset for Danny (FL Amadeus)
const questions = [
  {
    id: 1,
    topic: "Commands",
    title: "RHA vs RHI History Display",
    question: "What is the primary operational difference between entering RHA and RHI in an active Amadeus PNR?",
    cryptic: `> RHA\nRP/STOSG34AA/STOSG34AA  AA/SU  12OCT24/1420Z  ABCXYZ\nH-1.LINDQVIST/ANNA MRS\nH-S2  AF 0442 V 07NOV EZECDG HK1\nH-FA PAX 074-3853604512/...\n\n> RHI\nH-S2  AF 0442 V 07NOV 4 EZECDG HK1\nH-S3  AF 0443 V 14NOV 4 CDGEZE HK1`,
    options: [
      { key: "A", text: "RHA displays the entire PNR history (All elements), whereas RHI filters and displays historical itinerary/segment changes only." },
      { key: "B", text: "RHI is for international flights, whereas RHA is for domestic European flights only." },
      { key: "C", text: "RHA is restricted to supervisor sign-in, while RHI can be executed by any trainee agent." },
      { key: "D", text: "RHI restores previous itinerary segments, whereas RHA permanently archives the PNR to offline storage." }
    ],
    answer: "A",
    explanation: "RHA (Redisplay History All) outputs the comprehensive audit trail including names, contacts, remarks, ticketing, and itinerary. RHI (Redisplay History Itinerary) filters specifically for air and surface segment actions (AS, XS, SC, CS)."
  },
  {
    id: 2,
    topic: "Commands",
    title: "DO Operational Flight Status (Delays / Cancellations)",
    question: "During flight disruptions or schedule irregularities, which command does a floor agent use to query real-time operational flight status (such as delays, estimated departure/arrival times, or cancellations) for segment 2?",
    cryptic: `> DO2\nAF 0442 /07NOV  EZE CDG\nFLIGHT STATUS: DELAYED\nESTIMATED DEP: 0115 (SCHEDULED 2350) - DELAY 01.25\nESTIMATED ARR: 1710 TERM 2E (SCHEDULED 1545)\nOPERATIONAL REASON: LATE ARRIVAL INBOUND AIRCRAFT`,
    options: [
      { key: "A", text: "DO2 (Display Operational flight status for segment 2)" },
      { key: "B", text: "SN2 (Schedule Neutral availability display)" },
      { key: "C", text: "RTG2 (Redisplay Special Service SSR elements)" },
      { key: "D", text: "FQD2 (Fare Quote Display for route)" }
    ],
    answer: "A",
    explanation: "In Amadeus, DO (Display Operational flight status) queries the airline's real-time operational database. It is primarily used during flight disruptions to verify whether a flight is on schedule, delayed, diverted, or cancelled, displaying actual/estimated departure and arrival times, terminal gates, and operational delay remarks."
  },
  {
    id: 3,
    topic: "Commands",
    title: "DMI Minimum Connection Time (MCT) Check",
    question: "Following an airline schedule change (SC) on a connecting itinerary, which command does a floor agent use in Amadeus to verify whether the new layover satisfies the official Minimum Connection Time (MCT)?",
    cryptic: `> DMI\nMCT CHECK - ITINERARY\nSEG 2 ARR CDG 2E 1145  /  SEG 3 DEP CDG 2F 1300\nCONNECTION TIME: 01.15\nSTANDARD MCT: 01.00 - MCT SATISFIED`,
    options: [
      { key: "A", text: "DMI (Display Minimum Connect Time for the active itinerary)" },
      { key: "B", text: "FQD (Fare Quote Display)" },
      { key: "C", text: "TRDC (Ticket Refund Display & Cancellation)" },
      { key: "D", text: "HEET (Help Electronic Ticketing)" }
    ],
    answer: "A",
    explanation: "In Amadeus, DMI (Display Minimum Connect Time Itinerary) verifies whether the connecting flights in the active booking adhere to official airport and airline Minimum Connection Times (MCT). Following an involuntary schedule change (SC) where flight times shifted, agents must execute DMI to ensure the connection is legal and viable before confirming or reissuing."
  },
  {
    id: 4,
    topic: "Commands",
    title: "ERK Schedule Change Acceptance & Inactive Status Cleanup",
    question: "What is the specific operational function of entering ERK during a schedule change in an Amadeus PNR?",
    cryptic: `ACTIVE PNR:\n  2  KL 1108 Y 20NOV 4 AMSARN UN1  1400 1600\n  3  KL 1108 Y 20NOV 4 AMSARN TK1  0730 0930\n\n> ERK\nPNR PROCESSED - TK CHANGED TO HK / UN REMOVED`,
    options: [
      { key: "A", text: "It ends the transaction, automatically accepts the schedule change (converting advisory status like TK to HK), and cleans/purges inactive or cancelled segments (such as UN, HX, or NO)." },
      { key: "B", text: "It cancels the entire itinerary and returns all seats to airline inventory." },
      { key: "C", text: "It voids the active e-ticket and closes the sales report." },
      { key: "D", text: "It places the PNR on supervisor queue without modifying segment statuses." }
    ],
    answer: "A",
    explanation: "In Amadeus floor operations, ERK is the standard command used to process schedule changes: it saves the transaction while automatically confirming advisory schedule change segments (converting TK to HK) and removing inactive, rejected, or cancelled status segments (such as UN, HX, NO, UC) from the active itinerary."
  },
  {
    id: 5,
    topic: "Commands",
    title: "RTTN Ticket Element Display",
    question: "When verifying electronic ticket issuance on a retrieved booking, what does entering RTTN display?",
    cryptic: `> RTTN\n  6  47 FA PAX 074-3853604512/ETAF/EUR842.00/07OCT/STOSG34AA/01234567/S2-3\n  7     FB PAX 0010000001 TKT/T1`,
    options: [
      { key: "A", text: "Ticketing and document lines (FA, FB, FH) displaying ticket numbers, carrier codes, and coupon attachments." },
      { key: "B", text: "Real-time airline flight tracking and gate numbers." },
      { key: "C", text: "Airline telephone and contact desk queues." },
      { key: "D", text: "Stored Transitional Stored Ticket (TST) fare masks." }
    ],
    answer: "A",
    explanation: "RTTN (Redisplay Ticket Numbers) displays the ticket elements (FA for issued tickets, FB for billing, FH for manual ticket entries) and their linked passenger/segment associations."
  },
  {
    id: 6,
    topic: "Commands",
    title: "TWD Electronic Ticket Image",
    question: "An agent needs to inspect coupon statuses (O = Open, F = Flown, E = Exchanged, R = Refunded) on ticket line 6. What command opens the electronic ticket coupon display?",
    cryptic: `> TWD/L6\nTICKET: 074-3853604512    NAME: LINDQVIST/ANNA MRS\nCPN A/L  FLT   CLS DATE   BRD OFF ST NVA   NVB   FAR BSS\n  1 AF   0442   V  07NOV  EZE CDG  O       07NOV VR1SE\n  2 AF   0443   V  14NOV  CDG EZE  O       14NOV VR1SE`,
    options: [
      { key: "A", text: "TWD/L6 (or TWD/TKT074-3853604512)" },
      { key: "B", text: "RTN6" },
      { key: "C", text: "RHA/L6" },
      { key: "D", text: "TQM/L6" }
    ],
    answer: "A",
    explanation: "TWD/L6 (or TWD/TKT<13digits>) opens the Amadeus Ticket Record Display, providing the full electronic ticket image, coupon states, baggage allowance, and fare breakdown."
  },
  {
    id: 7,
    topic: "Commands",
    title: "RTN vs RTG Auxiliary Redisplays",
    question: "When inspecting specific auxiliary sections of a large group PNR, how do RTN and RTG differ?",
    options: [
      { key: "A", text: "RTN displays Name elements only, while RTG displays Special Service Requests (SSR) and OSI elements." },
      { key: "B", text: "RTN opens North American routes, while RTG opens Global international routes." },
      { key: "C", text: "RTN quotes infant fares, while RTG quotes group contracts." },
      { key: "D", text: "RTN cancels inactive seats, while RTG confirms waitlists." }
    ],
    answer: "A",
    explanation: "RTN = Redisplay Names; RTG = Redisplay Special Service (SSR) / OSI elements."
  },
  {
    id: 8,
    topic: "Commands",
    title: "TTE/ALL Purge Stale TSTs",
    question: "During an exchange or reissue drill, the agent receives an error that old, conflicting TST masks exist. Which command deletes all existing TST pricing records from the PNR?",
    cryptic: `> TQT\nTST 01 - STORED 07OCT24 - FARE BASIS VR1SE\nTST 02 - STORED 14NOV24 - FARE BASIS YR1SE\n> TTE/ALL\nTST RECORD(S) DELETED`,
    options: [
      { key: "A", text: "TTE/ALL" },
      { key: "B", text: "XE/ALL" },
      { key: "C", text: "TRDC/ALL" },
      { key: "D", text: "IG/ALL" }
    ],
    answer: "A",
    explanation: "TTE deletes a single TST; TTE/ALL deletes all stored TST records in the active PNR so a clean price quote (FXQ / FXP) can be created without mask collisions."
  },
  {
    id: 9,
    topic: "Commands",
    title: "IG vs IR Discarding Edits",
    question: "You made accidental changes to segment dates in an active PNR and need to discard all uncommitted changes AND immediately redisplay the last saved PNR in one keystroke. Which entry is used?",
    options: [
      { key: "A", text: "IR (Ignore & Redisplay)" },
      { key: "B", text: "IG (Ignore only, which clears to a blank work area)" },
      { key: "C", text: "XI (Cancel Itinerary)" },
      { key: "D", text: "ER (End and Retrieve)" }
    ],
    answer: "A",
    explanation: "IG (Ignore) discards uncommitted work and returns a blank terminal. IR (Ignore & Redisplay) discards uncommitted changes and redisplays the saved PNR in a single command."
  },
  {
    id: 10,
    topic: "History Codes",
    title: "History Code SC (Schedule Change)",
    question: "In PNR history (RHI), you find a line tagged with element code SC. What does SC stand for, and what event triggered it?",
    cryptic: `H-S2  1A/ASC SC AF 0443 V 14NOV 4 CDGEZE TK1 (WAS 1700)`,
    options: [
      { key: "A", text: "Schedule Change — generated when an airline modifies flight numbers, departure/arrival times, or routes." },
      { key: "B", text: "Special Cancellation — generated when an agent cancels a flight due to medical reasons." },
      { key: "C", text: "Seat Confirmed — generated when an airline assigns an exit-row seat." },
      { key: "D", text: "Surcharge Calculation — generated when credit card payment is applied." }
    ],
    answer: "A",
    explanation: "SC stands for Schedule Change. In Amadeus history, SC marks segments where the carrier modified times, dates, flight numbers, or routing."
  },
  {
    id: 11,
    topic: "History Codes",
    title: "History Codes AS vs XS",
    question: "When auditing an itinerary history in RHI, what do the action prefixes AS and XS designate?",
    cryptic: `H-S3  XS AF 0443 V 14NOV CDGEZE HK1  07OCT24/1420Z\nH-S4  AS AF 0443 V 07NOV CDGEZE HK1  07OCT24/1422Z`,
    options: [
      { key: "A", text: "AS = Added Segment (segment booked/added); XS = Cancelled Segment (segment removed)." },
      { key: "B", text: "AS = Airline Schedule; XS = Extra Space." },
      { key: "C", text: "AS = Automated System; XS = XML Service." },
      { key: "D", text: "AS = Adult Seat; XS = Extra Baggage." }
    ],
    answer: "A",
    explanation: "In Amadeus history: AS = Added Segment, XS = Cancelled/Removed Segment (X is the standard cancellation action code in GDS, e.g. XE)."
  },
  {
    id: 12,
    topic: "History Codes",
    title: "History Code RF (Received From)",
    question: "What critical audit information is recorded in the RF history entry of an Amadeus PNR?",
    cryptic: `14OCT 1025Z STOSG34AA AGT-99 RF PASSENGER CALL`,
    options: [
      { key: "A", text: "The 'Received From' field recording the signature, agent ID, office ID, date, and UTC time of the transaction." },
      { key: "B", text: "The Refund Calculation file indicating penalties deducted from the ticket." },
      { key: "C", text: "The Route Frequency code showing daily airline flight rotations." },
      { key: "D", text: "The Reissue Fee waiver code sent by airline revenue accounting." }
    ],
    answer: "A",
    explanation: "The RF (Received From) element is mandatory before ending a transaction. In history, it permanently records who signed the transaction, the agency office ID, and the exact UTC timestamp (Z)."
  },
  {
    id: 13,
    topic: "History Codes",
    title: "History Code CS (Changed Segment)",
    question: "What does the history code CS signify when viewing segment history in RHI?",
    cryptic: `H-S2  CS AF 1017 Y 14DEC DUBCDG TK1 -> HK1`,
    options: [
      { key: "A", text: "Changed Segment (an in-place modification to status code, class, or flight details on an existing segment)." },
      { key: "B", text: "Customer Service telephone log." },
      { key: "C", text: "Codeshare Service operating airline." },
      { key: "D", text: "Charter Service booking." }
    ],
    answer: "A",
    explanation: "CS indicates Changed Segment, showing an in-place state transition such as status updating from TK1 to HK1, or booking class changes."
  },
  {
    id: 14,
    topic: "Status Codes",
    title: "Status Codes TK vs UN",
    question: "An airline updates a schedule. Segment 2 shows status UN1 and segment 3 shows status TK1. What do these statuses indicate?",
    cryptic: `  2  KL 1108 Y 20NOV 4 AMSARN UN1  1400 1600\n  3  KL 1108 Y 20NOV 4 AMSARN TK1  0730 0930`,
    options: [
      { key: "A", text: "UN = Unable/Cancelled (flight/time discontinued); TK = Schedule Change proposed with new timing/flight." },
      { key: "B", text: "UN = Unconfirmed passenger; TK = Ticket already issued." },
      { key: "C", text: "UN = Under negotiation; TK = Turkish Airlines operating carrier." },
      { key: "D", text: "UN = Unaccompanied minor; TK = Travel kiosk check-in." }
    ],
    answer: "A",
    explanation: "UN indicates the flight was cancelled or the original schedule discontinued. TK indicates the airline's proposed replacement flight or revised schedule awaiting customer/agent acceptance."
  },
  {
    id: 15,
    topic: "Status Codes",
    title: "The 'HK now ≠ never SC' Trap",
    question: "A floor agent retrieves a PNR and observes that all flight segments currently display HK1 (Holds Confirmed). The agent asserts: 'Since the status is HK1, this booking has never had a schedule change.' Why is this assertion a dangerous floor trap?",
    cryptic: `ACTIVE DISPLAY:\n  2  BA 0778 Y 15DEC 7 LHRARN HK1  0830 1155\n\nHISTORY DISPLAY (RHI):\n  12OCT 1412Z 1A/ASC SC BA0778 U 15DEC TK1 0830 (WAS 1430)`,
    options: [
      { key: "A", text: "Because a prior agent or automated robot may have already accepted the schedule change (TK/UN confirmed to HK); only RHI history reveals whether an involuntary schedule change occurred." },
      { key: "B", text: "Because HK only applies to hotel bookings." },
      { key: "C", text: "Because HK changes to TK automatically 24 hours prior to departure." },
      { key: "D", text: "Because Amadeus automatically clears all schedule change records from history once a ticket is reissued." }
    ],
    answer: "A",
    explanation: "This is a classic floor trap! Once an agent or automated robot accepts a TK segment (or confirms an involuntary re-accommodation), the active status becomes HK. The only reliable proof of whether an involuntary schedule change took place is in RHI history!"
  },
  {
    id: 16,
    topic: "Status Codes",
    title: "HK Status vs Issued Ticket Reality",
    question: "Does an active status of HK1 on an air segment guarantee that the passenger has an issued, valid electronic ticket for that flight?",
    options: [
      { key: "A", text: "No. HK1 only means airline seat inventory is confirmed. Valid ticketing must be independently verified via RTTN (ticket number in FA line) and TWD (status O = Open)." },
      { key: "B", text: "Yes. In Amadeus, HK is impossible without an issued electronic ticket." },
      { key: "C", text: "Yes. HK automatically charges the passenger's credit card." },
      { key: "D", text: "No. HK means the flight is on standby." }
    ],
    answer: "A",
    explanation: "HK confirms reservation space only. A segment can be HK without a ticket (e.g. under a ticketing time limit TK TL, or after rebooking before reissue). Always verify RTTN / TWD!"
  },
  {
    id: 17,
    topic: "Who Made the Change",
    title: "Attribution: 1A/ASC & PLT",
    question: "You run RHA and spot an itinerary modification signed by 1A/ASC or PLT/AF in the history line. Who executed this change?",
    cryptic: `18NOV 0412Z 1A/ASC SC AF0443 V 14NOV CDGEZE TK1 (WAS 1700)`,
    options: [
      { key: "A", text: "The airline via automated Schedule Change (ASC) / Airline System teletype." },
      { key: "B", text: "The travel agency's junior floor consultant." },
      { key: "C", text: "The passenger using a web browser self-service portal." },
      { key: "D", text: "The IATA BSP audit robot." }
    ],
    answer: "A",
    explanation: "1A/ASC indicates an automated Airline Schedule Change transmitted by the airline's schedule distribution system. PLT indicates private airline teletype/system origin."
  },
  {
    id: 18,
    topic: "Who Made the Change",
    title: "Attribution: TOUCHLESS & QC Robots",
    question: "When auditing PNR history, you see: RF TOUCHLESS-QC 08NOV 0230Z. What does this indicate to a floor lead?",
    options: [
      { key: "A", text: "An automated mid-office robot or queue-processing script updated and closed the PNR without human intervention." },
      { key: "B", text: "The traveler checked in without luggage at an airport biometric kiosk." },
      { key: "C", text: "The operating carrier waived all refund fees." },
      { key: "D", text: "The booking was flagged for fraud and suspended." }
    ],
    answer: "A",
    explanation: "Signatures such as TOUCHLESS, ROBOT, AUTOTKT, or MIDOFFICE identify robotic automated scripts that handle queue checking, auto-ticketing, or QC verification."
  },
  {
    id: 19,
    topic: "Who Made the Change",
    title: "Attribution: Agency Office Signature",
    question: "In a history line: RF PAX JOHN STOSG34AA 12OCT 1430Z, what entity executed this transaction?",
    options: [
      { key: "A", text: "An agent signed into agency office ID STOSG34AA." },
      { key: "B", text: "Amadeus Central Headquarters in Madrid." },
      { key: "C", text: "The operating airline departure gate." },
      { key: "D", text: "An airport check-in desk at Arlanda." }
    ],
    answer: "A",
    explanation: "The Office ID STOSG34AA denotes the specific agency office that performed the transaction."
  },
  {
    id: 20,
    topic: "Floor Mini-Cases",
    title: "Mini-Case: Involuntary SC with Empty Edvin",
    question: "Floor Scenario: A passenger calls stating their flight departure was moved from 14:00 to 07:30 (6.5 hours earlier). You check RHI and see:\n12OCT 0340Z 1A/ASC SC KL1108 Y 20NOV AMSARN TK1 0730 (WAS 1400)\nThe segment status is currently HK1 because a robot accepted it, but ticket coupons in TWD/L6 remain attached to the old time. The internal ticketing queue/tool (Edvin) has no open tasks. What is the correct action for the agent?",
    cryptic: `RHI: 12OCT 0340Z 1A/ASC SC KL1108 Y 20NOV AMSARN TK1 0730 (WAS 1400)\nTWD/L6: CPN 1 KL 1108 Y 20NOV AMSARN STATUS O FLT TIME 1400\nEDVIN TOOL: NO OPEN ORDERS FOUND`,
    options: [
      { key: "A", text: "Escalate/Transfer the booking to the Schedule Change (SC) / Involuntary Reissue queue, as this is an airline-initiated schedule change requiring involuntary ticket revalidation or reissue." },
      { key: "B", text: "Tell the passenger they must pay a standard voluntary rebooking fee and fare difference." },
      { key: "C", text: "Cancel the booking immediately with XI and advise the passenger to buy a new ticket online." },
      { key: "D", text: "Ignore the ticket coupons because the airline gate will automatically board them regardless of ticket status." }
    ],
    answer: "A",
    explanation: "The change originated from 1A/ASC (airline schedule change of 6.5 hours). Even if active segments show HK, the ticket coupon in TWD is out of sync. Since Edvin is empty, the case must be routed to the specialized Schedule Change (SC) queue for involuntary revalidation/reissue under airline schedule change policy."
  },
  {
    id: 21,
    topic: "Floor Mini-Cases",
    title: "Mini-Case: Voluntary vs SC Dispute",
    question: "Floor Scenario: A passenger claims: 'The airline changed my flight, so you must change my return date for free!' You inspect RHA and find:\n04DEC 1120Z STOSG34AA AGT-12 RF CALLER-PAX XS KL1201 / AS KL1205\nThere is no 1A/ASC, no SC code, and no prior airline UN/TK status in history. How do you handle this?",
    cryptic: `RHA AUDIT TRAIL:\n04DEC 1120Z STOSG34AA AGT-12 RF CALLER-PAX\nH-S2  XS KL1201 Y 10DEC AMSARN HK1\nH-S3  AS KL1205 Y 10DEC AMSARN HK1`,
    options: [
      { key: "A", text: "The history proves the change was voluntary, requested by the passenger and processed by agent AGT-12. Standard voluntary fare rules, penalties, and fare differences apply." },
      { key: "B", text: "Agree with the passenger and process an involuntary waiver without fees." },
      { key: "C", text: "Call Amadeus helpdesk to demand a credit note." },
      { key: "D", text: "Void the ticket using TRDC." }
    ],
    answer: "A",
    explanation: "The audit trail confirms that an agency agent (STOSG34AA AGT-12) manually replaced the flight (XS/AS) with Received From CALLER-PAX. No airline schedule change (SC) exists in history; thus, voluntary fare conditions apply."
  },
  {
    id: 22,
    topic: "Floor Mini-Cases",
    title: "RHFA Ticket Line History Audit",
    question: "An agent needs to see the history of electronic ticket numbers issued, reissued, or voided in a PNR. What command specifically filters PNR history for ticket element (FA) modifications?",
    cryptic: `> RHFA\nH-FA PAX 074-3853604512/ETAF/EUR842.00/07OCT/STOSG34AA/01234567/S2-3\nH-FA PAX 074-3853604513/ETAF/EUR81.00/14NOV/STOSG34AA/01234567/S2,4`,
    options: [
      { key: "A", text: "RHFA" },
      { key: "B", text: "RHA/TKT" },
      { key: "C", text: "TWD/HIST" },
      { key: "D", text: "RTF" }
    ],
    answer: "A",
    explanation: "RHFA displays the history of Field Airline (FA) ticket lines, detailing ticket issuance, reissues, exchanges, and voids with timestamps."
  },
  {
    id: 23,
    topic: "PNR Elements & Structure",
    title: "Contact Elements: APE vs APM",
    question: "Why is it crucial in Amadeus to enter passenger email via APE and mobile phone via APM rather than using generic remark fields (RM / OSI)?",
    cryptic: `  4 AP STO +46 8 1234567 - A\n  5 APE ANNA.LINDQVIST@TRAVEL.SE\n  6 APM +46701234567`,
    options: [
      { key: "A", text: "APE and APM format contacts into IATA-standard SSR elements transmitted directly to the airline's automated flight disruption and flight delay notification systems." },
      { key: "B", text: "APE and APM reduce ticket taxes by 10%." },
      { key: "C", text: "RM elements automatically cancel the PNR after 24 hours." },
      { key: "D", text: "APE is required only for frequent flyer miles accumulation." }
    ],
    answer: "A",
    explanation: "APE (Email) and APM (Mobile) format contact data into standardized SSR CTC elements so airline automated operations can reach the passenger in the event of schedule changes, delays, or gate changes."
  },
  {
    id: 24,
    topic: "PNR Elements & Structure",
    title: "Ticketing Deadline: TK OK vs TK TL",
    question: "You review line 6 of a PNR and see: 6 TK TL15NOV/STOSG34AA. What does this line mean, and what happens if no ticket is issued before 15NOV?",
    cryptic: `  1.SMITH/JOHN MR\n  2  BA 0177 Y 20DEC LHRJFK HK1\n  6  TK TL15NOV/STOSG34AA`,
    options: [
      { key: "A", text: "It is a Ticketing Time Limit (Ticketing Deadline); if the e-ticket is not issued by 15NOV, the airline inventory system may automatically cancel the held seats." },
      { key: "B", text: "It means the ticket was OKed and issued on 15NOV." },
      { key: "C", text: "It means the ticket has expired and must be refunded." },
      { key: "D", text: "It indicates a transit layover in Stockholm." }
    ],
    answer: "A",
    explanation: "TK TL<date> is the Ticketing Time Limit. If not ticketed (TK OK) by the deadline, the airline robotics will cancel the space (XX or UN)."
  },
  {
    id: 25,
    topic: "PNR Elements & Structure",
    title: "The RP Header Trap (RP ≠ Issuing Office)",
    question: "At the top of a booking, you see: RP/STOQK2100/STOQK2100 JS/SU 15DEC24/0930Z K778XY. However, the ticket line shows: FA PAX 074-1234567890/ETAF/EUR450.00/15DEC/STOSG34AA/01234567/S2. Why is the office in the RP line different from the office in the FA line?",
    cryptic: `RP/STOQK2100/STOQK2100  JS/SU  15DEC24/0930Z  K778XY\n  1.JONES/ROBERT MR\n  2  AF 1017 Y 20DEC DUBCDG HK1\n  6  TK OK15DEC/STOSG34AA//ETAF\n  7  FA PAX 074-1234567890/ETAF/EUR450.00/15DEC/STOSG34AA/01234567/S2`,
    options: [
      { key: "A", text: "RP indicates the Responsible Partner / originating booking office (STOQK2100), whereas FA records the specific IATA issuing office (STOSG34AA) that actually plated/issued the ticket." },
      { key: "B", text: "The PNR is invalid because the booking and ticketing offices must always be identical." },
      { key: "C", text: "The ticket was issued by an unauthorized third party." },
      { key: "D", text: "The passenger changed their departure city from STOQK to STOSG." }
    ],
    answer: "A",
    explanation: "In travel management, bookings are frequently created by sub-agents or corporate branches (RP/STOQK2100), but ticketing is fulfilled by a central IATA ticketing office (FA ... STOSG34AA). Assuming RP is the issuing office is a common error!"
  },
  {
    id: 26,
    topic: "PNR Elements & Structure",
    title: "Ghost / MIS Auxiliary Segments",
    question: "What is the primary operational role of a MIS 1A (Miscellaneous / Ghost) segment in an Amadeus PNR?",
    cryptic: `  2  AF 0442 V 07NOV 4 EZECDG HK1\n  3  MIS 1A HK1 STO 15DEC-REBOOK IN PROGRESS DO NOT PURGE`,
    options: [
      { key: "A", text: "It acts as a passive placeholder segment that keeps the PNR active in the system without occupying real airline seat inventory." },
      { key: "B", text: "It blocks the passenger from boarding without supervisor sign-off." },
      { key: "C", text: "It transmits a baggage claim tag to the airport baggage system." },
      { key: "D", text: "It automatically lowers the airfare price on domestic routes." }
    ],
    answer: "A",
    explanation: "Amadeus automatically purges PNRs that have no live flight segments. A MIS (ghost/retention) segment keeps the PNR alive in the GDS database during complex reissues, ticket voids, or administrative hold periods."
  },
  {
    id: 27,
    topic: "PNR Elements & Structure",
    title: "FA Line Anatomy (3 + 10 Digits)",
    question: "In the ticket element FA PAX 117-2456789012/ETSK/EUR320.00/10NOV/STOSG34AA/S2-3, what do the numbers 117 and 2456789012 represent?",
    cryptic: `7 FA PAX 117-2456789012/ETSK/EUR320.00/10NOV/STOSG34AA/01234567/S2-3`,
    options: [
      { key: "A", text: "117 is the 3-digit IATA airline ticketing accounting prefix (SAS); 2456789012 is the 10-digit unique document serial number (13 digits total)." },
      { key: "B", text: "117 is the agency employee ID; 2456789012 is the passenger's national identity number." },
      { key: "C", text: "117 is the flight number; 2456789012 is the booking confirmation locator." },
      { key: "D", text: "117 is the tax code; 2456789012 is the fare calculation sequence." }
    ],
    answer: "A",
    explanation: "Every IATA e-ticket consists of a 3-digit airline accounting prefix (e.g. 117=SAS, 074=Air France, 125=British Airways, 082=Brussels Airlines, 001=American Airlines) followed by a 10-digit serial number, totaling 13 digits."
  },
  {
    id: 28,
    topic: "Commands",
    title: "RT/ Surname Retrieval",
    question: "A caller does not know their 6-character PNR record locator or ticket number. What command allows a floor agent to search for active bookings by passenger surname?",
    options: [
      { key: "A", text: "RT/LINDQVIST (or RT/LINDQVIST/ANNA)" },
      { key: "B", text: "SN/LINDQVIST" },
      { key: "C", text: "FQD/LINDQVIST" },
      { key: "D", text: "TWD/LINDQVIST" }
    ],
    answer: "A",
    explanation: "RT/SURNAME or RT/SURNAME/FIRSTNAME searches the Amadeus database for active bookings matching the passenger's name."
  },
  {
    id: 29,
    topic: "History Codes",
    title: "History Element Prefixes (H-S, H-FA)",
    question: "When viewing RHA, an agent notices element history numbers like H-S2 and H-FA6. What does the H- prefix designate?",
    cryptic: `H-S2   AF 0442 V 07NOV 4 EZECDG HK1\nH-FA6  FA PAX 074-3853604512/...`,
    options: [
      { key: "A", text: "Historical element reference, pointing to the original element number at the time of modification." },
      { key: "B", text: "High-priority security alert." },
      { key: "C", text: "Hotel reservation reference." },
      { key: "D", text: "Head office supervisor authorization." }
    ],
    answer: "A",
    explanation: "In Amadeus history displays, H- designates historical element numbers (e.g. H-S2 = history for segment 2, H-FA6 = history for ticket line 6)."
  },
  {
    id: 30,
    topic: "Commands",
    title: "DM Time Difference Calculation",
    question: "When calculating the exact elapsed layover duration between the arrival of segment 2 (08:15) and departure of segment 3 (11:45), which command calculates the time difference in Amadeus?",
    cryptic: `> DM0815/1145\n03.30`,
    options: [
      { key: "A", text: "DM0815/1145" },
      { key: "B", text: "FXP/LAYOVER" },
      { key: "C", text: "RHI/TIME" },
      { key: "D", text: "TTE/TIME" }
    ],
    answer: "A",
    explanation: "In Amadeus, DM <time1>/<time2> displays the elapsed flying or layover hours and minutes (e.g. 03.30 = 3 hours 30 minutes) directly in the terminal."
  }
];

// HTML Template
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GDS History + Commands Quiz — Danny (FL Amadeus)</title>
  <style>
    :root {
      --text: #1E232A;
      --text-2: #5F6B7C;
      --canvas: #F4F6F9;
      --surface: #FFFFFF;
      --soft: #EDF2F7;
      --border: #D8E0EB;
      
      --blue: #1C64F2;
      --blue-soft: #EBF5FF;
      --green: #0E9F6E;
      --green-soft: #DEF7EC;
      --amber: #D97706;
      --amber-soft: #FEF3C7;
      --red: #E02424;
      --red-soft: #FDE8E8;
      --purple: #7E3AF2;
      --purple-soft: #F3E8FF;

      --term-bg: #0B0F0C;
      --term-green: #3DFF7A;
      --term-amber: #FFB84D;
      --term-cyan: #5EEAD4;
      --term-dim: #718096;
      --term-white: #E2E8F0;

      --radius: 10px;
      --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05);
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --mono: "SF Mono", Menlo, Consolas, "Courier New", monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--canvas);
      color: var(--text);
      font-family: var(--font);
      font-size: 15px;
      line-height: 1.5;
      padding-bottom: 60px;
    }

    /* App Header */
    .app-header {
      background: #0D131A;
      color: #FFF;
      border-bottom: 1px solid #1E293B;
      padding: 16px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .header-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-gds {
      background: #3DFF7A;
      color: #0B0F0C;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: var(--mono);
    }
    .app-header h1 {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .target-badge {
      font-size: 12px;
      color: #94A3B8;
      background: #1E293B;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #334155;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .toggle-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #CBD5E1;
      background: #1E293B;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid #334155;
      cursor: pointer;
      user-select: none;
    }
    .toggle-wrap input { cursor: pointer; }

    /* Main Container */
    .container {
      max-width: 1080px;
      margin: 24px auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 860px) {
      .container { grid-template-columns: 1fr; }
    }

    /* Topic Bar */
    .topic-filter-bar {
      grid-column: 1 / -1;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .filter-btn {
      padding: 6px 12px;
      border-radius: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-2);
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-btn:hover {
      border-color: var(--blue);
      color: var(--blue);
    }
    .filter-btn.active {
      background: var(--blue);
      color: #FFF;
      border-color: var(--blue);
    }

    /* Question Card */
    .card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 28px;
      position: relative;
    }

    .card-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .meta-tag {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 6px;
      letter-spacing: 0.04em;
    }
    .tag-Commands { background: var(--blue-soft); color: var(--blue); }
    .tag-HistoryCodes { background: var(--purple-soft); color: var(--purple); }
    .tag-StatusCodes { background: var(--amber-soft); color: var(--amber); }
    .tag-WhoMadeTheChange { background: #E0E7FF; color: #4338CA; }
    .tag-FloorMiniCases { background: var(--red-soft); color: var(--red); }
    .tag-PNRElementsStructure { background: var(--green-soft); color: var(--green); }

    .q-counter {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-2);
    }

    .q-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.35;
      margin-bottom: 12px;
    }
    .q-text {
      font-size: 15px;
      color: #334155;
      margin-bottom: 18px;
      line-height: 1.55;
    }

    /* Cryptic Terminal Box */
    .term-box {
      background: var(--term-bg);
      border-radius: 8px;
      border: 1px solid #1E293B;
      padding: 14px 16px;
      font-family: var(--mono);
      font-size: 13px;
      color: var(--term-green);
      line-height: 1.5;
      margin-bottom: 20px;
      white-space: pre-wrap;
      word-break: break-word;
      letter-spacing: 0;
      overflow-x: auto;
    }
    .term-box .term-head {
      color: var(--term-dim);
      font-size: 11px;
      margin-bottom: 6px;
      text-transform: uppercase;
      border-bottom: 1px solid #1E293B;
      padding-bottom: 4px;
    }

    /* Option Items */
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }
    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 16px;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .option-item:hover {
      border-color: #94A3B8;
      background: var(--soft);
    }
    .option-item.selected {
      border-color: var(--blue);
      background: var(--blue-soft);
    }
    .option-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: var(--soft);
      border: 1px solid var(--border);
      font-weight: 700;
      font-size: 13px;
      color: var(--text-2);
      flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .option-item.selected .option-badge {
      background: var(--blue);
      color: #FFF;
      border-color: var(--blue);
    }
    .option-text {
      font-size: 14.5px;
      color: var(--text);
      line-height: 1.45;
      padding-top: 3px;
    }

    /* Evaluated State */
    .option-item.correct {
      border-color: var(--green);
      background: var(--green-soft);
    }
    .option-item.correct .option-badge {
      background: var(--green);
      color: #FFF;
      border-color: var(--green);
    }
    .option-item.wrong {
      border-color: var(--red);
      background: var(--red-soft);
    }
    .option-item.wrong .option-badge {
      background: var(--red);
      color: #FFF;
      border-color: var(--red);
    }

    /* Explanation Box */
    .explanation-box {
      display: none;
      background: #F8FAFC;
      border-left: 4px solid var(--blue);
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #334155;
      line-height: 1.5;
    }
    .explanation-box.show { display: block; }
    .explanation-box.is-correct { border-left-color: var(--green); background: #F0FDF4; }
    .explanation-box.is-wrong { border-left-color: var(--red); background: #FEF2F2; }
    .exp-title {
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Actions Bar */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-secondary {
      background: var(--soft);
      border-color: var(--border);
      color: var(--text);
    }
    .btn-secondary:hover { background: #E2E8F0; }
    .btn-primary {
      background: var(--blue);
      color: #FFF;
    }
    .btn-primary:hover { background: #1A56DB; }
    .btn-success {
      background: var(--green);
      color: #FFF;
    }
    .btn-success:hover { background: #057A55; }

    /* Sidebar / Palette */
    .sidebar-card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 20px;
      position: sticky;
      top: 90px;
    }
    .sb-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .score-chip {
      font-size: 12px;
      background: var(--soft);
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
      color: var(--text-2);
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-bottom: 18px;
    }
    .p-btn {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .p-btn:hover { border-color: var(--blue); color: var(--blue); }
    .p-btn.active { outline: 2px solid var(--blue); outline-offset: 1px; }
    .p-btn.answered { background: #E2E8F0; border-color: #CBD5E1; }
    .p-btn.correct { background: var(--green); color: #FFF; border-color: var(--green); }
    .p-btn.wrong { background: var(--red); color: #FFF; border-color: var(--red); }

    .legend-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 11.5px;
      color: var(--text-2);
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
    .leg-item { display: flex; align-items: center; gap: 4px; }
    .leg-dot { width: 10px; height: 10px; border-radius: 2px; }

    /* Results Modal */
    .results-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(13, 19, 26, 0.7);
      backdrop-filter: blur(4px);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .results-overlay.open { display: flex; }
    .results-modal {
      background: var(--surface);
      width: 100%;
      max-width: 650px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      padding: 32px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .res-header { text-align: center; margin-bottom: 24px; }
    .res-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 8px;
    }
    .res-score {
      font-size: 48px;
      font-weight: 800;
      line-height: 1;
      color: var(--text);
      margin-bottom: 6px;
    }
    .res-sub { color: var(--text-2); font-size: 15px; }

    .topic-breakdown {
      margin: 20px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 16px 0;
    }
    .tb-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13.5px;
    }
    .tb-bar-wrap {
      flex: 1;
      margin: 0 14px;
      height: 8px;
      background: #E2E8F0;
      border-radius: 4px;
      overflow: hidden;
    }
    .tb-bar-fill { height: 100%; border-radius: 4px; }

    .res-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
    }
  </style>
</head>
<body>

  <!-- App Header -->
  <header class="app-header">
    <div class="header-inner">
      <div class="brand-title">
        <span class="badge-gds">AMADEUS</span>
        <h1>GDS History + Commands Quiz</h1>
        <span class="target-badge">For Danny (FL Amadeus)</span>
      </div>
      <div class="header-controls">
        <label class="toggle-wrap" title="Toggle immediate feedback after selecting an answer">
          <input type="checkbox" id="instantToggle" checked />
          <span>Instant Reveal</span>
        </label>
        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" id="resetBtn">Restart</button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <div class="container">
    <!-- Topic Filter Bar -->
    <div class="topic-filter-bar" id="topicBar">
      <button class="filter-btn active" data-topic="ALL">All Topics (30)</button>
      <button class="filter-btn" data-topic="Commands">Commands</button>
      <button class="filter-btn" data-topic="History Codes">History Codes</button>
      <button class="filter-btn" data-topic="Status Codes">Status Codes</button>
      <button class="filter-btn" data-topic="Who Made the Change">Who Made the Change</button>
      <button class="filter-btn" data-topic="Floor Mini-Cases">Floor Mini-Cases</button>
      <button class="filter-btn" data-topic="PNR Elements & Structure">PNR Elements & Structure</button>
    </div>

    <!-- Question View -->
    <main>
      <div class="card" id="qCard">
        <div class="card-meta-row">
          <span class="meta-tag" id="qTopicTag">COMMANDS</span>
          <span class="q-counter" id="qCounter">Question 1 of 30</span>
        </div>

        <h2 class="q-title" id="qTitle">RHA vs RHI History Display</h2>
        <p class="q-text" id="qText">What is the primary operational difference between entering RHA and RHI in an active Amadeus PNR?</p>

        <div class="term-box" id="qCryptic" style="display: none;">
          <div class="term-head">Cryptic Reference</div>
          <div id="qCrypticContent"></div>
        </div>

        <div class="options-list" id="qOptions"></div>

        <div class="explanation-box" id="qExplanation">
          <div class="exp-title" id="expTitle">Floor Explanation</div>
          <p id="expText"></p>
        </div>

        <div class="actions-bar">
          <button class="btn btn-secondary" id="prevBtn" disabled>← Previous</button>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" id="revealBtn" style="display: none;">Explain</button>
            <button class="btn btn-primary" id="nextBtn">Next →</button>
            <button class="btn btn-success" id="finishBtn" style="display: none;">Submit & View Score</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Sidebar Palette -->
    <aside>
      <div class="sidebar-card">
        <div class="sb-title">
          <span>Question Jump</span>
          <span class="score-chip" id="answeredChip">0 / 30 answered</span>
        </div>
        <div class="palette-grid" id="paletteGrid"></div>
        <div class="legend-row">
          <div class="leg-item"><div class="leg-dot" style="background:#FFF;border:1px solid #CBD5E1"></div> Unanswered</div>
          <div class="leg-item"><div class="leg-dot" style="background:#E2E8F0"></div> Answered</div>
          <div class="leg-item"><div class="leg-dot" style="background:var(--green)"></div> Correct</div>
          <div class="leg-item"><div class="leg-dot" style="background:var(--red)"></div> Incorrect</div>
        </div>
        <div style="margin-top: 16px;">
          <button class="btn btn-success" style="width: 100%; font-size: 13px;" id="submitAllBtn">Submit All & Score</button>
        </div>
      </div>
    </aside>
  </div>

  <!-- Results Modal -->
  <div class="results-overlay" id="resultsModal">
    <div class="results-modal">
      <div class="res-header">
        <span class="res-badge" id="resBadge" style="background:var(--green-soft);color:var(--green)">FLOOR READY</span>
        <div class="res-score" id="resScore">28 / 30</div>
        <div class="res-sub" id="resPct">93% Accuracy · Floor Lead Mastery Confirmed</div>
      </div>

      <div class="topic-breakdown" id="topicBreakdown"></div>

      <div class="res-actions">
        <button class="btn btn-secondary" id="reviewBtn">Review Answers</button>
        <button class="btn btn-primary" id="retakeBtn">Retake Quiz</button>
      </div>
    </div>
  </div>

  <!-- Quiz Engine Script -->
  <script>
    const QUIZ_DATA = ${JSON.stringify(questions, null, 2)};

    let currentIdx = 0;
    let selectedTopic = "ALL";
    let userAnswers = {}; // { qId: 'A' }
    let instantMode = true;
    let isFinished = false;

    // Filtered list of questions based on topic filter
    function getVisibleQuestions() {
      if (selectedTopic === "ALL") return QUIZ_DATA;
      return QUIZ_DATA.filter(q => q.topic === selectedTopic);
    }

    const dom = {
      instantToggle: document.getElementById('instantToggle'),
      resetBtn: document.getElementById('resetBtn'),
      topicBar: document.getElementById('topicBar'),
      qTopicTag: document.getElementById('qTopicTag'),
      qCounter: document.getElementById('qCounter'),
      qTitle: document.getElementById('qTitle'),
      qText: document.getElementById('qText'),
      qCryptic: document.getElementById('qCryptic'),
      qCrypticContent: document.getElementById('qCrypticContent'),
      qOptions: document.getElementById('qOptions'),
      qExplanation: document.getElementById('qExplanation'),
      expTitle: document.getElementById('expTitle'),
      expText: document.getElementById('expText'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      revealBtn: document.getElementById('revealBtn'),
      finishBtn: document.getElementById('finishBtn'),
      paletteGrid: document.getElementById('paletteGrid'),
      answeredChip: document.getElementById('answeredChip'),
      submitAllBtn: document.getElementById('submitAllBtn'),
      resultsModal: document.getElementById('resultsModal'),
      resBadge: document.getElementById('resBadge'),
      resScore: document.getElementById('resScore'),
      resPct: document.getElementById('resPct'),
      topicBreakdown: document.getElementById('topicBreakdown'),
      reviewBtn: document.getElementById('reviewBtn'),
      retakeBtn: document.getElementById('retakeBtn')
    };

    function init() {
      renderTopicBar();
      renderPalette();
      renderCurrentQuestion();

      dom.instantToggle.addEventListener('change', (e) => {
        instantMode = e.target.checked;
        renderCurrentQuestion();
        renderPalette();
      });

      dom.prevBtn.addEventListener('click', () => {
        const visible = getVisibleQuestions();
        if (currentIdx > 0) {
          currentIdx--;
          renderCurrentQuestion();
          renderPalette();
        }
      });

      dom.nextBtn.addEventListener('click', () => {
        const visible = getVisibleQuestions();
        if (currentIdx < visible.length - 1) {
          currentIdx++;
          renderCurrentQuestion();
          renderPalette();
        }
      });

      dom.revealBtn.addEventListener('click', () => {
        const q = getVisibleQuestions()[currentIdx];
        showExplanation(q);
      });

      dom.finishBtn.addEventListener('click', finishQuiz);
      dom.submitAllBtn.addEventListener('click', finishQuiz);

      dom.reviewBtn.addEventListener('click', () => {
        dom.resultsModal.classList.remove('open');
        currentIdx = 0;
        renderCurrentQuestion();
        renderPalette();
      });

      dom.retakeBtn.addEventListener('click', resetQuiz);
      dom.resetBtn.addEventListener('click', resetQuiz);

      // Keyboard shortcuts: 1-4 or A-D
      window.addEventListener('keydown', (e) => {
        if (dom.resultsModal.classList.contains('open')) return;
        const key = e.key.toUpperCase();
        const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };
        if (map[key]) {
          const q = getVisibleQuestions()[currentIdx];
          selectAnswer(q.id, map[key]);
        } else if (e.key === 'ArrowRight') {
          dom.nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
          dom.prevBtn.click();
        }
      });
    }

    function renderTopicBar() {
      dom.topicBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          dom.topicBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedTopic = btn.getAttribute('data-topic');
          currentIdx = 0;
          renderCurrentQuestion();
          renderPalette();
        });
      });
    }

    function renderPalette() {
      dom.paletteGrid.innerHTML = '';
      const visible = getVisibleQuestions();
      let answeredCount = 0;

      visible.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-btn';
        btn.textContent = idx + 1;
        if (idx === currentIdx) btn.classList.add('active');

        const ans = userAnswers[q.id];
        if (ans) {
          answeredCount++;
          if (isFinished || instantMode) {
            if (ans === q.answer) btn.classList.add('correct');
            else btn.classList.add('wrong');
          } else {
            btn.classList.add('answered');
          }
        }

        btn.addEventListener('click', () => {
          currentIdx = idx;
          renderCurrentQuestion();
          renderPalette();
        });

        dom.paletteGrid.appendChild(btn);
      });

      dom.answeredChip.textContent = answeredCount + ' / ' + visible.length + ' answered';
    }

    function renderCurrentQuestion() {
      const visible = getVisibleQuestions();
      if (!visible.length) return;
      const q = visible[currentIdx];

      // Meta Tag
      dom.qTopicTag.textContent = q.topic;
      dom.qTopicTag.className = 'meta-tag tag-' + q.topic.replace(/[^a-zA-Z]/g, '');
      dom.qCounter.textContent = 'Question ' + (currentIdx + 1) + ' of ' + visible.length;
      dom.qTitle.textContent = q.title;
      dom.qText.textContent = q.question;

      // Cryptic snippet
      if (q.cryptic) {
        dom.qCryptic.style.display = 'block';
        dom.qCrypticContent.textContent = q.cryptic;
      } else {
        dom.qCryptic.style.display = 'none';
      }

      // Options
      dom.qOptions.innerHTML = '';
      const currentAns = userAnswers[q.id];
      const showFeedback = isFinished || (instantMode && currentAns);

      q.options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'option-item';
        if (currentAns === opt.key) item.classList.add('selected');

        if (showFeedback) {
          if (opt.key === q.answer) item.classList.add('correct');
          else if (currentAns === opt.key && currentAns !== q.answer) item.classList.add('wrong');
        }

        const badge = document.createElement('div');
        badge.className = 'option-badge';
        badge.textContent = opt.key;

        const text = document.createElement('div');
        text.className = 'option-text';
        text.textContent = opt.text;

        item.appendChild(badge);
        item.appendChild(text);

        item.addEventListener('click', () => {
          if (isFinished) return;
          selectAnswer(q.id, opt.key);
        });

        dom.qOptions.appendChild(item);
      });

      // Explanation box
      if (showFeedback) {
        showExplanation(q);
      } else {
        dom.qExplanation.classList.remove('show', 'is-correct', 'is-wrong');
      }

      // Navigation Buttons
      dom.prevBtn.disabled = (currentIdx === 0);
      if (currentIdx === visible.length - 1) {
        dom.nextBtn.style.display = 'none';
        dom.finishBtn.style.display = 'inline-flex';
      } else {
        dom.nextBtn.style.display = 'inline-flex';
        dom.finishBtn.style.display = 'none';
      }

      if (!instantMode && currentAns && !isFinished) {
        dom.revealBtn.style.display = 'inline-flex';
      } else {
        dom.revealBtn.style.display = 'none';
      }
    }

    function selectAnswer(qId, key) {
      userAnswers[qId] = key;
      renderCurrentQuestion();
      renderPalette();
    }

    function showExplanation(q) {
      const ans = userAnswers[q.id];
      dom.qExplanation.classList.add('show');
      if (ans) {
        if (ans === q.answer) {
          dom.qExplanation.className = 'explanation-box show is-correct';
          dom.expTitle.textContent = '✓ Correct Floor Procedure';
        } else {
          dom.qExplanation.className = 'explanation-box show is-wrong';
          dom.expTitle.textContent = '✗ Incorrect Choice';
        }
      } else {
        dom.qExplanation.className = 'explanation-box show';
        dom.expTitle.textContent = 'Floor Explanation';
      }
      dom.expText.textContent = q.explanation;
    }

    function finishQuiz() {
      isFinished = true;
      let total = QUIZ_DATA.length;
      let correct = 0;

      // Group scores by topic
      const topicStats = {};

      QUIZ_DATA.forEach(q => {
        topicStats[q.topic] = topicStats[q.topic] || { total: 0, correct: 0 };
        topicStats[q.topic].total++;
        if (userAnswers[q.id] === q.answer) {
          correct++;
          topicStats[q.topic].correct++;
        }
      });

      const pct = Math.round((correct / total) * 100);
      dom.resScore.textContent = correct + ' / ' + total;
      dom.resPct.textContent = pct + '% Accuracy · ' + (pct >= 85 ? 'Floor Lead Mastery Confirmed' : 'Floor Review Recommended');

      if (pct >= 90) {
        dom.resBadge.textContent = 'MASTER LEAD (AMADEUS FL)';
        dom.resBadge.style.background = 'var(--green-soft)';
        dom.resBadge.style.color = 'var(--green)';
      } else if (pct >= 75) {
        dom.resBadge.textContent = 'COMPETENT (READY WITH REVIEW)';
        dom.resBadge.style.background = 'var(--blue-soft)';
        dom.resBadge.style.color = 'var(--blue)';
      } else {
        dom.resBadge.textContent = 'NEEDS DRILL PRACTICE';
        dom.resBadge.style.background = 'var(--amber-soft)';
        dom.resBadge.style.color = 'var(--amber)';
      }

      // Render Topic Breakdown
      dom.topicBreakdown.innerHTML = '';
      Object.entries(topicStats).forEach(([top, stat]) => {
        const row = document.createElement('div');
        row.className = 'tb-row';
        const topPct = Math.round((stat.correct / stat.total) * 100);

        let barColor = 'var(--green)';
        if (topPct < 70) barColor = 'var(--red)';
        else if (topPct < 85) barColor = 'var(--amber)';

        row.innerHTML = \`
          <span style="width: 170px; font-weight:600">\${top}</span>
          <div class="tb-bar-wrap">
            <div class="tb-bar-fill" style="width: \${topPct}%; background: \${barColor}"></div>
          </div>
          <span style="width: 75px; text-align: right; color: var(--text-2)">\${stat.correct}/\${stat.total} (\${topPct}%)</span>
        \`;
        dom.topicBreakdown.appendChild(row);
      });

      dom.resultsModal.classList.add('open');
      renderCurrentQuestion();
      renderPalette();
    }

    function resetQuiz() {
      userAnswers = {};
      isFinished = false;
      currentIdx = 0;
      dom.resultsModal.classList.remove('open');
      renderCurrentQuestion();
      renderPalette();
    }

    init();
  </script>
</body>
</html>
`;

// Write to root quiz-history-gds.html
const outRoot = path.join(rootDir, 'quiz-history-gds.html');
fs.writeFileSync(outRoot, html, 'utf8');

// Write to dist/quiz-history-gds.html
const outDist = path.join(distDir, 'quiz-history-gds.html');
fs.writeFileSync(outDist, html, 'utf8');

console.log(`Successfully generated GDS History Quiz:`);
console.log(`- Root file: ${outRoot} (${(fs.statSync(outRoot).size / 1024).toFixed(1)} KB)`);
console.log(`- Dist file: ${outDist} (${(fs.statSync(outDist).size / 1024).toFixed(1)} KB)`);
console.log(`Total questions: ${questions.length}`);
