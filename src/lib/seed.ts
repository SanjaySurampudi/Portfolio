import { prisma } from "./prisma";

export async function seedPortfolioData() {
  // Check if data already exists to avoid duplicate seeding
  const projectsCount = await prisma.project.count();
  if (projectsCount > 0) return;

  // 1. Seed Skills
  const skillsData = [
    // Languages
    { name: "Verilog", category: "Languages", proficiency: "Advanced", icon: "Code", order: 1 },
    { name: "SystemVerilog", category: "Languages", proficiency: "Intermediate", icon: "Code", order: 2 },
    { name: "C / C++", category: "Languages", proficiency: "Advanced", icon: "Terminal", order: 3 },
    { name: "Python", category: "Languages", proficiency: "Advanced", icon: "Terminal", order: 4 },
    { name: "Java", category: "Languages", proficiency: "Intermediate", icon: "Code", order: 5 },

    // VLSI / EDA Tools
    { name: "Xilinx Vivado", category: "VLSI & EDA Tools", proficiency: "Advanced", icon: "Cpu", order: 6 },
    { name: "OpenLane / Yosys", category: "VLSI & EDA Tools", proficiency: "Advanced", icon: "Cpu", order: 7 },
    { name: "Icarus Verilog", category: "VLSI & EDA Tools", proficiency: "Advanced", icon: "Cpu", order: 8 },
    { name: "KLayout / Magic", category: "VLSI & EDA Tools", proficiency: "Intermediate", icon: "Layers", order: 9 },
    { name: "Gowin / EDA Playground", category: "VLSI & EDA Tools", proficiency: "Advanced", icon: "Cpu", order: 10 },

    // Embedded & IoT
    { name: "ESP32 / Arduino", category: "Embedded & IoT", proficiency: "Advanced", icon: "Server", order: 11 },
    { name: "Firebase / Blynk", category: "Embedded & IoT", proficiency: "Advanced", icon: "Database", order: 12 },

    // Software & Tools
    { name: "Eagle (PCB Design)", category: "Software & Tools", proficiency: "Intermediate", icon: "Layout", order: 13 },
    { name: "Proteus / PSpice", category: "Software & Tools", proficiency: "Intermediate", icon: "Box", order: 14 },
    { name: "MATLAB / AutoCAD", category: "Software & Tools", proficiency: "Intermediate", icon: "Box", order: 15 },
    { name: "Git / Linux / Docker", category: "Software & Tools", proficiency: "Advanced", icon: "GitBranch", order: 16 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }

  // 2. Seed Projects
  const projectsData = [
    {
      title: "RTL-to-GDSII Automation Platform",
      tagline: "Browser-based platform automating the full RTL-to-GDSII ASIC flow into a single click.",
      description: `### Overview
A web platform that automates the complete RTL-to-GDSII flow by integrating OpenLane, Yosys, Magic, Netgen, and KLayout behind a single browser-based interface, cutting manual execution from 15+ steps down to one automated workflow.

### Technical Highlights
* **Unified Flow Orchestration**: Chains synthesis, floorplanning, placement, CTS, routing, and signoff through OpenLane without manual CLI steps.
* **Live Feedback**: Streams tool logs and stage status back to the browser during the run.
* **Remote Access**: Exposed securely via Cloudflare/ngrok tunnels for access from any machine.

### Key Learnings
* Deep hands-on exposure to the SKY130 PDK and the OpenLane ASIC flow.
* Managing long-running backend jobs and streaming their output to a web frontend.`,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
      githubUrl: "https://github.com/SanjaySurampudi",
      demoUrl: "",
      techStack: "Icarus Verilog, SKY130, OpenLane, Yosys, KLayout, HTML, CSS, Cloudflare, ngrok",
      featured: true,
      order: 1,
    },
    {
      title: "Browser-Based Verilog IDE",
      tagline: "In-browser IDE for writing, compiling, simulating, and visualizing Verilog waveforms.",
      description: `### Overview
A browser-based Verilog IDE supporting code editing, compilation, simulation, and waveform visualization, used to validate more than 30 Verilog designs without requiring a local toolchain install.

### Technical Highlights
* **Integrated Toolchain**: Wraps Icarus Verilog and Yosys inside Docker containers for sandboxed compilation and synthesis.
* **Waveform Viewer**: Renders simulation output directly in the browser.
* **Zero Local Setup**: Runs entirely server-side so students/engineers can test designs from any device.`,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600",
      githubUrl: "https://github.com/SanjaySurampudi",
      demoUrl: "",
      techStack: "HTML, CSS, Icarus Verilog, Yosys, Docker",
      featured: true,
      order: 2,
    },
    {
      title: "Long-Distance Offline Communication Using LoRa",
      tagline: "LoRa-based emergency communication system with real-time GPS sharing, no cellular network required.",
      description: `### Overview
An emergency communication system built on Arduino Uno and the LoRa SX1278 module, providing wireless communication over distances of up to 15 km along with real-time GPS location sharing in areas without cellular connectivity.

### Technical Highlights
* **Long Range Link**: LoRa SX1278 radio tuned for maximum range in open/rural terrain.
* **GPS Integration**: Neo-6M GPS module streams live coordinates alongside text messages.
* **Offline-First**: Fully functional with zero dependency on cellular or Wi-Fi infrastructure.`,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600",
      githubUrl: "https://github.com/SanjaySurampudi",
      demoUrl: "",
      techStack: "Arduino Uno, LoRa SX1278, Neo-6M GPS, C/C++, Arduino IDE",
      featured: true,
      order: 3,
    },
    {
      title: "Real-time Data Monitoring System",
      tagline: "IoT dashboard streaming live sensor readings from ESP32 to the browser every 2 seconds.",
      description: `### Overview
An IoT monitoring platform using ESP32 and Firebase that refreshes sensor data every 2 seconds and displays live readings through a responsive web dashboard for remote monitoring.

### Technical Highlights
* **Real-Time Sync**: Firebase Realtime Database pushes sensor updates straight to connected clients.
* **Multi-Sensor Support**: Interfaces with 5+ sensors for temperature, humidity, and environmental data.
* **Responsive Dashboard**: Live-updating charts built with vanilla HTML/CSS/JS.`,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
      githubUrl: "https://github.com/SanjaySurampudi",
      demoUrl: "",
      techStack: "ESP32, IoT, Firebase, HTML/CSS, JavaScript",
      featured: false,
      order: 4,
    },
  ];

  for (const project of projectsData) {
    const slug = project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await prisma.project.create({
      data: {
        ...project,
        slug,
      },
    });
  }

  // 3. Seed Experiences
  const experiencesData = [
    {
      company: "Technical Hub Pvt Ltd",
      role: "VLSI RTL Design Intern",
      location: "Surampalem, Andhra Pradesh",
      startDate: "May 2026",
      endDate: "June 2026",
      description:
        "Designed, simulated, and debugged 10+ Verilog RTL modules, strengthening expertise in digital logic design, finite-state machines, and combinational/sequential circuits.\nDeveloped an RTL-to-GDSII Automation Platform and a Browser-based Verilog IDE that integrated code editing, simulation, synthesis, and physical design into a single workflow, reducing manual design setup time by approximately 70%.",
      technologies: "Verilog, OpenLane, Yosys, KLayout, Icarus Verilog, Docker",
      order: 1,
    },
    {
      company: "Eduexpose",
      role: "IoT and Embedded Systems Intern",
      location: "Hyderabad, Telangana",
      startDate: "May 2026",
      endDate: "June 2026",
      description:
        "Built embedded applications using ESP32 and Arduino, interfaced 5+ sensors, and implemented real-time data acquisition for IoT-based systems.\nBuilt a Real-time Data Monitoring System that updated sensor readings every 2 seconds and displayed live data through a cloud-based web dashboard for remote monitoring.",
      technologies: "ESP32, Arduino, Firebase, IoT",
      order: 2,
    },
  ];

  for (const exp of experiencesData) {
    await prisma.experience.create({ data: exp });
  }

  // 4. Seed Certifications
  const certsData = [
    {
      title: "Semiconductor 101",
      issuer: "Cadence",
      issueDate: "2026",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
      order: 1,
    },
    {
      title: "Digital IC Design",
      issuer: "Cadence",
      issueDate: "2026",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
      order: 2,
    },
    {
      title: "Verilog Language and Applications",
      issuer: "Cadence",
      issueDate: "2026",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
      order: 3,
    },
    {
      title: "Microsoft Excel Certified",
      issuer: "Microsoft",
      issueDate: "2026",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
      order: 4,
    },
    {
      title: "Problem Solving Certified",
      issuer: "HackerRank",
      issueDate: "2026",
      credentialId: "",
      verifyUrl: "",
      imageUrl: "",
      order: 5,
    },
  ];

  for (const cert of certsData) {
    await prisma.certification.create({ data: cert });
  }
}
