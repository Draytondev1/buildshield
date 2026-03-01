export interface AssessmentFormData {
  address: string;
  latitude: number;
  longitude: number;
  roofType: string;
  roofAge: number;
  buildingUse: string;
}

export interface WeatherMetrics {
  freezeThawDays: number;
  annualPrecipitation: number;
  thermalShockEvents: number;
  highHumidityHours: number;
  extremeColdHours: number;
  extremeHeatHours: number;
  temperatureRange: number;
  avgHumidity: number;
  heavyRainEvents: number;
  maxWindSpeed: number;
}

export interface Report {
  id: string;
  userId: string;
  propertyAddress: string;
  roofType: string;
  roofAge: number;
  buildingUse: string;
  weatherMetrics: WeatherMetrics;
  aiReport: string;
  pdfUrl: string | null;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserCredits {
  userId: string;
  creditsRemaining: number;
  totalReportsGenerated: number;
}

export interface ExpertQuote {
  name: string;
  title: string;
  quote: string;
}

export interface RiskAssessment {
  component: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  findings: string;
}

export interface Recommendation {
  timeframe: 'immediate' | 'short-term' | 'long-term';
  title: string;
  description: string;
  estimatedCost: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}
