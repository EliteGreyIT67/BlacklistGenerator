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

  // Header
  sections.push(`🚨 ${data.caseTitle.toUpperCase()} 🚨`);
  
  if (data.incidentDate) {
    sections.push(`Case Date: ${formatDateForDisplay(data.incidentDate)}`);
  }
  
  const statusLabels = {
    investigating: "Under Investigation",
    confirmed: "Confirmed Fraud",
    resolved: "Resolved"
  };
  sections.push(`Status: ${statusLabels[data.caseStatus]}`);

  // Case Overview
  if (data.briefDescription) {
    sections.push("\n📋 CASE OVERVIEW");
    sections.push(data.briefDescription);
  }

  // Individuals
  if (data.individuals.length > 0) {
    sections.push("\n👤 BLACKLISTED INDIVIDUALS");
    data.individuals.forEach((individual, index) => {
      sections.push(`\n▼ Individual #${index + 1}`);
      sections.push(`Name: ${individual.name}`);
      if (individual.dob) sections.push(`DOB: ${formatDateForDisplay(individual.dob)}`);
      if (individual.phone) sections.push(`Phone: ${individual.phone}`);
      if (individual.email) sections.push(`Email: ${individual.email}`);
      if (individual.address) sections.push(`Address: ${individual.address}`);
      const socialLinks = individual.socialMedia.filter(link => link.trim());
      if (socialLinks.length > 0) {
        sections.push(`Social Media: ${socialLinks.join(", ")}`);
      }
    });
  }

  // Aliases
  if (data.aliases.length > 0) {
    sections.push("\n🎭 KNOWN ALIASES");
    data.aliases.forEach(alias => sections.push(`• ${alias}`));
  }

  // Organizations
  if (data.organizations.length > 0) {
    sections.push("\n🏢 ASSOCIATED ORGANIZATIONS");
    data.organizations.forEach((org, index) => {
      sections.push(`\n▼ Organization #${index + 1}`);
      sections.push(`Name: ${org.name}`);
      if (org.registration) sections.push(`Registration: ${org.registration}`);
      if (org.website) sections.push(`Website: ${org.website}`);
      if (org.phone) sections.push(`Phone: ${org.phone}`);
      if (org.address) sections.push(`Address: ${org.address}`);
    });
  }

  // Summary
  if (data.summaryStatement) {
    sections.push("\n⚠️ WARNING SUMMARY");
    sections.push(data.summaryStatement);
  }

  // Hashtags
  if (data.hashtags.length > 0) {
    sections.push("\n" + data.hashtags.map(tag => `#${tag}`).join(" "));
  }

  sections.push("\nShare this information to protect others from fraud");

  return sections.join("\n");
}
