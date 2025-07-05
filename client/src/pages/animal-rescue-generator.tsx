import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rescuePostSchema, templateSchema, type RescuePost, type Template, type Animal, type ContactPerson, type RescueOrganization } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatRescuePost, formatDateForDisplay } from "@/lib/formatters";
import {
  Heart,
  PawPrint,
  Users,
  Building,
  Hash,
  Info,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Save,
  FolderOpen,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultValues: RescuePost = {
  title: "",
  urgency: "medium",
  postType: "adoption",
  description: "",
  animals: [],
  contactPersons: [],
  organizations: [],
  location: "",
  deadline: "",
  requirements: "",
  additionalInfo: "",
  hashtags: [],
};

export default function AnimalRescueGenerator() {
  const { toast } = useToast();
  const [templates, setTemplates] = useLocalStorage<Template[]>("rescue-templates", []);
  const [expandedSections, setExpandedSections] = useState({
    mainInfo: true,
    animals: true,
    contacts: false,
    organizations: false,
    details: true,
  });
  const [newHashtag, setNewHashtag] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const form = useForm<RescuePost>({
    resolver: zodResolver(rescuePostSchema),
    defaultValues,
  });

  const watchedData = form.watch();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addAnimal = () => {
    const currentAnimals = form.getValues("animals");
    form.setValue("animals", [
      ...currentAnimals,
      {
        id: nanoid(),
        name: "",
        species: "",
        breed: "",
        age: "",
        color: "",
        gender: undefined,
        microchipId: "",
        medicalConditions: "",
        specialNeeds: "",
        photos: [""],
      },
    ]);
  };

  const removeAnimal = (index: number) => {
    const currentAnimals = form.getValues("animals");
    form.setValue(
      "animals",
      currentAnimals.filter((_, i) => i !== index)
    );
  };

  const moveAnimal = (index: number, direction: "up" | "down") => {
    const currentAnimals = form.getValues("animals");
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= currentAnimals.length) return;
    
    const newAnimals = [...currentAnimals];
    [newAnimals[index], newAnimals[newIndex]] = [newAnimals[newIndex], newAnimals[index]];
    form.setValue("animals", newAnimals);
  };

  const addPhoto = (animalIndex: number) => {
    const currentAnimals = form.getValues("animals");
    const updatedAnimals = [...currentAnimals];
    updatedAnimals[animalIndex].photos.push("");
    form.setValue("animals", updatedAnimals);
  };

  const removePhoto = (animalIndex: number, photoIndex: number) => {
    const currentAnimals = form.getValues("animals");
    const updatedAnimals = [...currentAnimals];
    updatedAnimals[animalIndex].photos = updatedAnimals[animalIndex].photos.filter((_, i) => i !== photoIndex);
    form.setValue("animals", updatedAnimals);
  };

  const addContactPerson = () => {
    const currentContacts = form.getValues("contactPersons");
    form.setValue("contactPersons", [
      ...currentContacts,
      {
        id: nanoid(),
        name: "",
        role: "",
        phone: "",
        email: "",
        address: "",
        socialMedia: [""],
      },
    ]);
  };

  const removeContactPerson = (index: number) => {
    const currentContacts = form.getValues("contactPersons");
    form.setValue(
      "contactPersons",
      currentContacts.filter((_, i) => i !== index)
    );
  };

  const addSocialMedia = (contactIndex: number) => {
    const currentContacts = form.getValues("contactPersons");
    const updatedContacts = [...currentContacts];
    updatedContacts[contactIndex].socialMedia.push("");
    form.setValue("contactPersons", updatedContacts);
  };

  const removeSocialMedia = (contactIndex: number, socialIndex: number) => {
    const currentContacts = form.getValues("contactPersons");
    const updatedContacts = [...currentContacts];
    updatedContacts[contactIndex].socialMedia = updatedContacts[contactIndex].socialMedia.filter((_, i) => i !== socialIndex);
    form.setValue("contactPersons", updatedContacts);
  };

  const addOrganization = () => {
    const currentOrganizations = form.getValues("organizations");
    form.setValue("organizations", [
      ...currentOrganizations,
      {
        id: nanoid(),
        name: "",
        registration: "",
        website: "",
        phone: "",
        email: "",
        address: "",
        socialMedia: [""],
        capacity: "",
        specializations: [],
      },
    ]);
  };

  const removeOrganization = (index: number) => {
    const currentOrganizations = form.getValues("organizations");
    form.setValue(
      "organizations",
      currentOrganizations.filter((_, i) => i !== index)
    );
  };

  const addSpecialization = (orgIndex: number, specialization: string) => {
    if (!specialization.trim()) return;
    
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    
    if (!updatedOrganizations[orgIndex].specializations.includes(specialization.trim())) {
      updatedOrganizations[orgIndex].specializations.push(specialization.trim());
      form.setValue("organizations", updatedOrganizations);
    }
  };

  const removeSpecialization = (orgIndex: number, specIndex: number) => {
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    updatedOrganizations[orgIndex].specializations = updatedOrganizations[orgIndex].specializations.filter((_, i) => i !== specIndex);
    form.setValue("organizations", updatedOrganizations);
  };

  const addOrgSocialMedia = (orgIndex: number) => {
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    updatedOrganizations[orgIndex].socialMedia.push("");
    form.setValue("organizations", updatedOrganizations);
  };

  const removeOrgSocialMedia = (orgIndex: number, socialIndex: number) => {
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    updatedOrganizations[orgIndex].socialMedia = updatedOrganizations[orgIndex].socialMedia.filter((_, i) => i !== socialIndex);
    form.setValue("organizations", updatedOrganizations);
  };

  const addHashtag = () => {
    if (!newHashtag.trim()) return;
    
    const currentHashtags = form.getValues("hashtags");
    const cleanTag = newHashtag.replace(/^#/, "").trim();
    
    if (!currentHashtags.includes(cleanTag)) {
      form.setValue("hashtags", [...currentHashtags, cleanTag]);
    }
    
    setNewHashtag("");
  };

  const removeHashtag = (index: number) => {
    const currentHashtags = form.getValues("hashtags");
    form.setValue("hashtags", currentHashtags.filter((_, i) => i !== index));
  };

  const copyToClipboard = async () => {
    const formattedText = formatRescuePost(watchedData);
    
    try {
      await navigator.clipboard.writeText(formattedText);
      toast({
        title: "Success",
        description: "Content copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: nanoid(),
      name: templateName,
      data: watchedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [...prev, newTemplate]);
    setTemplateName("");
    setShowSaveDialog(false);
    
    toast({
      title: "Success",
      description: "Template saved successfully!",
    });
  };

  const loadTemplate = (template: Template) => {
    form.reset(template.data);
    toast({
      title: "Success",
      description: `Template "${template.name}" loaded successfully!`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Success",
      description: "Template deleted successfully!",
    });
  };

  const renderPreview = () => {
    const data = watchedData;
    
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
    
    return (
      <div className="space-y-4 text-sm leading-relaxed">
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-600 mb-2">
            {typeEmojis[data.postType]} {urgencyEmojis[data.urgency]} {data.title.toUpperCase() || "RESCUE POST TITLE"} {urgencyEmojis[data.urgency]} {typeEmojis[data.postType]}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Type: {data.postType === "adoption" ? "Adoption" : 
                     data.postType === "foster" ? "Foster Needed" :
                     data.postType === "lost" ? "Lost Animal" :
                     data.postType === "found" ? "Found Animal" :
                     data.postType === "emergency" ? "Emergency Rescue" :
                     data.postType === "transport" ? "Transport Needed" : "Volunteers Needed"}</p>
            <p>Priority: {data.urgency === "low" ? "Low Priority" :
                         data.urgency === "medium" ? "Medium Priority" :
                         data.urgency === "high" ? "High Priority" : "CRITICAL - URGENT"}</p>
            {data.location && <p>Location: {data.location}</p>}
            {data.deadline && <p>Deadline: {formatDateForDisplay(data.deadline)}</p>}
          </div>
        </div>

        {data.description && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">📋 DESCRIPTION</h2>
            <p>{data.description}</p>
          </div>
        )}

        {data.animals.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">🐾 ANIMALS</h2>
            {data.animals.map((animal, index) => (
              <div key={animal.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-blue-900 mb-2">{animal.name || `Animal #${index + 1}`}</h3>
                <div className="space-y-1 text-sm">
                  {animal.species && <p><strong>Species:</strong> {animal.species}</p>}
                  {animal.breed && <p><strong>Breed:</strong> {animal.breed}</p>}
                  {animal.age && <p><strong>Age:</strong> {animal.age}</p>}
                  {animal.color && <p><strong>Color:</strong> {animal.color}</p>}
                  {animal.gender && <p><strong>Gender:</strong> {animal.gender}</p>}
                  {animal.microchipId && <p><strong>Microchip ID:</strong> {animal.microchipId}</p>}
                  {animal.medicalConditions && <p><strong>Medical Conditions:</strong> {animal.medicalConditions}</p>}
                  {animal.specialNeeds && <p><strong>Special Needs:</strong> {animal.specialNeeds}</p>}
                  {animal.photos.filter(photo => photo.trim()).length > 0 && (
                    <p><strong>Photos:</strong> {animal.photos.filter(photo => photo.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.contactPersons.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">📞 CONTACT INFORMATION</h2>
            {data.contactPersons.map((person, index) => (
              <div key={person.id} className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-green-900 mb-2">Contact #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {person.name && <p><strong>Name:</strong> {person.name}</p>}
                  {person.role && <p><strong>Role:</strong> {person.role}</p>}
                  {person.phone && <p><strong>Phone:</strong> {person.phone}</p>}
                  {person.email && <p><strong>Email:</strong> {person.email}</p>}
                  {person.address && <p><strong>Address:</strong> {person.address}</p>}
                  {person.socialMedia.filter(link => link && link.trim()).length > 0 && (
                    <p><strong>Social Media:</strong> {person.socialMedia.filter(link => link && link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.organizations.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">🏢 RESCUE ORGANIZATIONS</h2>
            {data.organizations.map((org, index) => (
              <div key={org.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-orange-900 mb-2">Organization #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {org.name && <p><strong>Name:</strong> {org.name}</p>}
                  {org.registration && <p><strong>Registration:</strong> {org.registration}</p>}
                  {org.website && <p><strong>Website:</strong> {org.website}</p>}
                  {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
                  {org.email && <p><strong>Email:</strong> {org.email}</p>}
                  {org.address && <p><strong>Address:</strong> {org.address}</p>}
                  {org.capacity && <p><strong>Capacity:</strong> {org.capacity}</p>}
                  {org.specializations.length > 0 && (
                    <p><strong>Specializations:</strong> {org.specializations.join(", ")}</p>
                  )}
                  {org.socialMedia.filter(link => link && link.trim()).length > 0 && (
                    <p><strong>Social Media:</strong> {org.socialMedia.filter(link => link && link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.requirements && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">✅ REQUIREMENTS</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm">{data.requirements}</p>
            </div>
          </div>
        )}

        {data.additionalInfo && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">💡 ADDITIONAL INFORMATION</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm">{data.additionalInfo}</p>
            </div>
          </div>
        )}

        {data.hashtags.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500">Please share to help these animals find loving homes! 🐕🐈</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="text-primary text-2xl mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Animal Rescue Post Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Templates
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Save as Template
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          placeholder="Enter template name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveTemplate}>Save</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {templates.length > 0 && <DropdownMenuSeparator />}
                  
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between px-2 py-1.5 text-sm">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="flex-1 text-left hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        {template.name}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Fill out the details below to create a rescue post for animals in need.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Information */}
                <Collapsible 
                  open={expandedSections.mainInfo} 
                  onOpenChange={() => toggleSection("mainInfo")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Info className="mr-2 h-4 w-4" />
                        Main Information
                      </div>
                      {expandedSections.mainInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Post Title *</label>
                      <Input
                        {...form.register("title")}
                        placeholder="e.g., Urgent: Sweet Lab Mix Needs Forever Home"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Post Type</label>
                        <Select 
                          value={form.watch("postType")} 
                          onValueChange={(value) => form.setValue("postType", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adoption">Adoption</SelectItem>
                            <SelectItem value="foster">Foster Needed</SelectItem>
                            <SelectItem value="lost">Lost Animal</SelectItem>
                            <SelectItem value="found">Found Animal</SelectItem>
                            <SelectItem value="emergency">Emergency Rescue</SelectItem>
                            <SelectItem value="transport">Transport Needed</SelectItem>
                            <SelectItem value="volunteer">Volunteers Needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Select 
                          value={form.watch("urgency")} 
                          onValueChange={(value) => form.setValue("urgency", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="critical">CRITICAL - URGENT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          {...form.register("location")}
                          placeholder="City, State or Region"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Deadline</label>
                        <Input
                          {...form.register("deadline")}
                          type="date"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        {...form.register("description")}
                        placeholder="Provide a detailed description of the situation..."
                        rows={4}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Animals Section */}
                <Collapsible 
                  open={expandedSections.animals} 
                  onOpenChange={() => toggleSection("animals")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <PawPrint className="mr-2 h-4 w-4" />
                        Animals ({form.watch("animals").length})
                      </div>
                      {expandedSections.animals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {form.watch("animals").map((animal, index) => (
                      <Card key={animal.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Animal #{index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveAnimal(index, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveAnimal(index, "down")}
                              disabled={index === form.watch("animals").length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAnimal(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                              {...form.register(`animals.${index}.name`)}
                              placeholder="Animal's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Species</label>
                            <Input
                              {...form.register(`animals.${index}.species`)}
                              placeholder="Dog, Cat, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Breed</label>
                            <Input
                              {...form.register(`animals.${index}.breed`)}
                              placeholder="Breed or mix"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Age</label>
                            <Input
                              {...form.register(`animals.${index}.age`)}
                              placeholder="2 years, 6 months, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Color</label>
                            <Input
                              {...form.register(`animals.${index}.color`)}
                              placeholder="Brown, black and white, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <Select 
                              value={form.watch(`animals.${index}.gender`) || ""} 
                              onValueChange={(value) => form.setValue(`animals.${index}.gender`, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Microchip ID</label>
                          <Input
                            {...form.register(`animals.${index}.microchipId`)}
                            placeholder="Microchip number (if known)"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                          <Textarea
                            {...form.register(`animals.${index}.medicalConditions`)}
                            placeholder="Any medical conditions or treatments needed..."
                            rows={2}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Special Needs</label>
                          <Textarea
                            {...form.register(`animals.${index}.specialNeeds`)}
                            placeholder="Special care requirements, behavioral notes, etc..."
                            rows={2}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Photo URLs</label>
                          {animal.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="flex items-center space-x-2 mb-2">
                              <Input
                                {...form.register(`animals.${index}.photos.${photoIndex}`)}
                                placeholder="Photo URL"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhoto(index, photoIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addPhoto(index)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Photo URL
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAnimal}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Animal
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Contact Persons Section */}
                <Collapsible 
                  open={expandedSections.contacts} 
                  onOpenChange={() => toggleSection("contacts")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Contact Persons ({form.watch("contactPersons").length})
                      </div>
                      {expandedSections.contacts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {form.watch("contactPersons").map((person, index) => (
                      <Card key={person.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Contact #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContactPerson(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <Input
                              {...form.register(`contactPersons.${index}.name`)}
                              placeholder="Contact person's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <Input
                              {...form.register(`contactPersons.${index}.role`)}
                              placeholder="Volunteer, Foster Coordinator, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                              {...form.register(`contactPersons.${index}.phone`)}
                              placeholder="Phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                              {...form.register(`contactPersons.${index}.email`)}
                              placeholder="Email address"
                              type="email"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <Input
                            {...form.register(`contactPersons.${index}.address`)}
                            placeholder="Contact address"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Social Media Links</label>
                          {person.socialMedia.map((link, socialIndex) => (
                            <div key={socialIndex} className="flex items-center space-x-2 mb-2">
                              <Input
                                {...form.register(`contactPersons.${index}.socialMedia.${socialIndex}`)}
                                placeholder="Social media URL"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSocialMedia(index, socialIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSocialMedia(index)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Social Link
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addContactPerson}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Contact Person
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Organizations Section */}
                <Collapsible 
                  open={expandedSections.organizations} 
                  onOpenChange={() => toggleSection("organizations")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Rescue Organizations ({form.watch("organizations").length})
                      </div>
                      {expandedSections.organizations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {form.watch("organizations").map((org, index) => (
                      <Card key={org.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Organization #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrganization(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Organization Name *</label>
                            <Input
                              {...form.register(`organizations.${index}.name`)}
                              placeholder="Rescue organization name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Registration Number</label>
                            <Input
                              {...form.register(`organizations.${index}.registration`)}
                              placeholder="501(c)(3) or registration number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <Input
                              {...form.register(`organizations.${index}.website`)}
                              placeholder="Organization website"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                              {...form.register(`organizations.${index}.phone`)}
                              placeholder="Phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                              {...form.register(`organizations.${index}.email`)}
                              placeholder="Contact email"
                              type="email"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Capacity</label>
                            <Input
                              {...form.register(`organizations.${index}.capacity`)}
                              placeholder="Number of animals they can handle"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <Input
                            {...form.register(`organizations.${index}.address`)}
                            placeholder="Organization address"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Specializations</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {org.specializations.map((spec, specIndex) => (
                              <Badge key={specIndex} variant="secondary">
                                {spec}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-4 w-4 p-0"
                                  onClick={() => removeSpecialization(index, specIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add specialization (e.g., Dogs, Senior Animals, Medical Care)"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addSpecialization(index, e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addSpecialization(index, input.value);
                                input.value = "";
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Social Media Links</label>
                          {org.socialMedia.map((link, socialIndex) => (
                            <div key={socialIndex} className="flex items-center space-x-2 mb-2">
                              <Input
                                {...form.register(`organizations.${index}.socialMedia.${socialIndex}`)}
                                placeholder="Social media URL"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOrgSocialMedia(index, socialIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOrgSocialMedia(index)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Social Link
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOrganization}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Organization
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Additional Details */}
                <Collapsible 
                  open={expandedSections.details} 
                  onOpenChange={() => toggleSection("details")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Hash className="mr-2 h-4 w-4" />
                        Additional Details
                      </div>
                      {expandedSections.details ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Requirements</label>
                      <Textarea
                        {...form.register("requirements")}
                        placeholder="Requirements for adoption, fostering, or volunteering..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Information</label>
                      <Textarea
                        {...form.register("additionalInfo")}
                        placeholder="Any other important information..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Hashtags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.watch("hashtags").map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            #{tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-4 w-4 p-0"
                              onClick={() => removeHashtag(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add hashtag (without #)"
                          value={newHashtag}
                          onChange={(e) => setNewHashtag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addHashtag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addHashtag}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Live Preview</CardTitle>
                    <Button onClick={copyToClipboard} className="flex items-center space-x-2">
                      <Copy className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white">
                    {renderPreview()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}