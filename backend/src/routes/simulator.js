const express = require("express");
const router = express.Router();
const Challan = require("../models/Challan");

const ZONE_LIMITS = {
  school: { limit: 25, name: "School Zone", fine: 1000 },
  hospital: { limit: 20, name: "Hospital Zone", fine: 2000 },
  highway: { limit: 120, name: "Highway", fine: 3000 },
  city: { limit: 50, name: "City Road", fine: 1500 },
};

router.post("/check", async (req, res) => {
  try {
    const { speed, zone, helmet } = req.body;
    const z = ZONE_LIMITS[zone];
    const violations = [];
    let totalFine = 0;

    if (speed > z.limit) {
      const excess = speed - z.limit;
      violations.push(
        `🚨 Speeding in ${z.name}: ${speed} km/h (limit ${z.limit} km/h) — ₹${z.fine.toLocaleString("en-IN")} fine`,
      );
      if (excess > 30)
        violations.push(
          `⚠️ Excessive overspeed (+${excess} km/h) — licence suspension risk`,
        );
      totalFine += z.fine;
    }
    if (!helmet && zone !== "highway") {
      violations.push(
        `⛑️ No helmet detected — ₹500 fine under Section 129 MV Act`,
      );
      totalFine += 500;
    }
    if (speed > z.limit * 2) {
      violations.push(
        `🔴 DANGEROUS DRIVING — ₹5,000 fine + possible arrest (Section 184 MV Act)`,
      );
      totalFine += 5000;
    }

    const result = {
      safe: violations.length === 0,
      violations,
      totalFine,
      message:
        violations.length === 0
          ? `✅ No Violations Detected! Speed: ${speed} km/h in ${z.name} (limit: ${z.limit} km/h). Drive safely! +5 Behaviour Score points.`
          : null,
    };

    // Optionally store the challan in DB
    if (violations.length > 0) {
      const newChallan = new Challan({
        zone,
        speed,
        limit: z.limit,
        fineAmount: totalFine,
        violations,
        helmet,
      });
      await newChallan
        .save()
        .catch((err) =>
          console.log(
            "Could not save challan (DB might be down):",
            err.message,
          ),
        );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
