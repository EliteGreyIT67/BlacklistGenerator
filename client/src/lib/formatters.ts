import { BlacklistPost } from "@shared/schema";

export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatBlacklistPost(data: BlacklistPost): string {
  const sections: string[] = [];

  // Header with warning emojis based on severity
  const severityEmojis = {
    low: "⚠️",
    medium: "🚨",
    high: "🔴",
    critical: "🆘"
  };

  sections.push(`${severityEmojis[data.severity]} ${data.alertTitle.toUpperCase()} ${severityEmojis[data.severity]}`);
  
  const severityLabels = {
    low: "Low Risk",
    medium: "Medium Risk", 
    high: "High Risk",
    critical: "CRITICAL WARNING"
  };
  
  const statusLabels = {
    investigating: "Under Investigation",
    confirmed: "Confirmed Issues",
    resolved: "Issues Resolved",
    ongoing: "Ongoing Concerns"
  };

  sections.push(`Severity: ${severityLabels[data.severity]}`);
  sections.push(`Status: ${statusLabels[data.status]}`);

  if (data.location) {
    sections.push(`Location: ${data.location}`);
  }

  if (data.dateReported) {
    sections.push(`Date Reported: ${formatDateForDisplay(data.dateReported)}`);
  }

  // Description
  if (data.briefDescription) {
    sections.push("\n📋 ALERT SUMMARY");
    sections.push(data.briefDescription);
  }

  // Individuals
  if (data.individuals.length > 0) {
    sections.push("\n👤 FLAGGED INDIVIDUALS");
    data.individuals.forEach((individual, index) => {
      sections.push(`\n▼ Individual #${index + 1}`);
      sections.push(`Name: ${individual.name}`);
      if (individual.aliases.length > 0) {
        sections.push(`Known Aliases: ${individual.aliases.join(", ")}`);
      }
      if (individual.role) sections.push(`Role/Position: ${individual.role}`);
      if (individual.dob) sections.push(`DOB: ${formatDateForDisplay(individual.dob)}`);
      if (individual.phone) sections.push(`Phone: ${individual.phone}`);
      if (individual.email) sections.push(`Email: ${individual.email}`);
      if (individual.address) sections.push(`Address: ${individual.address}`);
      if (individual.licenseNumber) sections.push(`License Number: ${individual.licenseNumber}`);
      const socialLinks = individual.socialMedia.filter(link => link && link.trim());
      if (socialLinks.length > 0) {
        sections.push(`Social Media: ${socialLinks.join(", ")}`);
      }
    });
  }

  // Organizations
  if (data.organizations.length > 0) {
    sections.push("\n🏢 FLAGGED ORGANIZATIONS");
    data.organizations.forEach((org, index) => {
      sections.push(`\n▼ Organization #${index + 1}`);
      sections.push(`Name: ${org.name}`);
      if (org.aliases.length > 0) {
        sections.push(`Known Aliases: ${org.aliases.join(", ")}`);
      }
      if (org.registration) sections.push(`Registration: ${org.registration}`);
      if (org.website) sections.push(`Website: ${org.website}`);
      if (org.phone) sections.push(`Phone: ${org.phone}`);
      if (org.email) sections.push(`Email: ${org.email}`);
      if (org.address) sections.push(`Address: ${org.address}`);
      if (org.licensingInfo) sections.push(`Licensing Info: ${org.licensingInfo}`);
      
      const statusLabels = {
        active: "Currently Active",
        suspended: "Suspended Operations",
        closed: "Closed/Shut Down",
        under_investigation: "Under Investigation"
      };
      sections.push(`Operating Status: ${statusLabels[org.operatingStatus]}`);
      
      const socialLinks = org.socialMedia.filter(link => link && link.trim());
      if (socialLinks.length > 0) {
        sections.push(`Social Media: ${socialLinks.join(", ")}`);
      }
    });
  }

  // Violations
  if (data.violations.length > 0) {
    sections.push("\n⚖️ DOCUMENTED VIOLATIONS");
    data.violations.forEach((violation, index) => {
      sections.push(`\n▼ Violation #${index + 1}`);
      
      const violationTypes = {
        neglect: "Animal Neglect",
        abuse: "Animal Abuse",
        fraud: "Fraud/Scam",
        unlicensed_operation: "Unlicensed Operation",
        false_advertising: "False Advertising",
        poor_conditions: "Poor Living Conditions",
        other: "Other Violations"
      };
      
      sections.push(`Type: ${violationTypes[violation.type]}`);
      sections.push(`Description: ${violation.description}`);
      if (violation.date) sections.push(`Date: ${formatDateForDisplay(violation.date)}`);
      if (violation.location) sections.push(`Location: ${violation.location}`);
      if (violation.reportedBy) sections.push(`Reported By: ${violation.reportedBy}`);
      if (violation.officialAction) sections.push(`Official Action: ${violation.officialAction}`);
      
      const evidence = violation.evidence.filter(link => link && link.trim());
      if (evidence.length > 0) {
        sections.push(`Evidence: ${evidence.join(", ")}`);
      }
    });
  }

  // Animal Welfare Impact
  if (data.animalWelfareImpact) {
    sections.push("\n🐾 ANIMAL WELFARE IMPACT");
    sections.push(data.animalWelfareImpact);
  }

  // Recommended Actions
  if (data.recommendedActions) {
    sections.push("\n✅ RECOMMENDED ACTIONS");
    sections.push(data.recommendedActions);
  }

  // Warning Statement
  if (data.warningStatement) {
    sections.push("\n⚠️ COMMUNITY WARNING");
    sections.push(data.warningStatement);
  }

  // Hashtags
  if (data.hashtags.length > 0) {
    sections.push("\n" + data.hashtags.map(tag => `#${tag}`).join(" "));
  }

  sections.push("\n🔄 Please share to protect animals and warn others in the rescue community");

  return sections.join("\n");
}
