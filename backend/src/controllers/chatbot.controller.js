const LEGAL_KB = [
  {
    q: ["license", "licence", "dl"],
    a: "📋 Driving without a valid licence is punishable under Section 3/181 of the Motor Vehicles Act. First offence: ₹5,000 fine. Second offence: ₹10,000 + 3 months imprisonment. Always carry your DL when driving.",
  },
  {
    q: ["helmet", "headgear"],
    a: "⛑️ Under Section 129 of the MV Act, wearing a helmet is mandatory for both rider and pillion. Fine: ₹1,000 for first offence + disqualification from riding for 3 months in some states.",
  },
  {
    q: ["school zone", "school speed", "school"],
    a: "🏫 Speed limit in School Zones is 25 km/h. ShadowRoad AI auto-detects when you enter these zones and issues smart warnings. Violation fine: ₹1,000.",
  },
  {
    q: ["hospital zone", "hospital speed", "hospital"],
    a: "🏥 Hospital Zones have a speed limit of 20 km/h under multiple state laws. Honking is also prohibited. Violation attracts a ₹2,000 fine on ShadowRoad.",
  },
  {
    q: ["drunk", "alcohol", "dui", "drink"],
    a: "🍺 Drunk driving under Section 185 MV Act: BAC > 30 mg/100 ml blood is illegal. Penalty: ₹10,000 + 6 months jail (1st offence). ₹15,000 + 2 years jail (repeat).",
  },
  {
    q: ["red light", "signal jump", "traffic signal"],
    a: "🚦 Jumping a red light violates Section 119 MV Act. Fine: ₹5,000 under the 2019 amendment. ShadowRoad AI detects this via sudden deceleration pattern after entering a junction zone.",
  },
  {
    q: ["challan", "fine", "fight", "dispute", "wrong"],
    a: '⚔️ If you believe a challan is wrong, DriveLegal\'s "Fight My Challan" feature can help. It auto-generates a legal brief from your drive data, GPS history, and zone info that you can submit to the court.',
  },
  {
    q: ["speed limit", "speedlimit", "speeding", "overspeed"],
    a: "🛣️ Speed limits under MV Act:\n• City roads: 50 km/h\n• Highways: 80–100 km/h\n• Expressways: Up to 120 km/h\n• School/Hospital zones: 20–25 km/h\nExceeding by 10+ km/h triggers auto-challan.",
  },
  {
    q: ["seat belt", "seatbelt"],
    a: "🪑 Seat belt is mandatory for driver + front seat passenger under Section 138(3) MV Act. Fine: ₹1,000. Rear seat occupants in many states must also wear seat belts.",
  },
  {
    q: ["insurance", "score", "behaviour", "behavior"],
    a: "📊 Your DriveLegal Behaviour Score works like a credit score. Safe months = discounts on insurance premiums. Some insurers offer up to 25% discount for Gold-tier drivers (score 900+).",
  },
  {
    q: ["privacy", "camera", "surveillance", "data"],
    a: "🔒 ShadowRoad AI uses ZERO cameras. All sensor data (GPS, gyroscope, accelerometer) is processed on-device. No video, no face recognition, no data uploaded to servers. 100% privacy-first.",
  },
  {
    q: ["wrong way", "wrong side", "one way"],
    a: "↩️ Driving on the wrong side of the road is a serious offence under Section 119 MV Act (general traffic rules violation). Fine: ₹10,000 + risk of criminal liability if an accident occurs.",
  },
  {
    q: ["emergency", "ambulance", "accident"],
    a: "🚑 ShadowRoad AI auto-detects accident patterns and calls the nearest ambulance within 10 seconds — without you needing to dial 108. It also notifies your emergency contacts and nearby police.",
  },
];

export const chatbotReply = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const lower = message.toLowerCase();

  let answer = "🤔 General legal guidance...";

  for (const item of LEGAL_KB) {
    if (item.q.some((kw) => lower.includes(kw))) {
      answer = item.a;
      break;
    }
  }

  setTimeout(() => {
    res.json({ text: answer });
  }, 900);
};
