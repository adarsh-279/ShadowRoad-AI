const express = require("express");
const router = express.Router();
const Law = require("../src/models/Law");

const ALL_LAWS = [
  {
    category: "speed",
    icon: "🏙️",
    title: "City Road Speed Limit",
    section: "§112 MV Act",
    fine: "50 km/h",
    description:
      "Maximum speed on urban roads / city streets. Exceeding by 10+ km/h triggers auto-challan.",
    penalty:
      "Penalty: ₹1,000–₹2,000 for LMV | ₹2,000–₹4,000 for Heavy Vehicles",
    isDanger: false,
  },
  {
    category: "speed",
    icon: "🛣️",
    title: "Highway Speed Limit",
    section: "§112 MV Act",
    fine: "100 km/h",
    description:
      "National Highways: max 100 km/h for cars, 80 km/h for buses/trucks. Expressways may allow 120 km/h.",
    penalty: "Penalty: ₹1,000–₹2,000 per offence + DL suspension risk",
    isDanger: false,
  },
  {
    category: "speed",
    icon: "🏫",
    title: "School Zone Speed",
    section: "State Regulation",
    fine: "25 km/h",
    description:
      "Mandatory reduced speed within 100m of any school during school hours (6 AM–8 PM).",
    penalty: "Penalty: ₹1,000 + repeat offenders face DL suspension",
    isDanger: true,
  },
  {
    category: "speed",
    icon: "🏥",
    title: "Hospital / Silence Zone",
    section: "§112 + Noise Rules",
    fine: "20 km/h",
    description:
      "100m radius around hospitals, courts, educational institutions. Honking strictly prohibited.",
    penalty: "Penalty: ₹2,000 fine + horn usage adds ₹1,000 noise violation",
    isDanger: true,
  },
  {
    category: "speed",
    icon: "🚦",
    title: "Red Light Jumping",
    section: "§119 / §177A",
    fine: "₹5,000",
    description:
      "Crossing a red traffic signal. Detected by ShadowRoad via sudden deceleration.",
    penalty: "₹5,000 fine + 6 points on DL + possible DL suspension",
    isDanger: true,
  },
  {
    category: "speed",
    icon: "↩️",
    title: "Wrong Side / Wrong Way Driving",
    section: "§184",
    fine: "₹5,000",
    description:
      "Driving against traffic flow on any road. One of the top accident causes in India.",
    penalty: "₹5,000 + 6 months–1 year jail if accident caused",
    isDanger: true,
  },
  {
    category: "speed",
    icon: "🏎️",
    title: "Road Racing / Stunts",
    section: "§189",
    fine: "₹5,000",
    description:
      "Participating in unauthorised racing, speed trials, or dangerous stunts on public roads.",
    penalty:
      "1st offence: ₹5,000 + 1 year jail | Repeat: ₹10,000 + 2 years jail",
    isDanger: false,
  },
  {
    category: "safety",
    icon: "⛑️",
    title: "Helmet — Rider Mandatory",
    section: "§129 / §194D",
    fine: "₹1,000",
    description:
      "ISI-marked helmet compulsory for rider AND pillion on any 2-wheeler.",
    penalty: "₹1,000 fine + 3-month DL disqualification",
    isDanger: true,
  },
  {
    category: "safety",
    icon: "🪑",
    title: "Seat Belt — Front Seat",
    section: "§194B",
    fine: "₹1,000",
    description:
      "Mandatory for driver and all front-seat passengers in any 4-wheeler.",
    penalty: "₹1,000 per violation. Rear seat: ₹500 in some states",
    isDanger: true,
  },
  {
    category: "safety",
    icon: "📱",
    title: "Mobile Phone While Driving",
    section: "§184",
    fine: "₹1,000–₹5,000",
    description:
      "Using a handheld device while driving. Includes texting, calling without handsfree.",
    penalty: "₹1,000–₹5,000 + DL suspension for 3 months",
    isDanger: false,
  },
  {
    category: "safety",
    icon: "🧒",
    title: "Juvenile Driving",
    section: "§199A",
    fine: "₹25,000",
    description:
      "Person under 18 driving a motorised vehicle. Guardian/owner is held responsible.",
    penalty:
      "₹25,000 + 3 years jail for guardian + vehicle registration cancelled",
    isDanger: false,
  },
  {
    category: "safety",
    icon: "🚑",
    title: "Not Giving Way to Emergency",
    section: "§194E",
    fine: "₹10,000",
    description:
      "Blocking or failing to give way to ambulance, fire brigade, or police vehicle.",
    penalty: "₹10,000 fine. Repeat offenders face 6 months jail",
    isDanger: false,
  },
  {
    category: "safety",
    icon: "👶",
    title: "Child Safety Seat",
    section: "§194B(3)",
    fine: "₹1,000",
    description:
      "Children under 4 years must be in a proper child restraint/safety seat.",
    penalty: "₹1,000 fine for non-compliance",
    isDanger: false,
  },
  {
    category: "impaired",
    icon: "🍺",
    title: "Drunk Driving — 1st Offence",
    section: "§185",
    fine: "₹10,000",
    description:
      "BAC > 30 mg per 100 ml blood. Breathalyser test at checkpoint or after accident.",
    penalty: "₹10,000 fine + 6 months imprisonment + DL suspended",
    isDanger: true,
  },
  {
    category: "impaired",
    icon: "🍻",
    title: "Drunk Driving — Repeat Offence",
    section: "§185(2)",
    fine: "₹15,000",
    description:
      "Second or subsequent drunk driving offence within 3 years of previous conviction.",
    penalty: "₹15,000 + 2 years imprisonment + DL cancelled",
    isDanger: true,
  },
  {
    category: "impaired",
    icon: "💊",
    title: "Drug-Impaired Driving",
    section: "§185",
    fine: "₹10,000+",
    description:
      "Driving under influence of any narcotic or drug that impairs driving ability.",
    penalty: "Same as §185 drunk driving penalties — ₹10,000–15,000 + jail",
    isDanger: true,
  },
  {
    category: "impaired",
    icon: "🚗",
    title: "Dangerous / Rash Driving",
    section: "§184",
    fine: "₹5,000",
    description:
      "Driving in a manner that endangers public safety — includes weaving, sudden braking, etc.",
    penalty: "1st: ₹5,000 + 1 yr jail | Repeat: ₹10,000 + 2 yrs jail",
    isDanger: false,
  },
  {
    category: "docs",
    icon: "🪪",
    title: "No Driving Licence",
    section: "§181",
    fine: "₹5,000",
    description:
      "Operating any motor vehicle without a valid DL. Display L-board if learning.",
    penalty:
      "₹5,000 fine. Owner also penalised if permitted unlicensed driving",
    isDanger: true,
  },
  {
    category: "docs",
    icon: "🛡️",
    title: "No Vehicle Insurance",
    section: "§196",
    fine: "₹2,000",
    description:
      "Third-party motor insurance is mandatory for ALL vehicles in India.",
    penalty: "1st: ₹2,000 + 3 months jail | Repeat: ₹4,000 + 3 months jail",
    isDanger: true,
  },
  {
    category: "docs",
    icon: "🚗",
    title: "No Registration Certificate",
    section: "§192",
    fine: "₹5,000",
    description:
      "All motor vehicles must be registered with the RTO and carry the RC.",
    penalty: "Up to ₹5,000 fine + vehicle may be impounded",
    isDanger: false,
  },
  {
    category: "docs",
    icon: "💨",
    title: "No Pollution Certificate (PUC)",
    section: "§190(2)",
    fine: "₹10,000",
    description:
      "Valid PUC (Pollution Under Control) certificate required at all times.",
    penalty: "₹10,000 fine + 3 months jail for repeat offences",
    isDanger: false,
  },
  {
    category: "docs",
    icon: "🔧",
    title: "Vehicle Without Fitness Certificate",
    section: "§56",
    fine: "₹5,000",
    description:
      "Commercial vehicles require valid Fitness Certificate to run.",
    penalty: "₹5,000 + vehicle detained until FC obtained",
    isDanger: false,
  },
  {
    category: "docs",
    icon: "👷",
    title: "No Permit (Commercial Vehicle)",
    section: "§192A",
    fine: "₹10,000",
    description:
      "Goods and public service vehicles require specific route permits.",
    penalty: "₹10,000 fine + vehicle seized",
    isDanger: false,
  },
  {
    category: "general",
    icon: "📦",
    title: "Overloading (Goods Vehicle)",
    section: "§194",
    fine: "₹2,000+",
    description:
      "Carrying goods beyond the vehicle's registered carrying capacity.",
    penalty: "₹2,000 + ₹1,000 per extra tonne overloaded",
    isDanger: false,
  },
  {
    category: "general",
    icon: "👥",
    title: "Overloading (Passengers)",
    section: "§194A",
    fine: "₹1,000+",
    description:
      "Carrying more passengers than the registered seating capacity.",
    penalty: "₹1,000 per extra passenger carried",
    isDanger: false,
  },
  {
    category: "general",
    icon: "🔇",
    title: "Illegal Horn / Noise",
    section: "§190(2)",
    fine: "₹1,000",
    description:
      "Use of multi-toned horns, pressure horns, or honking in silence zones.",
    penalty: "₹1,000 fine + vehicle may be stopped",
    isDanger: false,
  },
  {
    category: "general",
    icon: "🅿️",
    title: "Illegal Parking",
    section: "§122",
    fine: "₹500–₹2,000",
    description:
      "Parking on footpaths, near fire hydrants, violating no-parking zones.",
    penalty: "₹500–₹2,000 + vehicle towed",
    isDanger: false,
  },
];

// Get all laws
router.get("/", async (req, res) => {
  try {
    const laws = await Law.find();
    if (laws.length === 0) {
      return res.json(ALL_LAWS);
    }
    res.json(laws);
  } catch (err) {
    // If MongoDB server isn't running, fallback to memory array silently
    res.json(ALL_LAWS);
  }
});

// Seed laws
router.post("/seed", async (req, res) => {
  try {
    await Law.deleteMany({});
    await Law.insertMany(ALL_LAWS);
    res.status(201).json({ message: "All laws successfully seeded to DB!" });
  } catch (err) {
    res
      .status(400)
      .json({
        message:
          "Could not seed DB (Check if MongoDB is running locally). Serving laws from memory fallback.",
        fallback: true,
      });
  }
});

module.exports = router;
