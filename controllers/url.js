import { nanoid } from "nanoid";
import URL from "../models/url.js";
import QRCode from "qrcode";
import URL from "../models/url.js";
import geoip from "geoip-lite";
import useragent from "useragent";

const RESERVED_ALIASES = ["analytics", "url", "admin", "login", "register"];

export const handleGenerateNewShortURL = async (req, res) => {
  try {
    const { url, customAlias } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let shortId;

    // If user provided custom alias
    if (customAlias) {
      // Validate format
      const isValid = /^[a-zA-Z0-9-_]{4,20}$/.test(customAlias);
      if (!isValid) {
        return res.status(400).json({
          error:
            "Custom alias must be 4-20 chars and contain only letters, numbers, - or _",
        });
      }

      if (RESERVED_ALIASES.includes(customAlias)) {
        return res
          .status(400)
          .json({
            error:
              "This Keyword/Name is reserved, please provide a different name",
          });
      }

      // Check uniqueness
      const exists = await URL.findOne({ shortID: customAlias });
      if (exists) {
        return res.status(409).json({ error: "Alias already in use" });
      }

      shortId = customAlias;
    } else {
      // Generate random ID
      shortId = nanoid(8);
    }

    // 3Save URL
    await URL.create({
      shortID: shortId,
      redirectURL: url,
      visitHistory: [],
    });

    //  Generate QR code
    const qrCode = await QRCode.toDataURL(`http://localhost:8001/${shortId}`);

    return res.status(201).json({
      id: shortId,
      shortUrl: `http://localhost:8001/${shortId}`,
      qrCode,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handeleGetURLAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortID: shortId });
  if (entry) {
    const totalVisits = entry.visitHistory.length;
    console.log(`Total visits for ${shortId}:`, totalVisits);
    return res.json({ totalVisits, analytics: entry.visitHistory });
  }
  return res.status(404).json({ error: "URL not found" });
};

export const handleViewShortURL = async (req, res) => {
  try {
    const shortId = req.params.shortId;
    console.log("Short ID:", shortId);

    // If behind proxy (Vercel / Nginx / Render)
    // app.set("trust proxy", true);

    // 1️⃣ Get IP Address
    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const ip = rawIp.replace("::ffff:", "");

    // 2️⃣ Geo lookup
    const geo = geoip.lookup(ip);

    // 3️⃣ Parse device & browser
    const agent = useragent.parse(req.headers["user-agent"]);

    // 4️⃣ Update visit history
    const entry = await URL.findOneAndUpdate(
      { shortID: shortId },
      {
        $push: {
          visitHistory: {
            timestamp: new Date(),
            ip,
            geo: geo
              ? {
                  country: geo.country,
                  region: geo.region,
                  city: geo.city,
                  timezone: geo.timezone,
                }
              : null,

            device: {
              browser: agent.family, // Chrome
              os: agent.os.family, // Windows
              deviceType:
                agent.device.family === "Other"
                  ? "desktop"
                  : agent.device.family,
            },
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    console.log("Redirecting to:", entry.redirectURL);
    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};