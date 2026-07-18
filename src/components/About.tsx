"use client";

import { Cpu, CircuitBoard, Radio, Trophy } from "lucide-react";
import styles from "./About.module.css";

export default function About() {
  const interests = [
    {
      icon: <Cpu className={styles.interestIcon} size={20} />,
      title: "RTL Design",
      desc: "Writing and verifying Verilog/SystemVerilog modules, from FSMs to full RTL-to-GDSII flows.",
    },
    {
      icon: <CircuitBoard className={styles.interestIcon} size={20} />,
      title: "Embedded Systems",
      desc: "Building with ESP32 and Arduino, interfacing sensors, and shipping real-time IoT dashboards.",
    },
    {
      icon: <Radio className={styles.interestIcon} size={20} />,
      title: "Semiconductor Fundamentals",
      desc: "Digital IC design, synthesis, and physical design using open-source EDA tooling.",
    },
    {
      icon: <Trophy className={styles.interestIcon} size={20} />,
      title: "Competitive Problem Solving",
      desc: "125+ HDLBits exercises and 500+ programming problems across LeetCode and CodeChef.",
    },
  ];

  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>01.</span> About My Journey
        </h2>

        <div className={styles.grid}>
          {/* Journey Card (Left) */}
          <div className={styles.journeyCard}>
            <p className={styles.journeyText}>
              I'm an Electronics and Communication Engineering student at Aditya University, building a strong foundation in digital IC design, Verilog HDL, and semiconductor fundamentals alongside embedded systems and IoT.
            </p>
            <p className={styles.journeyText}>
              I've designed, simulated, and debugged 10+ Verilog RTL modules, and built tools like an RTL-to-GDSII automation platform and a browser-based Verilog IDE that streamline the ASIC design workflow. I also work hands-on with ESP32/Arduino-based embedded and IoT systems.
            </p>

            <div className={styles.objectiveBox}>
              <h3 className={styles.objectiveTitle}>Career Objective</h3>
              <p className={styles.objectiveText}>
                "To grow as a VLSI Design and Verification Engineer, contributing to digital IC design and RTL-to-GDSII workflows while continuing to build embedded and IoT systems that solve real-world problems."
              </p>
            </div>
          </div>

          {/* Interests Card (Right) */}
          <div>
            <div className={styles.codeBox} style={{ marginBottom: "1.5rem" }}>
              <div className={styles.codeBoxHeader}>
                <div className={styles.codeBoxDots}>
                  <span className={styles.codeBoxDot}></span>
                  <span className={styles.codeBoxDot}></span>
                  <span className={styles.codeBoxDot}></span>
                </div>
                <span className={styles.codeBoxTitle}>principles.json</span>
              </div>
              <div className={styles.codeBoxBody}>
                <span style={{ color: "var(--fg-muted)" }}>// Core engineering beliefs</span>
                <br />
                <span style={{ color: "var(--accent-primary)" }}>const</span> principles = {"{"}
                <div style={{ paddingLeft: "1.5rem" }}>
                  username: <span style={{ color: "#a6e3a1" }}>"sanjay"</span>,
                  <br />
                  simulateBeforeSynthesize: <span style={{ color: "#fab387" }}>true</span>,
                  <br />
                  cleanRTL: <span style={{ color: "#fab387" }}>true</span>,
                  <br />
                  keepItSimple: <span style={{ color: "#fab387" }}>true</span>,
                  <br />
                  timingClosure: <span style={{ color: "#a6e3a1" }}>"mandatory"</span>
                </div>
                {"};"}
              </div>
            </div>

            <div className={styles.interestsGrid}>
              {interests.map((interest, idx) => (
                <div key={idx} className={styles.interestCard}>
                  {interest.icon}
                  <h4 className={styles.interestTitle}>{interest.title}</h4>
                  <p className={styles.interestDesc}>{interest.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
