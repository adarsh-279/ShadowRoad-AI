import challanModel from "../models/challan.model.js";

const ZONE_LIMITS = {
  school: { limit: 25, name: "School Zone", fine: 1000 },
  hospital: { limit: 20, name: "Hospital Zone", fine: 2000 },
  highway: { limit: 120, name: "Highway", fine: 3000 },
  city: { limit: 50, name: "City Road", fine: 1500 },
};

export const checkChallan = async (req, res) => {
  try {
    const { speed, zone, helmet } = req.body;
    const z = ZONE_LIMITS[zone];

    if (!z) {
      return res.status(400).json({ message: "Invalid zone" });
    }

    const violations = [];
    let totalFine = 0;

    if (speed > z.limit) {
      const excess = speed - z.limit;

      violations.push(
        `🚨 Speeding in ${z.name}: ${speed} km/h (limit ${z.limit}) — ₹${z.fine}`,
      );

      if (excess > 30) {
        violations.push(`⚠️ Excessive overspeed (+${excess})`);
      }

      totalFine += z.fine;
    }

    if (!helmet && zone !== "highway") {
      violations.push("⛑️ No helmet — ₹500 fine");
      totalFine += 500;
    }

    if (speed > z.limit * 2) {
      violations.push("🔴 Dangerous Driving — ₹5000");
      totalFine += 5000;
    }

    if (violations.length > 0) {
      await challanModel.create({
        zone,
        speed,
        limit: z.limit,
        fineAmount: totalFine,
        violations,
        helmet,
      });
    }

    res.json({
      safe: violations.length === 0,
      violations,
      totalFine,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
