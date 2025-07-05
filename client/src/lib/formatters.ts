import { RescuePost } from "@shared/schema";

export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRescuePost(data: RescuePost): string {
  const sections: string[] = [];

  // Header with appropriate emoji based on post type
  const typeEmojis = {
    adoption: "🏠",
    foster: "💝", 
    lost: "🔍",
    found: "📍",
    emergency: "🚨",
    transport: "🚗",
    volunteer: "👥"
  };
  
  const urgencyEmojis = {
    low: "",
    medium: "⚡",
    high: "🔥",
    critical: "🆘"
  };

  sections.push(`${typeEmojis[data.postType]} ${urgencyEmojis[data.urgency]} ${data.title.toUpperCase()} ${urgencyEmojis[data.urgency]} ${typeEmojis[data.postType]}`);
  
  const urgencyLabels = {
    low: "Low Priority",
    medium: "Medium Priority", 
    high: "High Priority",
    critical: "CRITICAL - URGENT"
  };
  
  const typeLabels = {
    adoption: "Adoption",
    foster: "Foster Needed",
    lost: "Lost Animal",
    found: "Found Animal", 
    emergency: "Emergency Rescue",
    transport: "Transport Needed",
    volunteer: "Volunteers Needed"
  };

  sections.push(`Type: ${typeLabels[data.postType]}`);
  sections.push(`Priority: ${urgencyLabels[data.urgency]}`);

  if (data.location) {
    sections.push(`Location: ${data.location}`);
  }

  if (data.deadline) {
    sections.push(`Deadline: ${formatDateForDisplay(data.deadline)}`);
  }

  // Description
  if (data.description) {
    sections.push("\n📋 DESCRIPTION");
    sections.push(data.description);
  }

  // Animals
  if (data.animals.length > 0) {
    sections.push("\n🐾 ANIMALS");
    data.animals.forEach((animal, index) => {
      sections.push(`\n▼ ${animal.name || `Animal #${index + 1}`}`);
      if (animal.species) sections.push(`Species: ${animal.species}`);
      if (animal.breed) sections.push(`Breed: ${animal.breed}`);
      if (animal.age) sections.push(`Age: ${animal.age}`);
      if (animal.color) sections.push(`Color: ${animal.color}`);
      if (animal.gender) sections.push(`Gender: ${animal.gender}`);
      if (animal.microchipId) sections.push(`Microchip ID: ${animal.microchipId}`);
      if (animal.medicalConditions) sections.push(`Medical Conditions: ${animal.medicalConditions}`);
      if (animal.specialNeeds) sections.push(`Special Needs: ${animal.specialNeeds}`);
      const photos = animal.photos.filter(photo => photo.trim());
      if (photos.length > 0) {
        sections.push(`Photos: ${photos.join(", ")}`);
      }
    });
  }

  // Contact Persons
  if (data.contactPersons.length > 0) {
    sections.push("\n📞 CONTACT INFORMATION");
    data.contactPersons.forEach((person, index) => {
      sections.push(`\n▼ Contact #${index + 1}`);
      sections.push(`Name: ${person.name}`);
      if (person.role) sections.push(`Role: ${person.role}`);
      if (person.phone) sections.push(`Phone: ${person.phone}`);
      if (person.email) sections.push(`Email: ${person.email}`);
      if (person.address) sections.push(`Address: ${person.address}`);
      const socialLinks = person.socialMedia.filter(link => link && link.trim());
      if (socialLinks.length > 0) {
        sections.push(`Social Media: ${socialLinks.join(", ")}`);
      }
    });
  }

  // Organizations
  if (data.organizations.length > 0) {
    sections.push("\n🏢 RESCUE ORGANIZATIONS");
    data.organizations.forEach((org, index) => {
      sections.push(`\n▼ Organization #${index + 1}`);
      sections.push(`Name: ${org.name}`);
      if (org.registration) sections.push(`Registration: ${org.registration}`);
      if (org.website) sections.push(`Website: ${org.website}`);
      if (org.phone) sections.push(`Phone: ${org.phone}`);
      if (org.email) sections.push(`Email: ${org.email}`);
      if (org.address) sections.push(`Address: ${org.address}`);
      if (org.capacity) sections.push(`Capacity: ${org.capacity}`);
      const specializations = org.specializations.filter(spec => spec.trim());
      if (specializations.length > 0) {
        sections.push(`Specializations: ${specializations.join(", ")}`);
      }
      const socialLinks = org.socialMedia.filter(link => link && link.trim());
      if (socialLinks.length > 0) {
        sections.push(`Social Media: ${socialLinks.join(", ")}`);
      }
    });
  }

  // Requirements
  if (data.requirements) {
    sections.push("\n✅ REQUIREMENTS");
    sections.push(data.requirements);
  }

  // Additional Info
  if (data.additionalInfo) {
    sections.push("\n💡 ADDITIONAL INFORMATION");
    sections.push(data.additionalInfo);
  }

  // Hashtags
  if (data.hashtags.length > 0) {
    sections.push("\n" + data.hashtags.map(tag => `#${tag}`).join(" "));
  }

  sections.push("\nPlease share to help these animals find loving homes! 🐕🐈");

  return sections.join("\n");
}
