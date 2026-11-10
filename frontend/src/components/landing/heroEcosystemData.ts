export type EcosystemLayer = "inner" | "middle" | "outer";

export interface TechNodeConfig {
  id: string;
  name: string;
  category: string;
  layer: EcosystemLayer;
  orbitIndex: 0 | 1 | 2;
  logo: string;
  angleOffset: number;
  floatPhase: number;
  hasCoreLink?: boolean;
  linkColor?: string;
}

export interface OrbitRingConfig {
  index: 0 | 1 | 2;
  layer: EcosystemLayer;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  ringColor: string;
  ringOpacity: number;
}

export const ORBIT_RINGS: OrbitRingConfig[] = [
  {
    index: 0,
    layer: "inner",
    radius: 2.05,
    speed: 0.042,
    tilt: [0.5, 0.04, -0.04],
    ringColor: "#CBD5E1", // refined neutral grey
    ringOpacity: 0.52,
  },
  {
    index: 1,
    layer: "middle",
    radius: 2.95,
    speed: 0.024,
    tilt: [0.46, -0.04, 0.04],
    ringColor: "#BFDBFE", // very light BREXAL blue
    ringOpacity: 0.62,
  },
  {
    index: 2,
    layer: "outer",
    radius: 3.8,
    speed: 0.013,
    tilt: [0.52, 0.03, -0.03],
    ringColor: "#DDD6FE", // soft lavender accent
    ringOpacity: 0.52,
  },
];

// 17 official technology nodes arranged across 3 balanced orbital depth layers
export const TECH_NODES: TechNodeConfig[] = [
  // INNER LAYER (8): Programming Languages & Development Technologies (45 deg intervals)
  {
    id: "python",
    name: "Python",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/python.svg",
    angleOffset: 0,
    floatPhase: 0.0,
    hasCoreLink: true,
    linkColor: "#93C5FD",
  },
  {
    id: "java",
    name: "Java",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/java.svg",
    angleOffset: Math.PI * 0.25,
    floatPhase: 0.8,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/javascript.svg",
    angleOffset: Math.PI * 0.5,
    floatPhase: 1.6,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/typescript.svg",
    angleOffset: Math.PI * 0.75,
    floatPhase: 2.4,
  },
  {
    id: "go",
    name: "Go",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/go.svg",
    angleOffset: Math.PI,
    floatPhase: 3.2,
    hasCoreLink: true,
    linkColor: "#CBD5E1",
  },
  {
    id: "rust",
    name: "Rust",
    category: "Programming",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/rust.svg",
    angleOffset: Math.PI * 1.25,
    floatPhase: 4.0,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Development",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/nodejs.svg",
    angleOffset: Math.PI * 1.5,
    floatPhase: 4.8,
  },
  {
    id: "dotnet",
    name: ".NET Core",
    category: "Development",
    layer: "inner",
    orbitIndex: 0,
    logo: "/logos/dotnet.svg",
    angleOffset: Math.PI * 1.75,
    floatPhase: 5.6,
  },

  // MIDDLE LAYER (6): Cloud Platforms & Infrastructure Technologies (60 deg intervals, interleaved)
  {
    id: "aws",
    name: "AWS",
    category: "Cloud Platform",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/aws.svg",
    angleOffset: Math.PI / 6,
    floatPhase: 0.5,
    hasCoreLink: true,
    linkColor: "#93C5FD",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "Cloud Platform",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/gcp.svg",
    angleOffset: Math.PI / 6 + (Math.PI * 2) / 6,
    floatPhase: 1.5,
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    category: "Cloud Platform",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/azure.svg",
    angleOffset: Math.PI / 6 + ((Math.PI * 2) * 2) / 6,
    floatPhase: 2.5,
  },
  {
    id: "terraform",
    name: "Terraform",
    category: "Infrastructure",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/terraform.svg",
    angleOffset: Math.PI / 6 + ((Math.PI * 2) * 3) / 6,
    floatPhase: 3.5,
  },
  {
    id: "docker",
    name: "Docker",
    category: "Infrastructure",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/docker.svg",
    angleOffset: Math.PI / 6 + ((Math.PI * 2) * 4) / 6,
    floatPhase: 4.5,
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Infrastructure",
    layer: "middle",
    orbitIndex: 1,
    logo: "/logos/kubernetes.svg",
    angleOffset: Math.PI / 6 + ((Math.PI * 2) * 5) / 6,
    floatPhase: 5.5,
    hasCoreLink: true,
    linkColor: "#CBD5E1",
  },

  // OUTER LAYER (3): Database, Messaging & Observability Technologies (120 deg equilateral intervals)
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    layer: "outer",
    orbitIndex: 2,
    logo: "/logos/postgresql.svg",
    angleOffset: 0.35,
    floatPhase: 1.1,
    hasCoreLink: true,
    linkColor: "#CBD5E1",
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Messaging",
    layer: "outer",
    orbitIndex: 2,
    logo: "/logos/kafka.svg",
    angleOffset: 0.35 + (Math.PI * 2) / 3,
    floatPhase: 3.1,
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    category: "Observability",
    layer: "outer",
    orbitIndex: 2,
    logo: "/logos/opentelemetry.svg",
    angleOffset: 0.35 + ((Math.PI * 2) * 2) / 3,
    floatPhase: 5.1,
    hasCoreLink: true,
    linkColor: "#93C5FD",
  },
];

// Selected core-bound connection nodes (subtle, engineered telemetry topology)
export const CORE_LINK_NODE_IDS: string[] = TECH_NODES.filter(
  (n) => n.hasCoreLink
).map((n) => n.id);

// Only 4 selected paths carry subtle animated signal particles inward to the BREXAL core
export const SIGNAL_LINK_NODE_IDS: string[] = [
  "opentelemetry",
  "aws",
  "python",
  "postgresql",
];
