import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blacklistPostSchema, templateSchema, type BlacklistPost, type Template, type Individual, type Organization, type Violation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatBlacklistPost, formatDateForDisplay } from "@/lib/formatters";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
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
  AlertTriangle,
  Scale,
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

const defaultValues: BlacklistPost = {
  alertTitle: "",
  severity: "medium",
  status: "investigating",
  dateReported: "",
  location: "",
  briefDescription: "",
  individuals: [],
  organizations: [],
  violations: [],
  animalWelfareImpact: "",
  recommendedActions: "",
  warningStatement: "",
  hashtags: [],
};

export default function BlacklistGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedSections, setExpandedSections] = useState({
    mainInfo: true,
    individuals: true,
    organizations: false,
    violations: false,
    details: true,
  });
  const [newHashtag, setNewHashtag] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Fetch templates from database
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      return await response.json() as Template[];
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: { name: string; data: string }) => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) throw new Error("Failed to create template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setTemplateName("");
      setShowSaveDialog(false);
      toast({
        title: "Success",
        description: "Template saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const form = useForm<BlacklistPost>({
    resolver: zodResolver(blacklistPostSchema),
    defaultValues,
  });

  const watchedData = form.watch();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addIndividual = () => {
    const currentIndividuals = form.getValues("individuals");
    form.setValue("individuals", [
      ...currentIndividuals,
      {
        id: nanoid(),
        name: "",
        aliases: [],
        dob: "",
        phone: "",
        email: "",
        address: "",
        socialMedia: [""],
        role: "",
        licenseNumber: "",
      },
    ]);
  };

  const removeIndividual = (index: number) => {
    const currentIndividuals = form.getValues("individuals");
    form.setValue(
      "individuals",
      currentIndividuals.filter((_, i) => i !== index)
    );
  };

  const addAlias = (individualIndex: number, alias: string) => {
    if (!alias.trim()) return;
    
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    
    if (!updatedIndividuals[individualIndex].aliases.includes(alias.trim())) {
      updatedIndividuals[individualIndex].aliases.push(alias.trim());
      form.setValue("individuals", updatedIndividuals);
    }
  };

  const removeAlias = (individualIndex: number, aliasIndex: number) => {
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    updatedIndividuals[individualIndex].aliases = updatedIndividuals[individualIndex].aliases.filter((_, i) => i !== aliasIndex);
    form.setValue("individuals", updatedIndividuals);
  };

  const addSocialMedia = (individualIndex: number) => {
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    updatedIndividuals[individualIndex].socialMedia.push("");
    form.setValue("individuals", updatedIndividuals);
  };

  const removeSocialMedia = (individualIndex: number, socialIndex: number) => {
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    updatedIndividuals[individualIndex].socialMedia = updatedIndividuals[individualIndex].socialMedia.filter((_, i) => i !== socialIndex);
    form.setValue("individuals", updatedIndividuals);
  };

  const addOrganization = () => {
    const currentOrganizations = form.getValues("organizations");
    form.setValue("organizations", [
      ...currentOrganizations,
      {
        id: nanoid(),
        name: "",
        aliases: [],
        registration: "",
        website: "",
        phone: "",
        email: "",
        address: "",
        socialMedia: [""],
        operatingStatus: "active",
        licensingInfo: "",
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

  const addOrgAlias = (orgIndex: number, alias: string) => {
    if (!alias.trim()) return;
    
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    
    if (!updatedOrganizations[orgIndex].aliases.includes(alias.trim())) {
      updatedOrganizations[orgIndex].aliases.push(alias.trim());
      form.setValue("organizations", updatedOrganizations);
    }
  };

  const removeOrgAlias = (orgIndex: number, aliasIndex: number) => {
    const currentOrganizations = form.getValues("organizations");
    const updatedOrganizations = [...currentOrganizations];
    updatedOrganizations[orgIndex].aliases = updatedOrganizations[orgIndex].aliases.filter((_, i) => i !== aliasIndex);
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

  const addViolation = () => {
    const currentViolations = form.getValues("violations");
    form.setValue("violations", [
      ...currentViolations,
      {
        id: nanoid(),
        type: "other",
        description: "",
        date: "",
        location: "",
        evidence: [""],
        reportedBy: "",
        officialAction: "",
      },
    ]);
  };

  const removeViolation = (index: number) => {
    const currentViolations = form.getValues("violations");
    form.setValue(
      "violations",
      currentViolations.filter((_, i) => i !== index)
    );
  };

  const addEvidence = (violationIndex: number) => {
    const currentViolations = form.getValues("violations");
    const updatedViolations = [...currentViolations];
    updatedViolations[violationIndex].evidence.push("");
    form.setValue("violations", updatedViolations);
  };

  const removeEvidence = (violationIndex: number, evidenceIndex: number) => {
    const currentViolations = form.getValues("violations");
    const updatedViolations = [...currentViolations];
    updatedViolations[violationIndex].evidence = updatedViolations[violationIndex].evidence.filter((_, i) => i !== evidenceIndex);
    form.setValue("violations", updatedViolations);
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
    const formattedText = formatBlacklistPost(watchedData);
    
    try {
      await navigator.clipboard.writeText(formattedText);
      toast({
        title: "Success",
        description: "Alert copied to clipboard!",
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

    createTemplateMutation.mutate({
      name: templateName,
      data: JSON.stringify(watchedData),
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
    deleteTemplateMutation.mutate(templateId);
  };

  const renderPreview = () => {
    const data = watchedData;
    
    const severityEmojis = {
      low: "⚠️",
      medium: "🚨",
      high: "🔴",
      critical: "🆘"
    };
    
    return (
      <div className="space-y-4 text-sm leading-relaxed">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            {severityEmojis[data.severity]} {data.alertTitle.toUpperCase() || "ALERT TITLE"} {severityEmojis[data.severity]}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Severity: {data.severity === "low" ? "Low Risk" :
                         data.severity === "medium" ? "Medium Risk" :
                         data.severity === "high" ? "High Risk" : "CRITICAL WARNING"}</p>
            <p>Status: {data.status === "investigating" ? "Under Investigation" :
                       data.status === "confirmed" ? "Confirmed Issues" :
                       data.status === "blacklisted" ? "Blacklisted" :
                       data.status === "resolved" ? "Issues Resolved" : "Ongoing Concerns"}</p>
            {data.location && <p>Location: {data.location}</p>}
            {data.dateReported && <p>Date Reported: {formatDateForDisplay(data.dateReported)}</p>}
          </div>
        </div>

        {data.briefDescription && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">📋 ALERT SUMMARY</h2>
            <p>{data.briefDescription}</p>
          </div>
        )}

        {data.individuals.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">👤 FLAGGED INDIVIDUALS</h2>
            {data.individuals.map((individual, index) => (
              <div key={individual.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-red-900 mb-2">Individual #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {individual.name && <p><strong>Name:</strong> {individual.name}</p>}
                  {individual.aliases.length > 0 && <p><strong>Known Aliases:</strong> {individual.aliases.join(", ")}</p>}
                  {individual.role && <p><strong>Role/Position:</strong> {individual.role}</p>}
                  {individual.dob && <p><strong>DOB:</strong> {formatDateForDisplay(individual.dob)}</p>}
                  {individual.phone && <p><strong>Phone:</strong> {individual.phone}</p>}
                  {individual.email && <p><strong>Email:</strong> {individual.email}</p>}
                  {individual.address && <p><strong>Address:</strong> {individual.address}</p>}
                  {individual.licenseNumber && <p><strong>License Number:</strong> {individual.licenseNumber}</p>}
                  {individual.socialMedia.filter(link => link && link.trim()).length > 0 && (
                    <p><strong>Social Media:</strong> {individual.socialMedia.filter(link => link && link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.organizations.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">🏢 FLAGGED ORGANIZATIONS</h2>
            {data.organizations.map((org, index) => (
              <div key={org.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-orange-900 mb-2">Organization #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {org.name && <p><strong>Name:</strong> {org.name}</p>}
                  {org.aliases.length > 0 && <p><strong>Known Aliases:</strong> {org.aliases.join(", ")}</p>}
                  {org.registration && <p><strong>Registration:</strong> {org.registration}</p>}
                  {org.website && <p><strong>Website:</strong> {org.website}</p>}
                  {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
                  {org.email && <p><strong>Email:</strong> {org.email}</p>}
                  {org.address && <p><strong>Address:</strong> {org.address}</p>}
                  {org.licensingInfo && <p><strong>Licensing Info:</strong> {org.licensingInfo}</p>}
                  <p><strong>Operating Status:</strong> {
                    org.operatingStatus === "active" ? "Currently Active" :
                    org.operatingStatus === "suspended" ? "Suspended Operations" :
                    org.operatingStatus === "closed" ? "Closed/Shut Down" : "Under Investigation"
                  }</p>
                  {org.socialMedia.filter(link => link && link.trim()).length > 0 && (
                    <p><strong>Social Media:</strong> {org.socialMedia.filter(link => link && link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.violations.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">⚖️ DOCUMENTED VIOLATIONS</h2>
            {data.violations.map((violation, index) => (
              <div key={violation.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-yellow-900 mb-2">Violation #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Type:</strong> {
                    violation.type === "neglect" ? "Animal Neglect" :
                    violation.type === "abuse" ? "Animal Abuse" :
                    violation.type === "fraud" ? "Fraud/Scam" :
                    violation.type === "unlicensed_operation" ? "Unlicensed Operation" :
                    violation.type === "false_advertising" ? "False Advertising" :
                    violation.type === "poor_conditions" ? "Poor Living Conditions" : "Other Violations"
                  }</p>
                  {violation.description && <p><strong>Description:</strong> {violation.description}</p>}
                  {violation.date && <p><strong>Date:</strong> {formatDateForDisplay(violation.date)}</p>}
                  {violation.location && <p><strong>Location:</strong> {violation.location}</p>}
                  {violation.reportedBy && <p><strong>Reported By:</strong> {violation.reportedBy}</p>}
                  {violation.officialAction && <p><strong>Official Action:</strong> {violation.officialAction}</p>}
                  {violation.evidence.filter(link => link && link.trim()).length > 0 && (
                    <p><strong>Evidence:</strong> {violation.evidence.filter(link => link && link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.animalWelfareImpact && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">🐾 ANIMAL WELFARE IMPACT</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm">{data.animalWelfareImpact}</p>
            </div>
          </div>
        )}

        {data.recommendedActions && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">✅ RECOMMENDED ACTIONS</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm">{data.recommendedActions}</p>
            </div>
          </div>
        )}

        {data.warningStatement && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">⚠️ COMMUNITY WARNING</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm">{data.warningStatement}</p>
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
          <p className="text-xs text-gray-500">🔄 Please share to protect animals and warn others in the rescue community</p>
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
              <Shield className="text-red-600 text-2xl mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Animal Rescue Blacklist Generator</h1>
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
                <CardTitle>Alert Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Document and report issues with animal rescue organizations and individuals.
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
                      <label className="block text-sm font-medium mb-2">Alert Title *</label>
                      <Input
                        {...form.register("alertTitle")}
                        placeholder="e.g., WARNING: Unlicensed Rescue Operation - Midwest Animal Haven"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Severity Level</label>
                        <Select 
                          value={form.watch("severity")} 
                          onValueChange={(value) => form.setValue("severity", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                            <SelectItem value="critical">CRITICAL WARNING</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Investigation Status</label>
                        <Select 
                          value={form.watch("status")} 
                          onValueChange={(value) => form.setValue("status", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investigating">Under Investigation</SelectItem>
                            <SelectItem value="confirmed">Confirmed Issues</SelectItem>
                            <SelectItem value="blacklisted">Blacklisted</SelectItem>
                            <SelectItem value="resolved">Issues Resolved</SelectItem>
                            <SelectItem value="ongoing">Ongoing Concerns</SelectItem>
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
                        <label className="block text-sm font-medium mb-2">Date Reported</label>
                        <Input
                          {...form.register("dateReported")}
                          type="date"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Brief Description</label>
                      <Textarea
                        {...form.register("briefDescription")}
                        placeholder="Provide a brief summary of the issues or concerns..."
                        rows={4}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Individuals Section */}
                <Collapsible 
                  open={expandedSections.individuals} 
                  onOpenChange={() => toggleSection("individuals")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Flagged Individuals ({form.watch("individuals").length})
                      </div>
                      {expandedSections.individuals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {form.watch("individuals").map((individual, index) => (
                      <Card key={individual.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Individual #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIndividual(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <Input
                              {...form.register(`individuals.${index}.name`)}
                              placeholder="Full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Role/Position</label>
                            <Input
                              {...form.register(`individuals.${index}.role`)}
                              placeholder="Director, Volunteer, Foster, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <Input
                              {...form.register(`individuals.${index}.phone`)}
                              placeholder="Phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                              {...form.register(`individuals.${index}.email`)}
                              placeholder="Email address"
                              type="email"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Date of Birth</label>
                            <Input
                              {...form.register(`individuals.${index}.dob`)}
                              type="date"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">License Number</label>
                            <Input
                              {...form.register(`individuals.${index}.licenseNumber`)}
                              placeholder="Professional license number"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <Input
                            {...form.register(`individuals.${index}.address`)}
                            placeholder="Full address"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Known Aliases</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {individual.aliases.map((alias, aliasIndex) => (
                              <Badge key={aliasIndex} variant="secondary">
                                {alias}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-4 w-4 p-0"
                                  onClick={() => removeAlias(index, aliasIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add alias"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addAlias(index, e.currentTarget.value);
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
                                addAlias(index, input.value);
                                input.value = "";
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Social Media Links</label>
                          {individual.socialMedia.map((link, socialIndex) => (
                            <div key={socialIndex} className="flex items-center space-x-2 mb-2">
                              <Input
                                {...form.register(`individuals.${index}.socialMedia.${socialIndex}`)}
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
                      onClick={addIndividual}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Individual
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
                        Flagged Organizations ({form.watch("organizations").length})
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
                              placeholder="Organization name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Operating Status</label>
                            <Select 
                              value={form.watch(`organizations.${index}.operatingStatus`) || "active"} 
                              onValueChange={(value) => form.setValue(`organizations.${index}.operatingStatus`, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Currently Active</SelectItem>
                                <SelectItem value="suspended">Suspended Operations</SelectItem>
                                <SelectItem value="closed">Closed/Shut Down</SelectItem>
                                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                              </SelectContent>
                            </Select>
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
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <Input
                            {...form.register(`organizations.${index}.address`)}
                            placeholder="Full address"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Licensing Information</label>
                          <Textarea
                            {...form.register(`organizations.${index}.licensingInfo`)}
                            placeholder="Licensing details, violations, or lack thereof..."
                            rows={2}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Known Aliases</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {org.aliases.map((alias, aliasIndex) => (
                              <Badge key={aliasIndex} variant="secondary">
                                {alias}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-4 w-4 p-0"
                                  onClick={() => removeOrgAlias(index, aliasIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add alias"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addOrgAlias(index, e.currentTarget.value);
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
                                addOrgAlias(index, input.value);
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

                {/* Violations Section */}
                <Collapsible 
                  open={expandedSections.violations} 
                  onOpenChange={() => toggleSection("violations")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Scale className="mr-2 h-4 w-4" />
                        Documented Violations ({form.watch("violations").length})
                      </div>
                      {expandedSections.violations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    {form.watch("violations").map((violation, index) => (
                      <Card key={violation.id} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Violation #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeViolation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Violation Type</label>
                            <Select 
                              value={form.watch(`violations.${index}.type`) || "other"} 
                              onValueChange={(value) => form.setValue(`violations.${index}.type`, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="neglect">Animal Neglect</SelectItem>
                                <SelectItem value="abuse">Animal Abuse</SelectItem>
                                <SelectItem value="fraud">Fraud/Scam</SelectItem>
                                <SelectItem value="unlicensed_operation">Unlicensed Operation</SelectItem>
                                <SelectItem value="false_advertising">False Advertising</SelectItem>
                                <SelectItem value="poor_conditions">Poor Living Conditions</SelectItem>
                                <SelectItem value="other">Other Violations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                              {...form.register(`violations.${index}.date`)}
                              type="date"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Description *</label>
                          <Textarea
                            {...form.register(`violations.${index}.description`)}
                            placeholder="Detailed description of the violation..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                              {...form.register(`violations.${index}.location`)}
                              placeholder="Where the violation occurred"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Reported By</label>
                            <Input
                              {...form.register(`violations.${index}.reportedBy`)}
                              placeholder="Who reported this violation"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Official Action Taken</label>
                          <Textarea
                            {...form.register(`violations.${index}.officialAction`)}
                            placeholder="Any official actions, investigations, or penalties..."
                            rows={2}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Evidence Links</label>
                          {violation.evidence.map((evidence, evidenceIndex) => (
                            <div key={evidenceIndex} className="flex items-center space-x-2 mb-2">
                              <Input
                                {...form.register(`violations.${index}.evidence.${evidenceIndex}`)}
                                placeholder="Evidence URL (photos, documents, news articles)"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEvidence(index, evidenceIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addEvidence(index)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Evidence Link
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addViolation}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Violation
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
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Additional Details
                      </div>
                      {expandedSections.details ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Animal Welfare Impact</label>
                      <Textarea
                        {...form.register("animalWelfareImpact")}
                        placeholder="How these issues have affected animal welfare..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Recommended Actions</label>
                      <Textarea
                        {...form.register("recommendedActions")}
                        placeholder="What actions should the community take..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Community Warning</label>
                      <Textarea
                        {...form.register("warningStatement")}
                        placeholder="Direct warning statement to the rescue community..."
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
                      <span>Copy Alert</span>
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